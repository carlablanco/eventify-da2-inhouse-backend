resource "aws_acm_certificate" "tfer--2ecdd22d-4240-40a8-820b-881a7f3b969a_back-002E-intranet-002E-deliver-002E-ar" {
  domain_name   = "back.intranet.deliver.ar"
  key_algorithm = "RSA_2048"

  options {
    certificate_transparency_logging_preference = "ENABLED"
  }

  subject_alternative_names = ["back.intranet.deliver.ar"]
  validation_method         = "DNS"
}

resource "aws_acm_certificate" "tfer--c8be7790-a1f2-48fe-ba11-3a7933d17c10_intranet-002E-deliver-002E-ar" {
  domain_name   = "intranet.deliver.ar"
  key_algorithm = "RSA_2048"

  options {
    certificate_transparency_logging_preference = "ENABLED"
  }

  subject_alternative_names = ["intranet.deliver.ar"]
  validation_method         = "DNS"
}
