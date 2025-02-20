#!/bin/bash
set -e
set -x

cd /opt/polis
sudo yum install -y git
GIT_REPO_URL="https://github.com/compdemocracy/polis.git" # Standard HTTPS URL - PUBLIC REPO
GIT_BRANCH="te-cdk-replatform"

if [ ! -d "polis" ]; then # Check if 'polis' directory already exists
  echo "Cloning public repository from $GIT_REPO_URL, branch: $GIT_BRANCH (HTTPS - Public Repo)"
  git clone -b "$GIT_BRANCH" "$GIT_REPO_URL" polis
else
  echo "Polis directory already exists, skipping cloning."
fi

cd polis

if [ -f "example.env" ]; then
  echo "Copying example.env to .env"
  cp example.env .env
else
  echo "Warning: example.env not found in repository root."
fi

# Update database URL (using SSM parameter) 
DB_USER=$(aws ssm get-parameter --name /aws/reference/secretsmanager/${db.secret?.secretArn} --query 'Parameter.Value' --output text | jq -r '.username')
DB_PASSWORD=$(aws ssm get-parameter --with-decryption --name /aws/reference/secretsmanager/${db.secret?.secretArn} --query 'Parameter.Value' --output text | jq -r '.password')
DB_HOST=$(aws ssm get-parameter --name /aws/reference/ec2/DB_HOST --query 'Parameter.Value' --output text)
DB_PORT=$(aws ssm get-parameter --name /aws/reference/ec2/DB_PORT --query 'Parameter.Value' --output text)

sed -i "s|^DATABASE_URL=.*|DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/polisdb|" .env

# Get the image tag from SSM
IMAGE_TAG=$(aws ssm get-parameter --name /polis/image-tag --query 'Parameter.Value' --output text --with-decryption)
ECR_REPO_URI=$(aws ecr describe-repositories --repository-names polis --query 'repositories[0].repositoryUri' --output text)

# Set environment variable for docker-compose
export IMAGE_TAG
/usr/local/bin/docker-compose config # Validate
/usr/local/bin/docker-compose up -d $SERVICE