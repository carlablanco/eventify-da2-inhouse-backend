resource "aws_instance" "tfer--i-0c1f32815560797eb_eventify-dd2-inhouse-squad4" {
  ami                         = "ami-0e86e20dae9224db8"
  associate_public_ip_address = "true"
  availability_zone           = "us-east-1a"

  capacity_reservation_specification {
    capacity_reservation_preference = "open"
  }

  cpu_core_count = "1"

  cpu_options {
    core_count       = "1"
    threads_per_core = "1"
  }

  cpu_threads_per_core = "1"

  credit_specification {
    cpu_credits = "standard"
  }

  disable_api_stop        = "false"
  disable_api_termination = "false"
  ebs_optimized           = "false"

  enclave_options {
    enabled = "false"
  }

  get_password_data                    = "false"
  hibernation                          = "false"
  instance_initiated_shutdown_behavior = "stop"
  instance_type                        = "t2.micro"
  ipv6_address_count                   = "0"
  key_name                             = "carla"

  maintenance_options {
    auto_recovery = "default"
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_protocol_ipv6          = "disabled"
    http_put_response_hop_limit = "2"
    http_tokens                 = "required"
    instance_metadata_tags      = "disabled"
  }

  monitoring                 = "false"
  placement_partition_number = "0"

  private_dns_name_options {
    enable_resource_name_dns_a_record    = "true"
    enable_resource_name_dns_aaaa_record = "false"
    hostname_type                        = "ip-name"
  }

  private_ip = "172.31.94.231"

  root_block_device {
    delete_on_termination = "true"
    encrypted             = "false"
    iops                  = "3000"
    throughput            = "125"
    volume_size           = "15"
    volume_type           = "gp3"
  }

  security_groups   = ["default", "launch-wizard-1"]
  source_dest_check = "true"
  subnet_id         = "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-0c3764d6c2635180a_id}"

  tags = {
    Name = "eventify-dd2-inhouse-squad4"
  }

  tags_all = {
    Name = "eventify-dd2-inhouse-squad4"
  }

  tenancy                = "default"
  vpc_security_group_ids = ["${data.terraform_remote_state.sg.outputs.aws_security_group_tfer--default_sg-06f6ba1bb61b38398_id}", "${data.terraform_remote_state.sg.outputs.aws_security_group_tfer--launch-wizard-1_sg-09ad949c05c07f927_id}"]
}
