terraform {
  backend "s3" {
    bucket                      = "terraform-ddns-update"
    key                         = "ddns"
    region                      = "auto"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~>4"
    }
  }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
}

resource "cloudflare_workers_script" "ddns-update-worker" {
  account_id          = var.CLOUDFLARE_ACCOUNT_ID
  content             = file("../dist/index.js")
  name                = "ddns-update"
  compatibility_date  = "2024-10-04"
  compatibility_flags = ["nodejs_compat"]
  module              = true

  secret_text_binding {
    name = "CLOUDFLARE_API_TOKEN"
    text = var.CLOUDFLARE_API_TOKEN
  }

  secret_text_binding {
    name = "CLOUDFLARE_ZONE_ID"
    text = var.CLOUDFLARE_ZONE_ID
  }

  secret_text_binding {
    name = "USERNAME"
    text = var.USERNAME
  }

  secret_text_binding {
    name = "PASSWORD"
    text = var.PASSWORD
  }
}

resource "cloudflare_workers_domain" "sonaura-worker-domain" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  hostname   = var.HOSTNAME
  service    = cloudflare_workers_script.ddns-update-worker.name
  zone_id    = var.CLOUDFLARE_ZONE_ID
}