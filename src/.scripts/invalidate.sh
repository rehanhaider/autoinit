#!/bin/bash

# Invalidate the CloudFront cache

# Get the distribution ID of the distribution with alias cloudbytes.academy
CLOUDFRONT_ARN=$(aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=MyProject \
  --resource-type-filters cloudfront:distribution \
  --query 'ResourceTagMappingList[].ResourceARN' \
  --output text
)

DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(ARN, \`$CLOUDFRONT_ARN\`)].Id" --output text)

echo "DISTRIBUTION_ID: $DISTRIBUTION_ID"

# Invalidate the cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"