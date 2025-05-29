#!/bin/bash

# Invalidate the CloudFront cache

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')
BUCKET_NAME=$(echo -n $PROJECT_NAME | md5sum | cut -d ' ' -f 1)

# Get cloudfront ARN using tags
CLOUDFRONT_ARN=$(aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=$PROJECT_NAME \
  --resource-type-filters cloudfront:distribution \
  --query 'ResourceTagMappingList[].ResourceARN' \
  --output text
)


DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(ARN, \`$CLOUDFRONT_ARN\`)].Id" --output text)

# Invalidate the cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"