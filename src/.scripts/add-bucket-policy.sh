#!/bin/bash

# Usage: ./set-bucket-policy.sh <bucket-name> <cloudfront-distribution-arn>

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')
BUCKET_NAME=$(echo -n $PROJECT_NAME | md5sum | cut -d ' ' -f 1)

# Get cloudfront ARN using tags
CLOUDFRONT_ARN=$(aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=$PROJECT_NAME \
  --resource-type-filters cloudfront:distribution \
  --query 'ResourceTagMappingList[].ResourceARN' \
  --output text
)

# echo "CLOUDFRONT_ARN: $CLOUDFRONT_ARN"

if [ -z "$BUCKET_NAME" ] || [ -z "$CLOUDFRONT_ARN" ]; then
  echo "Usage: $0 <bucket-name> <cloudfront-distribution-arn>"
  exit 1
fi

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "$CLOUDFRONT_ARN"
        }
      }
    }
  ]
}
EOF
)

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy "$POLICY"

if [ $? -eq 0 ]; then
  echo "✅ Bucket policy applied successfully to $BUCKET_NAME"
else
  echo "❌ Failed to apply bucket policy"
fi
