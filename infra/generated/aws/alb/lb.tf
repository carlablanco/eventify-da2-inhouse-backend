resource "aws_lb" "tfer--BackClusterInhouseLoadBalancer" {
  client_keep_alive = "3600"

  connection_logs {
    enabled = "false"
  }

  desync_mitigation_mode                      = "defensive"
  drop_invalid_header_fields                  = "false"
  enable_cross_zone_load_balancing            = "true"
  enable_deletion_protection                  = "false"
  enable_http2                                = "true"
  enable_tls_version_and_cipher_suite_headers = "false"
  enable_waf_fail_open                        = "false"
  enable_xff_client_port                      = "false"
  idle_timeout                                = "60"
  internal                                    = "false"
  ip_address_type                             = "ipv4"
  load_balancer_type                          = "application"
  name                                        = "BackClusterInhouseLoadBalancer"
  preserve_host_header                        = "false"
  security_groups                             = ["${data.terraform_remote_state.sg.outputs.aws_security_group_tfer--default_sg-06f6ba1bb61b38398_id}"]

  subnet_mapping {
    subnet_id = "subnet-07a5f10345c0baedf"
  }

  subnet_mapping {
    subnet_id = "subnet-0c3764d6c2635180a"
  }

  subnets                    = ["${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-07a5f10345c0baedf_id}", "${data.terraform_remote_state.subnet.outputs.aws_subnet_tfer--subnet-0c3764d6c2635180a_id}"]
  xff_header_processing_mode = "append"
}
