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

1. Go to https://www.google.com/recaptcha/admin/create
2. Choose a Label
3. reCAPTCHA Type - choose `reCAPTCHA v3`
4. Add domain - `http://localhost:4321`, `https://domain.com`, `https://www.domain.com`
5. Under Google Cloud Platform Project - choose an existing project or create a new one
6. Click on Submit button
7. Copy the `Site key` and paste it in the `.env.web.local` file as `PUBLIC_RECAPTCHA_CLIENT_KEY`
8. Copy the `Secret key` and paste it in the `.env.web.local` file as `SECRET_RECAPTCHA_SECRET_KEY`
