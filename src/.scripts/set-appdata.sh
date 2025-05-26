#!/bin/bash

# Takes the PROJECT App Data and saves it in DynamoDB Table

# Get the project name from config.json file and remove all spaces
PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

# Get the table name from AWS CLI
TABLE_NAME=$(aws dynamodb list-tables --query "TableNames[?contains(@, '${PROJECT_NAME}')]" --output text)


if [ -z "$TABLE_NAME" ]; then
    echo "Table $TABLE_NAME not found"
    exit 1
fi

# Get the app data from env file

## Get PUBLIC_RECAPTCHA_CLIENT_KEY
RECAPTCHA_CLIENT_KEY=$(cat .env.web.local | grep 'PUBLIC_RECAPTCHA_CLIENT_KEY' | cut -d '=' -f 2)

## Get SECRET_RECAPTCHA_SECRET_KEY
RECAPTCHA_SECRET_KEY=$(cat .env.web.local | grep 'SECRET_RECAPTCHA_SECRET_KEY' | cut -d '=' -f 2)

## Get Google Analytics ID
GOOGLE_ANALYTICS_ID=$(cat .env.web.local | grep 'GOOGLE_ANALYTICS_ID' | cut -d '=' -f 2)

if [ -z "$RECAPTCHA_CLIENT_KEY" ] || [ -z "$RECAPTCHA_SECRET_KEY" ] || [ -z "$GOOGLE_ANALYTICS_ID" ]; then
    echo "One or more app data are missing"
    exit 1
fi

# Save the app data in DynamoDB Table
aws dynamodb update-item \
    --table-name $TABLE_NAME \
    --key '{"pk": {"S": "APP#DATA"}, "sk": {"S": "SECRETS"}}' \
    --update-expression "SET RECAPTCHA_CLIENT_KEY = :client_key, RECAPTCHA_SECRET_KEY = :client_secret, GOOGLE_ANALYTICS_ID = :analytics_id" \
    --expression-attribute-values '{
        ":client_key": {"S": "'"$RECAPTCHA_CLIENT_KEY"'"},
        ":client_secret": {"S": "'"$RECAPTCHA_SECRET_KEY"'"},
        ":analytics_id": {"S": "'"$GOOGLE_ANALYTICS_ID"'"}
    }' \
    --region us-east-1