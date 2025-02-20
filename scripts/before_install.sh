#!/bin/bash
set -e
set -x

# Stop any existing Docker containers (if needed)
if docker ps -q --filter "name=polis-server" | grep -q .; then
    docker stop polis-server
fi
if docker ps -q --filter "name=polis-math" | grep -q .; then
    docker stop polis-math
fi