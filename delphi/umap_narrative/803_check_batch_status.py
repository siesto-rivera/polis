#!/usr/bin/env python3
"""
Check the status of batch narrative report jobs.

This script:
1. Retrieves batch job metadata from DynamoDB
2. Checks the status of Anthropic batch jobs
3. Displays progress information

Usage:
    python 803_check_batch_status.py --batch_id BATCH_ID [--watch]
    python 803_check_batch_status.py --conversation_id CONVERSATION_ID [--watch]

Args:
    --batch_id: ID of a specific batch job to check
    --conversation_id: ID of a conversation to show all batch jobs for
    --watch: Continuously monitor the batch job (poll every 30 seconds)
"""

import os
import sys
import json
import time
import logging
import argparse
import boto3
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

# Import from local modules (set the path first)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from umap_narrative.llm_factory_constructor import get_model_provider

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BatchReportStorageService:
    """Storage service for batch job metadata in DynamoDB."""
    
    def __init__(self, table_name="Delphi_BatchJobs"):
        """Initialize the batch job storage service.
        
        Args:
            table_name: Name of the DynamoDB table to use
        """
        # Set up DynamoDB connection
        self.table_name = table_name
        
        # Set up DynamoDB client
        self.dynamodb = boto3.resource(
            'dynamodb',
            endpoint_url=os.environ.get('DYNAMODB_ENDPOINT'),
            region_name=os.environ.get('AWS_DEFAULT_REGION', 'us-west-2'),
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID', 'fakeMyKeyId'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY', 'fakeSecretAccessKey')
        )
        
        # Get the table
        self.table = self.dynamodb.Table(self.table_name)
    
    def get_item(self, batch_id):
        """Get a batch job by ID.
        
        Args:
            batch_id: ID of the batch job
        
        Returns:
            Dictionary with the batch job metadata
        """
        try:
            response = self.table.get_item(Key={'batch_id': batch_id})
            return response.get('Item')
        except Exception as e:
            logger.error(f"Error getting batch job: {str(e)}")
            return None
    
    def update_item(self, batch_id, updates):
        """Update a batch job.
        
        Args:
            batch_id: ID of the batch job
            updates: Dictionary with updates to apply
        """
        try:
            # Build update expression
            update_expression = "SET "
            expression_attribute_values = {}
            
            for key, value in updates.items():
                update_expression += f"{key} = :{key.replace('.', '_')}, "
                expression_attribute_values[f":{key.replace('.', '_')}"] = value
            
            # Remove trailing comma and space
            update_expression = update_expression[:-2]
            
            response = self.table.update_item(
                Key={'batch_id': batch_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            logger.info(f"Batch job updated successfully: {response}")
            return response
        except Exception as e:
            logger.error(f"Error updating batch job: {str(e)}")
            return None
    
    def get_jobs_for_conversation(self, conversation_id):
        """Get all batch jobs for a conversation.
        
        Args:
            conversation_id: ID of the conversation
        
        Returns:
            List of batch jobs for the conversation
        """
        try:
            response = self.table.query(
                IndexName='conversation_id-created_at-index',
                KeyConditionExpression='conversation_id = :cid',
                ExpressionAttributeValues={':cid': conversation_id},
                ScanIndexForward=False  # Sort by created_at in descending order
            )
            return response.get('Items', [])
        except Exception as e:
            logger.error(f"Error getting batch jobs for conversation: {str(e)}")
            return []

class AnthropicBatchChecker:
    """Check the status of Anthropic batch jobs."""
    
    def __init__(self, api_key=None):
        """Initialize the Anthropic batch checker.
        
        Args:
            api_key: Anthropic API key
        """
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        
        if not self.api_key:
            logger.warning("No Anthropic API key provided. Set ANTHROPIC_API_KEY env var or pass api_key parameter.")
    
    def check_batch_status(self, batch_id):
        """Check the status of an Anthropic batch job.
        
        Args:
            batch_id: ID of the Anthropic batch job
            
        Returns:
            Dictionary with batch job status
        """
        if not self.api_key:
            logger.error("No Anthropic API key provided for checking batch status")
            return {"error": "API key missing"}
        
        try:
            logger.info(f"Checking status of Anthropic batch job: {batch_id}")
            
            # Use Anthropic API to check batch status
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            
            response = requests.get(
                f"https://api.anthropic.com/v1/messages/batch/{batch_id}",
                headers=headers
            )
            
            # Check if the batch endpoint is available
            if response.status_code == 404:
                logger.warning("Anthropic Batch API endpoint not found (404)")
                return {"error": "Batch API not available"}
            
            # Raise for other errors
            response.raise_for_status()
            
            # Get response data
            response_data = response.json()
            logger.info(f"Batch status: {response_data.get('status', 'unknown')}")
            
            return response_data
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                logger.warning("Anthropic Batch API endpoint not found (404)")
                return {"error": "Batch API not available"}
            else:
                logger.error(f"HTTP error checking Anthropic batch status: {str(e)}")
                return {"error": f"HTTP error: {str(e)}"}
                
        except Exception as e:
            logger.error(f"Error checking Anthropic batch status: {str(e)}")
            return {"error": str(e)}

def display_batch_status(batch_job, anthropic_status=None):
    """Display the status of a batch job.
    
    Args:
        batch_job: Dictionary with batch job metadata
        anthropic_status: Dictionary with Anthropic batch status
    """
    # Print batch job metadata
    print("\n===== Batch Job Information =====")
    print(f"Batch ID: {batch_job.get('batch_id')}")
    print(f"Conversation ID: {batch_job.get('conversation_id')}")
    print(f"Model: {batch_job.get('model')}")
    print(f"Status: {batch_job.get('status')}")
    print(f"Created at: {batch_job.get('created_at')}")
    print(f"Updated at: {batch_job.get('updated_at')}")
    print(f"Total requests: {batch_job.get('total_requests', 0)}")
    print(f"Completed requests: {batch_job.get('completed_requests', 0)}")
    print(f"Progress: {batch_job.get('completed_requests', 0)}/{batch_job.get('total_requests', 0)} " +
          f"({(batch_job.get('completed_requests', 0) / max(1, batch_job.get('total_requests', 1)) * 100):.1f}%)")
    
    # Print Anthropic batch status if available
    if anthropic_status and not isinstance(anthropic_status.get('error'), str):
        print("\n----- Anthropic Batch Status -----")
        print(f"Anthropic Batch ID: {anthropic_status.get('batch_id')}")
        print(f"Status: {anthropic_status.get('status')}")
        
        # Print request statuses
        if 'requests' in anthropic_status:
            print("\nRequest Status Summary:")
            status_counts = {}
            for req in anthropic_status.get('requests', []):
                status = req.get('status')
                status_counts[status] = status_counts.get(status, 0) + 1
            
            for status, count in status_counts.items():
                print(f"  {status}: {count}")
            
            print("\nDetailed Request Statuses:")
            for req in anthropic_status.get('requests', []):
                req_id = req.get('request_id')
                status = req.get('status')
                
                # Get topic info if available
                topic_info = ""
                if batch_job.get('request_map') and req_id in batch_job.get('request_map', {}):
                    metadata = batch_job['request_map'][req_id]
                    if isinstance(metadata, dict):
                        topic_name = metadata.get('topic_name', 'Unknown')
                        topic_info = f" - Topic: {topic_name}"
                
                print(f"  {req_id}: {status}{topic_info}")
    
    # If there was an error checking Anthropic status
    elif anthropic_status and 'error' in anthropic_status:
        print("\n----- Anthropic Batch Status -----")
        print(f"Error: {anthropic_status.get('error')}")
    
    # Print sequential fallback info if relevant
    if batch_job.get('status') == 'sequential_fallback':
        print("\n----- Sequential Processing -----")
        print("Batch API not available, falling back to sequential processing.")
        print("Use 802_process_batch_results.py to process this batch job.")

def check_batch_job(batch_id, batch_storage, anthropic_checker):
    """Check the status of a specific batch job.
    
    Args:
        batch_id: ID of the batch job
        batch_storage: BatchReportStorageService instance
        anthropic_checker: AnthropicBatchChecker instance
        
    Returns:
        True if the batch job is complete, False otherwise
    """
    # Get batch job from DynamoDB
    batch_job = batch_storage.get_item(batch_id)
    
    if not batch_job:
        logger.error(f"Batch job {batch_id} not found")
        print(f"Batch job {batch_id} not found")
        return False
    
    # Check Anthropic batch status if available
    anthropic_status = None
    if batch_job.get('status') == 'submitted' and batch_job.get('anthropic_batch_id'):
        anthropic_batch_id = batch_job.get('anthropic_batch_id')
        anthropic_status = anthropic_checker.check_batch_status(anthropic_batch_id)
        
        # Update batch job status if Anthropic status is available
        if anthropic_status and not isinstance(anthropic_status.get('error'), str):
            # Update DynamoDB with latest status
            updates = {
                "updated_at": datetime.now().isoformat(),
                "anthropic_status": anthropic_status.get('status')
            }
            
            # Count completed requests
            if 'requests' in anthropic_status:
                completed = sum(1 for req in anthropic_status.get('requests', []) 
                               if req.get('status') in ['completed', 'failed'])
                updates["completed_requests"] = completed
                
                # Check if all requests are complete
                if completed == batch_job.get('total_requests'):
                    updates["status"] = "completed"
            
            # Update batch job
            batch_storage.update_item(batch_id, updates)
            
            # Refresh batch job data
            batch_job = batch_storage.get_item(batch_id)
    
    # Display status
    display_batch_status(batch_job, anthropic_status)
    
    # Return whether the batch job is complete
    return batch_job.get('status') in ['completed', 'error']

def list_conversation_jobs(conversation_id, batch_storage):
    """List all batch jobs for a conversation.
    
    Args:
        conversation_id: ID of the conversation
        batch_storage: BatchReportStorageService instance
    """
    # Get all batch jobs for the conversation
    batch_jobs = batch_storage.get_jobs_for_conversation(conversation_id)
    
    if not batch_jobs:
        logger.info(f"No batch jobs found for conversation {conversation_id}")
        print(f"No batch jobs found for conversation {conversation_id}")
        return
    
    # Print batch jobs
    print(f"\n===== Batch Jobs for Conversation {conversation_id} =====")
    print(f"Found {len(batch_jobs)} batch jobs\n")
    
    for i, job in enumerate(batch_jobs):
        print(f"{i+1}. Batch ID: {job.get('batch_id')}")
        print(f"   Status: {job.get('status')}")
        print(f"   Created: {job.get('created_at')}")
        print(f"   Model: {job.get('model')}")
        print(f"   Progress: {job.get('completed_requests', 0)}/{job.get('total_requests', 0)} " +
              f"({(job.get('completed_requests', 0) / max(1, job.get('total_requests', 1)) * 100):.1f}%)")
        print("")

async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Check the status of batch narrative report jobs')
    
    # Specify either batch_id or conversation_id
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--batch_id', type=str, 
                      help='ID of a specific batch job to check')
    group.add_argument('--conversation_id', '--zid', type=str,
                      help='ID of a conversation to show all batch jobs for')
    
    # Optional arguments
    parser.add_argument('--watch', action='store_true',
                      help='Continuously monitor the batch job (poll every 30 seconds)')
    
    args = parser.parse_args()
    
    # Initialize services
    batch_storage = BatchReportStorageService()
    anthropic_checker = AnthropicBatchChecker()
    
    # If conversation_id is provided, list all batch jobs for that conversation
    if args.conversation_id:
        list_conversation_jobs(args.conversation_id, batch_storage)
        
        if args.watch:
            print("Watch mode not supported when listing jobs for a conversation.")
            print("Please specify a specific batch ID to watch.")
        
        return
    
    # If batch_id is provided, check that specific batch job
    if args.batch_id:
        # Check once
        is_complete = check_batch_job(args.batch_id, batch_storage, anthropic_checker)
        
        # If watch mode is enabled and not complete, continue checking
        if args.watch and not is_complete:
            print("\nWatch mode enabled. Press Ctrl+C to exit.")
            try:
                while not is_complete:
                    # Wait 30 seconds
                    time.sleep(30)
                    
                    # Clear screen
                    os.system('cls' if os.name == 'nt' else 'clear')
                    
                    # Check again
                    is_complete = check_batch_job(args.batch_id, batch_storage, anthropic_checker)
                    
                    # If complete, break
                    if is_complete:
                        print("\nBatch job completed!")
                        break
                        
                    print("\nUpdating in 30 seconds... Press Ctrl+C to exit.")
            except KeyboardInterrupt:
                print("\nExiting watch mode.")
        
        return

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())