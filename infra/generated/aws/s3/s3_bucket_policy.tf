resource "aws_s3_bucket_policy" "tfer--eventify-inhouse-frontend" {
  bucket = "eventify-inhouse-frontend"
  policy = "{\"Statement\":[{\"Action\":\"s3:GetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":\"arn:aws:s3:::eventify-inhouse-frontend/*\",\"Sid\":\"PublicReadGetObject\"}],\"Version\":\"2012-10-17\"}"
}

resource "aws_s3_bucket_policy" "tfer--intranet-002E-deliver-002E-ar" {
  bucket = "intranet.deliver.ar"
  policy = "{\"Statement\":[{\"Action\":\"s3:GetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":\"arn:aws:s3:::intranet.deliver.ar/*\",\"Sid\":\"PublicReadGetObject\"}],\"Version\":\"2012-10-17\"}"
}
