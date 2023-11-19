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

module "eks" {
  source = "./eks"
}

module "opensearch" {
  source = "./opensearch"

  opensearch_domain_name = var.opensearch_domain_name
}

module "elasticache" {
  source = "./elasticache"

  elasticache_name = var.elasticache_name
}

module "sqs" {
  source = "./sqs"

  sqs_name = var.sqs_name
}

module "dynamo" {
  source = "./dynamo"
}

module "lambda" {
  source = "./lambda"

  sender_email      = var.sender_email
  lf_filenames      = var.lf_filenames
  lf_function_names = var.lf_function_names

  sqs_endpoint             = module.sqs.sqs_endpoint
  opensearch_endpoint      = module.opensearch.opensearch_endpoint
  message_table_arn        = module.dynamo.message_table_arn
  message_table_stream_arn = module.dynamo.message_table_stream_arn

  depends_on = [
    module.sqs,
    module.opensearch,
    module.dynamo
  ]
}

module "apigateway" {
  source = "./apigateway"

  gateway_name       = var.gateway_name
  gateway_stage_name = var.gateway_stage_name
  lf_function_names  = var.lf_function_names

  lf2_invoke_arn = module.lambda.lf2_invoke_arn
  lf3_invoke_arn = module.lambda.lf2_invoke_arn

  depends_on = [
    module.lambda
  ]
}

module "others" {
  source = "./others"

  lf_function_names = var.lf_function_names
  sender_email      = var.sender_email

  lf1_arn = module.lambda.lf1_arn

  depends_on = [
    module.lambda
  ]
}
