terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.19.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0.4"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  shared_credentials_files = ["/home/vscode/.aws/credentials"]
  profile                  = "terraform"
}

resource "aws_dynamodb_table" "message" {
  name             = "message"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "id"
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"
  attribute {
    name = "id"
    type = "S"
  }
}


data "aws_caller_identity" "current" {}

variable "opensearch_domain_name" {
  default = "history"
}

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
  access_policies = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "es:*"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lf4_role"
      }
      Resource = "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/${var.opensearch_domain_name}/*"
      }
    ]
  })
}

resource "aws_iam_role" "lf4_role" {
  name = "lf4_role" # configured in opensearch's access_policies

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy" "dynamodb_read_log_policy" {
  name = "lambda-dynamodb-log-policy"
  role = aws_iam_role.lf4_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*",
      },
      {
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:GetItem",
          "dynamodb:GetRecords",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_dynamodb_table.message.arn}",
          "${aws_dynamodb_table.message.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lf4_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
    "arn:aws:iam::aws:policy/AmazonOpenSearchServiceFullAccess",

  ])
  role       = aws_iam_role.lf4_role.name
  policy_arn = each.value
}

data "archive_file" "lf4" {
  type        = "zip"
  source_dir  = "../../lambda_functions/lf4/package"
  output_path = "../../lambda_functions/lf4/lf4.zip"
}

resource "aws_lambda_function" "lf4" {
  function_name    = "lf4"
  filename         = "../../lambda_functions/lf4/lf4.zip"
  runtime          = "python3.11"
  handler          = "lf4.lambda_handler" #entrypoint
  role             = aws_iam_role.lf4_role.arn
  source_code_hash = data.archive_file.lf4.output_base64sha256
  timeout          = 15
  environment {
    variables = {
      OPENSEARCH_ENDPOINT = aws_opensearch_domain.opensearch.endpoint
    }
  }
}

# dynamo event trigger
resource "aws_lambda_event_source_mapping" "lf4_event" {
  event_source_arn  = aws_dynamodb_table.message.stream_arn
  function_name     = aws_lambda_function.lf4.arn
  starting_position = "LATEST"
}
