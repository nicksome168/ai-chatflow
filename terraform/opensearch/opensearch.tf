data "aws_caller_identity" "current" {}

variable "opensearch_domain_name" {}

resource "aws_opensearch_domain" "opensearch" {
  domain_name    = var.opensearch_domain_name
  engine_version = "Elasticsearch_7.10"

  cluster_config {
    instance_type = "t3.small.search"
  }
  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }
  access_policies = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
          "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lf1_role"
      },
      "Action": "es:*",
      "Resource": "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/${var.opensearch_domain_name}/*"
    }
  ]
}
EOF
}

output "opensearch_endpoint" {
  value = aws_opensearch_domain.opensearch.endpoint
}
