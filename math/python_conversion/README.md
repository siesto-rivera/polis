# Pol.is Math (Python Implementation)

This is a Python implementation of the mathematical components of the [Pol.is](https://pol.is) conversation system, converted from the original Clojure codebase.

## Overview

Pol.is is a platform for large-scale conversation and opinion analysis. The math component processes participant votes, performs clustering and dimensionality reduction to organize participants into opinion groups, and identifies representative comments.

## Core Components

- **Named Matrix**: A data structure for matrices with named rows and columns
- **PCA**: Dimensionality reduction for visualization using a custom power iteration approach
- **Clustering**: K-means implementation for grouping participants with weighted clustering and silhouette evaluation
- **Representativeness**: Identifies representative comments for each opinion group using statistical analysis
- **Correlation**: Hierarchical clustering and correlation analysis 
- **Conversation Manager**: Orchestrates computation and state updates
- **Database Integration**: Connects to PostgreSQL for data persistence
- **Poller**: Background polling for new votes and moderation actions
- **Server**: FastAPI endpoints for API access
- **System Integration**: Overall system orchestration

## Project Structure

```
polismath/
├── __init__.py
├── __main__.py
├── components/
│   ├── __init__.py
│   ├── config.py
│   └── server.py
├── conversation/
│   ├── __init__.py
│   ├── conversation.py
│   └── manager.py
├── database/
│   ├── __init__.py
│   └── postgres.py
├── math/
│   ├── __init__.py
│   ├── named_matrix.py
│   ├── pca.py
│   ├── clusters.py
│   ├── repness.py
│   ├── corr.py
│   └── stats.py
├── poller.py
├── system.py
└── utils/
    ├── __init__.py
    └── general.py
```

## Installation

```bash
# Clone the repository
git clone https://github.com/compdemocracy/polis-math-python.git
cd polis-math-python

# Install the package in development mode
pip install -e .
```

## Running the System

```bash
# Run with default settings
polismath

# Run with custom settings
polismath --config config.yaml --port 8000 --log-level DEBUG
```

## Key Features

- **Vote Processing**: Process participant votes (agree, disagree, pass) on comments
- **Group Identification**: Identify distinct opinion groups in the conversation
- **Comment Analysis**: Find comments that represent each group's perspective
- **Visualization Data**: Generate data for visualizing participant positions
- **Moderation Support**: Support for comment moderation and inclusion/exclusion
- **Persistence**: Database storage for conversations and results
- **API Access**: RESTful API for integration with frontend

## Usage Example

```python
from polismath import SystemManager

# Start the system
system = SystemManager.start()

# Create a conversation manager
conv_manager = system.conversation_manager

# Create a new conversation
conv_id = "my-conversation"
conv = conv_manager.create_conversation(conv_id)

# Process some votes
votes = {
    "votes": [
        {"pid": "participant1", "tid": "comment1", "vote": 1},   # Agree
        {"pid": "participant1", "tid": "comment2", "vote": -1},  # Disagree
        {"pid": "participant2", "tid": "comment1", "vote": 1},   # Agree
        {"pid": "participant2", "tid": "comment3", "vote": 1},   # Agree
    ]
}

# Update the conversation with the votes
updated_conv = conv_manager.process_votes(conv_id, votes)

# Get groups and representative comments
group_clusters = updated_conv.group_clusters
repness = updated_conv.repness

print(f"Identified {len(group_clusters)} groups")
for group in group_clusters:
    print(f"Group {group['id']} has {len(group['members'])} participants")
```

## Development

```bash
# Run tests
pytest tests/

# Run tests with coverage
pytest --cov=polismath tests/
```

## API Endpoints

The system exposes the following API endpoints:

- `GET /health`: Health check
- `POST /api/v3/votes/{conversation_id}`: Process votes for a conversation
- `POST /api/v3/moderation/{conversation_id}`: Update moderation settings
- `POST /api/v3/math/{conversation_id}`: Recompute math results
- `GET /api/v3/conversations/{conversation_id}`: Get conversation data
- `GET /api/v3/conversations`: List all conversations

## Documentation

- [Architecture Overview](docs/architecture_overview.md)
- [Algorithm Analysis](docs/algorithm_analysis.md)
- [Conversion Plan](docs/conversion_plan.md)
- [Project Summary](docs/summary.md)
- [Usage Examples](docs/usage_examples.md)

## Configuration

The system can be configured using environment variables, a configuration file, or command line arguments. Key configuration options include:

- `MATH_ENV`: Environment (dev, prod, preprod)
- `DATABASE_URL`: PostgreSQL connection URL
- `PORT`: Server port
- `LOG_LEVEL`: Logging level
- `POLL_INTERVAL_MS`: Polling interval in milliseconds

## License

Same as the original Pol.is system.