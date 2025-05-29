#!/bin/bash

ACCOUNT_ID=$(aws sts get-caller-identity --query ["Account"] --output text)
REGION=$(aws configure get region)

if [ -z "$ACCOUNT_ID" ]; then
    echo "Error: Failed to get AWS account ID"
    exit 1
fi

if [ -z "$REGION" ]; then
    echo "Error: Failed to get AWS region"
    exit 1
fi




echo "SECRET_AWS_ACCOUNT=$ACCOUNT_ID" > .env.cdk.local
echo "PUBLIC_AWS_REGION=$REGION" >> .env.cdk.local