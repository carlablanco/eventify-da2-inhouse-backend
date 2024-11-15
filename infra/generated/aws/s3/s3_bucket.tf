resource "aws_s3_bucket" "tfer--eventify-inhouse-frontend" {
  bucket        = "eventify-inhouse-frontend"
  force_destroy = "false"

  grant {
    id          = "9024b671946d06badad3ef49ce0942b5f2e20c4ee1da16e0774cf468fdfc7d34"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Resource": "arn:aws:s3:::eventify-inhouse-frontend/*",
      "Sid": "PublicReadGetObject"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "true"
    mfa_delete = "false"
  }

  website {
    error_document = "404.html"
    index_document = "index.html"
    routing_rules  = "[{\"Condition\":{\"KeyPrefixEquals\":\"\"},\"Redirect\":{\"ReplaceKeyWith\":\"index.html\"}}]"
  }
}

resource "aws_s3_bucket" "tfer--intranet-002E-deliver-002E-ar" {
  bucket        = "intranet.deliver.ar"
  force_destroy = "false"

  grant {
    id          = "9024b671946d06badad3ef49ce0942b5f2e20c4ee1da16e0774cf468fdfc7d34"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Resource": "arn:aws:s3:::intranet.deliver.ar/*",
      "Sid": "PublicReadGetObject"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }

  website {
    index_document = "index.html"
  }
}
