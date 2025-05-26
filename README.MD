## Prerequisites

1. Hosted Zone in Route 53
2. SES verified domain
3. Recaptcha keys

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

### Create recaptcha keys

1. Go to https://console.cloud.google.com/security/recaptcha
2. Select the right project
3. Click on `Create key`
4. Enter a `Display name`
5. Choose the Application type `Web` or `Android` or `IOS`
6. Enter the `Domain` - `http://localhost:4321`, `https://domain.com`, `https://www.domain.com`
7. Click on `Create key` button
8. Copy the ID and paste it in the `.env.web.local` file as `PUBLIC_RECAPTCHA_CLIENT_KEY`
9. Then in the console, click on `Integration`
10. Click on `Integrate with a third-party service`
11. Copy the Secret and paste it in the `.env.web.local` file as `SECRET_RECAPTCHA_SECRET_KEY`
