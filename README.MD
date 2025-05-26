## Prerequisites

1. Hosted Zone in Route 53
2. SES verified domain

### SES verified domain

1. Go to SES console
2. Go to `Identities` in the left sidebar
3. Click on `Create identity` button
4. Choose `Domain`
5. Enter the domain name
6. In `Verifying our domain` section, click on `Easy DKIM`, then choose `RSA_2048_BIT`
7. Ensure `Publish DNS records to Route53` is checked
8. Ensure `DKIM signatures` is checked
9. Click on `Create identity` button
