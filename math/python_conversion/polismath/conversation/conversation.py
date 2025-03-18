"""
Core conversation management and processing for Pol.is.

This module handles mathematical processing of conversation data,
including votes, clustering, and representativeness calculation.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple, Union, Any, Set, Callable
from copy import deepcopy
import time
import logging
from datetime import datetime

from polismath.math.named_matrix import NamedMatrix
from polismath.math.pca import pca_project_named_matrix
from polismath.math.clusters import cluster_named_matrix
from polismath.math.repness import conv_repness, participant_stats
from polismath.math.corr import compute_correlation
from polismath.utils.general import agree, disagree, pass_vote


# Constants for conversation management
MAX_PTPTS = 5000  # Maximum number of participants per conversation
MAX_CMTS = 400    # Maximum number of comments per conversation
SMALL_CONV_THRESHOLD = 1000  # Threshold for small vs large conversation


# Logging configuration
logger = logging.getLogger(__name__)


class Conversation:
    """
    Manages the state and computation for a Pol.is conversation.
    """
    
    def __init__(self, 
                conversation_id: str, 
                last_updated: Optional[int] = None,
                votes: Optional[Dict[str, Any]] = None):
        """
        Initialize a conversation.
        
        Args:
            conversation_id: Unique identifier for the conversation
            last_updated: Timestamp of last update (milliseconds since epoch)
            votes: Initial votes data
        """
        self.conversation_id = conversation_id
        self.last_updated = last_updated or int(time.time() * 1000)
        
        # Initialize empty state
        self.raw_rating_mat = NamedMatrix()  # All votes
        self.rating_mat = NamedMatrix()      # Filtered for moderation
        
        # Participant and comment info
        self.participant_count = 0
        self.comment_count = 0
        
        # Moderation state
        self.mod_out_tids = set()   # Excluded comments
        self.mod_in_tids = set()    # Featured comments
        self.meta_tids = set()      # Meta comments
        self.mod_out_ptpts = set()  # Excluded participants
        
        # Clustering and projection state
        self.pca = None
        self.base_clusters = []
        self.group_clusters = []
        self.subgroup_clusters = {}
        self.proj = {}
        self.repness = None
        self.consensus = []
        self.participant_info = {}
        self.vote_stats = {}
        
        # Initialize with votes if provided
        if votes:
            self.update_votes(votes)
    
    def update_votes(self, 
                    votes: Dict[str, Any],
                    recompute: bool = True) -> 'Conversation':
        """
        Update the conversation with new votes.
        
        Args:
            votes: Dictionary of votes
            recompute: Whether to recompute the clustering
            
        Returns:
            Updated conversation
        """
        # Create a copy to avoid modifying the original
        result = deepcopy(self)
        
        # Extract vote data
        vote_data = votes.get('votes', [])
        last_vote_timestamp = votes.get('lastVoteTimestamp', self.last_updated)
        
        if not vote_data:
            return result
        
        # Process votes
        for vote in vote_data:
            ptpt_id = vote.get('pid')
            comment_id = vote.get('tid')
            vote_value = vote.get('vote')
            created = vote.get('created', last_vote_timestamp)
            
            # Skip invalid votes
            if ptpt_id is None or comment_id is None or vote_value is None:
                continue
                
            # Convert vote value
            try:
                if vote_value == 'agree':
                    vote_value = 1
                elif vote_value == 'disagree':
                    vote_value = -1
                elif vote_value == 'pass':
                    vote_value = None
                else:
                    vote_value = int(vote_value)
            except (ValueError, TypeError):
                continue
            
            # Update the raw rating matrix
            result.raw_rating_mat = result.raw_rating_mat.update(
                ptpt_id, comment_id, vote_value
            )
        
        # Update last updated timestamp
        result.last_updated = max(
            last_vote_timestamp, 
            result.last_updated
        )
        
        # Update count stats
        result.participant_count = len(result.raw_rating_mat.rownames())
        result.comment_count = len(result.raw_rating_mat.colnames())
        
        # Apply moderation and create filtered rating matrix
        result._apply_moderation()
        
        # Compute vote stats
        result._compute_vote_stats()
        
        # Recompute clustering if requested
        if recompute:
            result = result.recompute()
        
        return result
    
    def _apply_moderation(self) -> None:
        """
        Apply moderation settings to create filtered rating matrix.
        """
        # Get all row and column names
        all_ptpts = self.raw_rating_mat.rownames()
        all_comments = self.raw_rating_mat.colnames()
        
        # Filter out moderated participants and comments
        valid_ptpts = [p for p in all_ptpts if p not in self.mod_out_ptpts]
        valid_comments = [c for c in all_comments if c not in self.mod_out_tids]
        
        # Create filtered matrix
        self.rating_mat = self.raw_rating_mat.rowname_subset(valid_ptpts)
        self.rating_mat = self.rating_mat.colname_subset(valid_comments)
    
    def _compute_vote_stats(self) -> None:
        """
        Compute statistics on votes.
        """
        # Initialize stats
        self.vote_stats = {
            'n_votes': 0,
            'n_agree': 0,
            'n_disagree': 0,
            'n_pass': 0,
            'comment_stats': {},
            'participant_stats': {}
        }
        
        # Get matrix values
        values = self.rating_mat.values
        
        # Count votes
        non_null_mask = ~np.isnan(values)
        agree_mask = values == 1
        disagree_mask = values == -1
        
        self.vote_stats['n_votes'] = np.sum(non_null_mask)
        self.vote_stats['n_agree'] = np.sum(agree_mask)
        self.vote_stats['n_disagree'] = np.sum(disagree_mask)
        self.vote_stats['n_pass'] = np.sum(np.isnan(values))
        
        # Compute comment stats
        for i, cid in enumerate(self.rating_mat.colnames()):
            if i >= values.shape[1]:
                continue
                
            col = values[:, i]
            n_votes = np.sum(~np.isnan(col))
            n_agree = np.sum(col == 1)
            n_disagree = np.sum(col == -1)
            
            self.vote_stats['comment_stats'][cid] = {
                'n_votes': int(n_votes),
                'n_agree': int(n_agree),
                'n_disagree': int(n_disagree),
                'agree_ratio': float(n_agree / max(n_votes, 1))
            }
        
        # Compute participant stats
        for i, pid in enumerate(self.rating_mat.rownames()):
            if i >= values.shape[0]:
                continue
                
            row = values[i, :]
            n_votes = np.sum(~np.isnan(row))
            n_agree = np.sum(row == 1)
            n_disagree = np.sum(row == -1)
            
            self.vote_stats['participant_stats'][pid] = {
                'n_votes': int(n_votes),
                'n_agree': int(n_agree),
                'n_disagree': int(n_disagree),
                'agree_ratio': float(n_agree / max(n_votes, 1))
            }
    
    def update_moderation(self, 
                         moderation: Dict[str, Any],
                         recompute: bool = True) -> 'Conversation':
        """
        Update moderation settings.
        
        Args:
            moderation: Dictionary of moderation settings
            recompute: Whether to recompute the clustering
            
        Returns:
            Updated conversation
        """
        # Create a copy to avoid modifying the original
        result = deepcopy(self)
        
        # Extract moderation data
        mod_out_tids = moderation.get('mod_out_tids', [])
        mod_in_tids = moderation.get('mod_in_tids', [])
        meta_tids = moderation.get('meta_tids', [])
        mod_out_ptpts = moderation.get('mod_out_ptpts', [])
        
        # Update moderation sets
        if mod_out_tids:
            result.mod_out_tids = set(mod_out_tids)
        
        if mod_in_tids:
            result.mod_in_tids = set(mod_in_tids)
        
        if meta_tids:
            result.meta_tids = set(meta_tids)
        
        if mod_out_ptpts:
            result.mod_out_ptpts = set(mod_out_ptpts)
        
        # Apply moderation to update rating matrix
        result._apply_moderation()
        
        # Compute vote stats
        result._compute_vote_stats()
        
        # Recompute clustering if requested
        if recompute:
            result = result.recompute()
        
        return result
    
    def _compute_pca(self, n_components: int = 2) -> None:
        """
        Compute PCA on the vote matrix.
        
        Args:
            n_components: Number of principal components
        """
        # Check if we have enough data
        if self.rating_mat.values.shape[0] == 0 or self.rating_mat.values.shape[1] == 0:
            self.pca = {'center': np.zeros(n_components), 'comps': np.zeros((n_components, n_components))}
            self.proj = {}
            return
        
        # Perform PCA
        if self.participant_count <= SMALL_CONV_THRESHOLD:
            # Regular PCA for small conversations
            pca_results, proj_dict = pca_project_named_matrix(self.rating_mat, n_components)
        else:
            # Sampling-based PCA for large conversations
            sample_size = min(SMALL_CONV_THRESHOLD, self.participant_count)
            row_names = self.rating_mat.rownames()
            sample_rows = np.random.choice(row_names, sample_size, replace=False)
            
            # Create sample matrix
            sample_mat = self.rating_mat.rowname_subset(sample_rows)
            
            # Perform PCA on sample
            pca_results, _ = pca_project_named_matrix(sample_mat, n_components)
            
            # Project all participants
            proj_dict = {}
            for ptpt_id in self.rating_mat.rownames():
                try:
                    votes = self.rating_mat.get_row_by_name(ptpt_id)
                    from polismath.math.pca import sparsity_aware_project_ptpt
                    proj = sparsity_aware_project_ptpt(votes, pca_results)
                    proj_dict[ptpt_id] = proj
                except KeyError:
                    continue
        
        # Store results
        self.pca = pca_results
        self.proj = proj_dict
    
    def _compute_clusters(self, 
                         k_min: int = 2, 
                         k_max: int = 5) -> None:
        """
        Compute participant clusters.
        
        Args:
            k_min: Minimum number of clusters
            k_max: Maximum number of clusters
        """
        # Check if we have projections
        if not self.proj:
            self.base_clusters = []
            self.group_clusters = []
            self.subgroup_clusters = {}
            return
        
        # Prepare data for clustering
        ptpt_ids = list(self.proj.keys())
        proj_values = np.array([self.proj[pid] for pid in ptpt_ids])
        
        # Create projection matrix
        proj_matrix = NamedMatrix(
            matrix=proj_values,
            rownames=ptpt_ids,
            colnames=['x', 'y']
        )
        
        # Determine optimal k
        best_k = k_min
        best_silhouette = -1
        
        for k in range(k_min, k_max + 1):
            # Cluster with current k
            from polismath.math.clusters import kmeans, silhouette
            clusters = kmeans(proj_values, k, max_iters=30)
            
            # Calculate silhouette
            sil = silhouette(proj_values, clusters)
            
            # Update best k if silhouette is better
            if sil > best_silhouette:
                best_silhouette = sil
                best_k = k
        
        # Cluster with best k
        base_clusters = cluster_named_matrix(proj_matrix, best_k)
        
        # Convert base clusters to group clusters
        # Group clusters are high-level groups based on base clusters
        group_clusters = base_clusters
        
        # Store results
        self.base_clusters = base_clusters
        self.group_clusters = group_clusters
        
        # Compute subgroup clusters if needed
        self.subgroup_clusters = {}
        
        # TODO: Implement subgroup clustering if needed
    
    def _compute_repness(self) -> None:
        """
        Compute comment representativeness.
        """
        # Check if we have groups
        if not self.group_clusters:
            self.repness = {
                'comment_ids': self.rating_mat.colnames(),
                'group_repness': {},
                'consensus_comments': []
            }
            return
        
        # Compute representativeness
        self.repness = conv_repness(self.rating_mat, self.group_clusters)
    
    def _compute_participant_info(self) -> None:
        """
        Compute information about participants.
        """
        # Check if we have groups
        if not self.group_clusters:
            self.participant_info = {}
            return
        
        # Compute participant stats
        ptpt_stats = participant_stats(self.rating_mat, self.group_clusters)
        
        # Store results
        self.participant_info = ptpt_stats.get('stats', {})
    
    def recompute(self) -> 'Conversation':
        """
        Recompute all derived data.
        
        Returns:
            Updated conversation
        """
        # Create a copy to avoid modifying the original
        result = deepcopy(self)
        
        # Check if we have enough data
        if result.rating_mat.values.shape[0] == 0 or result.rating_mat.values.shape[1] == 0:
            # Not enough data, return early
            return result
        
        # Compute PCA and projections
        result._compute_pca()
        
        # Compute clusters
        result._compute_clusters()
        
        # Compute representativeness
        result._compute_repness()
        
        # Compute participant info
        result._compute_participant_info()
        
        return result
    
    def get_summary(self) -> Dict[str, Any]:
        """
        Get a summary of the conversation.
        
        Returns:
            Dictionary with conversation summary
        """
        return {
            'conversation_id': self.conversation_id,
            'last_updated': self.last_updated,
            'participant_count': self.participant_count,
            'comment_count': self.comment_count,
            'vote_count': self.vote_stats.get('n_votes', 0),
            'group_count': len(self.group_clusters),
        }
    
    def get_full_data(self) -> Dict[str, Any]:
        """
        Get the full conversation data.
        
        Returns:
            Dictionary with all conversation data
        """
        # Base data
        result = {
            'conversation_id': self.conversation_id,
            'last_updated': self.last_updated,
            'participant_count': self.participant_count,
            'comment_count': self.comment_count,
            'vote_stats': self.vote_stats,
            'moderation': {
                'mod_out_tids': list(self.mod_out_tids),
                'mod_in_tids': list(self.mod_in_tids),
                'meta_tids': list(self.meta_tids),
                'mod_out_ptpts': list(self.mod_out_ptpts)
            }
        }
        
        # Add PCA data
        if self.pca:
            result['pca'] = {
                'center': self.pca['center'].tolist() if isinstance(self.pca['center'], np.ndarray) else self.pca['center'],
                'comps': [comp.tolist() if isinstance(comp, np.ndarray) else comp for comp in self.pca['comps']]
            }
        
        # Add projection data
        if self.proj:
            result['proj'] = {pid: proj.tolist() if isinstance(proj, np.ndarray) else proj 
                            for pid, proj in self.proj.items()}
        
        # Add cluster data
        result['group_clusters'] = self.group_clusters
        
        # Add representativeness data
        if self.repness:
            result['repness'] = self.repness
        
        # Add participant info
        if self.participant_info:
            result['participant_info'] = self.participant_info
        
        return result
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the conversation to a dictionary for serialization.
        
        Returns:
            Dictionary representation of the conversation
        """
        return self.get_full_data()
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Conversation':
        """
        Create a conversation from a dictionary.
        
        Args:
            data: Dictionary representation of a conversation
            
        Returns:
            Conversation instance
        """
        # Create empty conversation
        conv = cls(data.get('conversation_id', ''))
        
        # Restore basic attributes
        conv.last_updated = data.get('last_updated', int(time.time() * 1000))
        conv.participant_count = data.get('participant_count', 0)
        conv.comment_count = data.get('comment_count', 0)
        
        # Restore vote stats
        conv.vote_stats = data.get('vote_stats', {})
        
        # Restore moderation state
        moderation = data.get('moderation', {})
        conv.mod_out_tids = set(moderation.get('mod_out_tids', []))
        conv.mod_in_tids = set(moderation.get('mod_in_tids', []))
        conv.meta_tids = set(moderation.get('meta_tids', []))
        conv.mod_out_ptpts = set(moderation.get('mod_out_ptpts', []))
        
        # Restore PCA data
        pca_data = data.get('pca')
        if pca_data:
            conv.pca = {
                'center': np.array(pca_data['center']),
                'comps': np.array(pca_data['comps'])
            }
        
        # Restore projection data
        proj_data = data.get('proj')
        if proj_data:
            conv.proj = {pid: np.array(proj) for pid, proj in proj_data.items()}
        
        # Restore cluster data
        conv.group_clusters = data.get('group_clusters', [])
        
        # Restore representativeness data
        conv.repness = data.get('repness')
        
        # Restore participant info
        conv.participant_info = data.get('participant_info', {})
        
        return conv