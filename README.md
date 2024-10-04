# DDNS Update

This worker is responsible for updating the IP address of a Cloudflare domain.

## Requirements

- Cloudflare account
- Existing custom domain on Cloudflare with A record

## Setup

1. Create a Cloudflare account.
2. Add a custom domain to Cloudflare.
3. Create a Cloudflare API token with the following permissions:
   - Zone - Read
   - DNS - Edit
   - Workers - Edit
4. Create a Terraform state bucket called ```terraform-ddns-update``` using Cloudflare R2.
5. Create a Cloudflare API token with the following permissions:
   - Read/Write objects
   - Only applied for ```terraform-ddns-update``` bucket
6. Define username and password for basic authentication.
   - You can use the website https://generate-secret.vercel.app/32 to generate random strings.
7. Deploy the worker
8. Make requests to the worker

## How to use

Make a GET request to the worker on ```/update-domain``` with the following headers and query parameters:

- Header:
   - ```Authorization: Basic base64(username:password)```
   - Be sure to encode the username and password using base64.
   - You can use the native node function ```btoa(`${username}:${password}`)``` to encode the username and password.

- Query parameters:
   - ```domain```: The domain to update
   - ```ip```: The IP address to update

## Terraform

Worker environment variables:
- `HOSTNAME`: The hostname where the worker is deployed.
- `CLOUDFLARE_ACCOUNT_ID`: The Cloudflare account ID.
- `CLOUDFLARE_API_TOKEN`: The Cloudflare API token.
- `CLOUDFLARE_ZONE_ID`: The Cloudflare zone ID.
- `USERNAME`: The username for basic authentication.
- `PASSWORD`: The password for basic authentication.

Terraform state bucket:
- `AWS_ACCESS_KEY_ID`: The AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: The AWS secret access key.
- `AWS_ENDPOINT_URL_S3`: The AWS endpoint URL.
