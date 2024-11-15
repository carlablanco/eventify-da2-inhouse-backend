resource "aws_security_group" "tfer--default_sg-0269dfd2fe3313412" {
  description = "default VPC security group"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    from_port = "0"
    protocol  = "-1"
    self      = "true"
    to_port   = "0"
  }

  name   = "default"
  vpc_id = "vpc-01c486fc467ecc071"
}

resource "aws_security_group" "tfer--default_sg-06f6ba1bb61b38398" {
  description = "default VPC security group"

  egress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = "0"
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "-1"
    self             = "false"
    to_port          = "0"
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = "3000"
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    self             = "false"
    to_port          = "3000"
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = "3001"
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    self             = "true"
    to_port          = "3001"
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = "443"
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    self             = "false"
    to_port          = "443"
  }

  ingress {
    cidr_blocks      = ["0.0.0.0/0"]
    from_port        = "8000"
    ipv6_cidr_blocks = ["::/0"]
    protocol         = "tcp"
    self             = "false"
    to_port          = "8000"
  }

  name   = "default"
  vpc_id = "vpc-018b1ae51ec3d571f"
}

resource "aws_security_group" "tfer--launch-wizard-1_sg-09ad949c05c07f927" {
  description = "launch-wizard-1 created 2024-08-30T19:58:09.202Z"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "22"
    protocol    = "tcp"
    self        = "false"
    to_port     = "22"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "389"
    protocol    = "tcp"
    self        = "false"
    to_port     = "389"
  }

  name   = "launch-wizard-1"
  vpc_id = "vpc-018b1ae51ec3d571f"
}
