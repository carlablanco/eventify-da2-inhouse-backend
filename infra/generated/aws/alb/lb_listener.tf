resource "aws_lb_listener" "tfer--arn-003A-aws-003A-elasticloadbalancing-003A-us-east-1-003A-163697924393-003A-listener-002F-app-002F-BackClusterInhouseLoadBalancer-002F-14365375e323a982-002F-75b9827be1ed2893" {
  certificate_arn = "arn:aws:acm:us-east-1:163697924393:certificate/2ecdd22d-4240-40a8-820b-881a7f3b969a"

  default_action {
    forward {
      stickiness {
        duration = "3600"
        enabled  = "false"
      }

      target_group {
        arn    = "arn:aws:elasticloadbalancing:us-east-1:163697924393:targetgroup/tgposta/78830bf60c1fac5d"
        weight = "1"
      }
    }

    order            = "1"
    target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:163697924393:targetgroup/tgposta/78830bf60c1fac5d"
    type             = "forward"
  }

  load_balancer_arn = "${data.terraform_remote_state.alb.outputs.aws_lb_tfer--BackClusterInhouseLoadBalancer_id}"

  mutual_authentication {
    ignore_client_certificate_expiry = "false"
    mode                             = "off"
  }

  port       = "3001"
  protocol   = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"
}
