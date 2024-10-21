provider "aws" {
  region     = "us-east-1"
}

resource "aws_ecr_repository" "ecr_repo" {
  name = "backend-repo"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "repository_url" {
  value = aws_ecr_repository.ecr_repo.repository_url
}