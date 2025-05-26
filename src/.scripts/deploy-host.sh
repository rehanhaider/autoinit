#!/bin/bash

# Get the project name from config.json file and remove all spaces
PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

# Compute the MD5 hash of the project name
BUCKET_NAME=$(echo -n $PROJECT_NAME | md5sum | cut -d ' ' -f 1)

# Check if the bucket already exists
if aws s3api head-bucket --bucket $BUCKET_NAME 2>/dev/null; then
    echo "Deploying to $BUCKET_NAME"
    aws s3 sync ./web/dist/ "s3://${BUCKET_NAME}/" --delete
else
    echo "$BUCKET_NAME does not exist !"
fi