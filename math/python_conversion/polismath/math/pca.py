"""
PCA (Principal Component Analysis) implementation for Pol.is.

This module provides a custom implementation of PCA using power iteration,
with special handling for sparse matrices.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple, Union

from polismath.math.named_matrix import NamedMatrix


def normalize_vector(v: np.ndarray) -> np.ndarray:
    """
    Normalize a vector to unit length.
    
    Args:
        v: Vector to normalize
        
    Returns:
        Normalized vector
    """
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v / norm


def vector_length(v: np.ndarray) -> float:
    """
    Calculate the length (norm) of a vector.
    
    Args:
        v: Vector
        
    Returns:
        Vector length
    """
    return np.linalg.norm(v)


def proj_vec(u: np.ndarray, v: np.ndarray) -> np.ndarray:
    """
    Project vector v onto vector u.
    
    Args:
        u: Vector to project onto
        v: Vector to project
        
    Returns:
        Projection of v onto u
    """
    if np.dot(u, u) == 0:
        return np.zeros_like(v)
    return np.dot(u, v) / np.dot(u, u) * u


def factor_matrix(data: np.ndarray, xs: np.ndarray) -> np.ndarray:
    """
    Factor out the vector xs from all vectors in data.
    
    This is similar to the Gram-Schmidt process, removing the variance
    in the xs direction from the data.
    
    Args:
        data: Matrix of data
        xs: Vector to factor out
        
    Returns:
        Matrix with xs factored out
    """
    if np.dot(xs, xs) == 0:
        return data
    
    return np.array([row - proj_vec(xs, row) for row in data])


def xtxr(data: np.ndarray, vec: np.ndarray) -> np.ndarray:
    """
    Calculate X^T * X * r where X is data and r is vec.
    
    This is an optimization used in power iteration.
    
    Args:
        data: Data matrix X
        vec: Vector r
        
    Returns:
        Result of X^T * X * r
    """
    # This is equivalent to X^T * X * r but more efficient
    return data.T @ (data @ vec)


def rand_starting_vec(data: np.ndarray) -> np.ndarray:
    """
    Generate a random starting vector for power iteration.
    
    Args:
        data: Data matrix
        
    Returns:
        Random starting vector
    """
    n_cols = data.shape[1]
    return np.random.randn(n_cols)


def power_iteration(data: np.ndarray, 
                   iters: int = 100, 
                   start_vector: Optional[np.ndarray] = None) -> np.ndarray:
    """
    Find the first eigenvector of data using the power iteration method.
    
    Args:
        data: Data matrix
        iters: Maximum number of iterations
        start_vector: Initial vector (defaults to ones)
        
    Returns:
        Dominant eigenvector
    """
    n_cols = data.shape[1]
    
    if start_vector is None:
        start_vector = np.ones(n_cols)
    elif len(start_vector) < n_cols:
        # Pad with ones if needed
        padded = np.ones(n_cols)
        padded[:len(start_vector)] = start_vector
        start_vector = padded
    
    last_eigval = 0
    
    for _ in range(iters):
        # Compute product vector
        product_vector = xtxr(data, start_vector)
        
        # Compute eigenvalue (length of product vector)
        eigval = vector_length(product_vector)
        
        # Normalize the product vector
        normed = normalize_vector(product_vector)
        
        # Check for convergence
        if eigval == last_eigval:
            break
            
        start_vector = normed
        last_eigval = eigval
    
    return start_vector


def powerit_pca(data: np.ndarray, 
               n_comps: int, 
               iters: int = 100,
               start_vectors: Optional[List[np.ndarray]] = None) -> Dict[str, np.ndarray]:
    """
    Find the first n_comps principal components of the data matrix.
    
    Args:
        data: Data matrix
        n_comps: Number of components to find
        iters: Maximum number of iterations for power_iteration
        start_vectors: Initial vectors for warm start
        
    Returns:
        Dictionary with 'center' and 'comps' keys
    """
    # Center the data
    center = np.mean(data, axis=0)
    cntrd_data = data - center
    
    if start_vectors is None:
        start_vectors = []
    
    # Limit components to the dimensionality of the data
    data_dim = min(cntrd_data.shape)
    n_comps = min(n_comps, data_dim)
    
    # Iteratively find principal components
    pcs = []
    data_factored = cntrd_data.copy()
    
    for i in range(n_comps):
        # Use provided start vector or generate random one
        if i < len(start_vectors) and start_vectors[i] is not None:
            start_vector = start_vectors[i]
        else:
            start_vector = rand_starting_vec(data_factored)
            
        # Find principal component using power iteration
        pc = power_iteration(data_factored, iters, start_vector)
        pcs.append(pc)
        
        # Factor out this component from the data
        if i < n_comps - 1:  # No need to factor on the last iteration
            data_factored = factor_matrix(data_factored, pc)
    
    return {
        'center': center,
        'comps': np.array(pcs)
    }


def wrapped_pca(data: np.ndarray, 
               n_comps: int,
               iters: int = 100,
               start_vectors: Optional[List[np.ndarray]] = None) -> Dict[str, np.ndarray]:
    """
    Wrapper for PCA that handles edge cases.
    
    Args:
        data: Data matrix
        n_comps: Number of components to find
        iters: Maximum number of iterations
        start_vectors: Initial vectors for warm start
        
    Returns:
        Dictionary with 'center' and 'comps' keys
    """
    n_rows, n_cols = data.shape
    
    # Handle edge case: 1 row
    if n_rows == 1:
        return {
            'center': np.zeros(n_comps),
            'comps': np.vstack([normalize_vector(data[0])] + [np.zeros(n_cols)] * (n_comps - 1))
        }
    
    # Handle edge case: 1 column
    if n_cols == 1:
        return {
            'center': np.array([0]),
            'comps': np.array([[1]])
        }
    
    # Filter out zero vectors from start_vectors
    if start_vectors is not None:
        start_vectors = [v if not np.all(v == 0) else None for v in start_vectors]
    
    # Normal case
    return powerit_pca(data, n_comps, iters, start_vectors)


def sparsity_aware_project_ptpt(votes: List[Optional[float]], 
                              pca_results: Dict[str, np.ndarray]) -> np.ndarray:
    """
    Project a participant's votes into PCA space, handling missing votes.
    
    Args:
        votes: List of votes (can contain None for missing votes)
        pca_results: Dictionary with 'center' and 'comps' from PCA
        
    Returns:
        2D projection coordinates
    """
    comps = pca_results['comps']
    center = pca_results['center']
    
    # Only use the first two components
    pc1 = comps[0]
    pc2 = comps[1] if len(comps) > 1 else np.zeros_like(pc1)
    
    n_cmnts = len(votes)
    n_votes = 0
    p1 = 0.0
    p2 = 0.0
    
    # Process each vote
    for i, vote in enumerate(votes):
        if vote is not None:
            # Adjust vote by center and project onto PCs
            vote_adj = vote - center[i]
            p1 += vote_adj * pc1[i]
            p2 += vote_adj * pc2[i]
            n_votes += 1
    
    # Scale by square root of (total comments / actual votes)
    scale = np.sqrt(n_cmnts / max(n_votes, 1))
    return np.array([p1, p2]) * scale


def sparsity_aware_project_ptpts(vote_matrix: np.ndarray, 
                                pca_results: Dict[str, np.ndarray]) -> np.ndarray:
    """
    Project multiple participants' votes into PCA space.
    
    Args:
        vote_matrix: Matrix of votes (participants x comments)
        pca_results: Dictionary with 'center' and 'comps' from PCA
        
    Returns:
        Array of 2D projections
    """
    # Convert to list of rows (participants)
    votes_list = [row.tolist() for row in vote_matrix]
    
    # Project each participant
    projections = [sparsity_aware_project_ptpt(votes, pca_results) for votes in votes_list]
    
    return np.array(projections)


def pca_project_named_matrix(nmat: NamedMatrix, 
                           n_comps: int = 2) -> Tuple[Dict[str, np.ndarray], Dict[str, np.ndarray]]:
    """
    Perform PCA on a NamedMatrix and project the data.
    
    Args:
        nmat: NamedMatrix containing the data
        n_comps: Number of components to find
        
    Returns:
        Tuple of (pca_results, projections)
    """
    # Extract matrix data
    matrix_data = nmat.values
    
    # Handle NaN values by replacing with zeros
    matrix_data = np.nan_to_num(matrix_data)
    
    # Perform PCA
    pca_results = wrapped_pca(matrix_data, n_comps)
    
    # Project the participants
    projections = sparsity_aware_project_ptpts(matrix_data, pca_results)
    
    # Create a dictionary of projections by participant ID
    proj_dict = {ptpt_id: proj for ptpt_id, proj in zip(nmat.rownames(), projections)}
    
    return pca_results, proj_dict