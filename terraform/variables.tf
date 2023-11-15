variable "opensearch_domain_name" {
  type    = string
  default = "history"
}

variable "sqs_name" {
  type    = string
  default = "q1"
}

variable "elasticache_name" {
  type = string
  default = "redis"
}

variable "sender_email" {
  type    = string
  default = "nicksome.yc@gmail.com"
}


variable "lf_function_names" {
  type = list(string)
  default = [
    "lf1",
    "lf2",
    "lf3",
    "lf4"
  ]

}

variable "lf_filenames" {
  type = list(string)
  default = [
    "../../lambda_functions/lf1/lf1.zip",
    "../../lambda_functions/lf2/lf2.zip",
    "../../lambda_functions/lf3/lf3.zip",
    "../../lambda_functions/lf4/lf4.zip",
  ]
}

variable "gateway_name" {
  type    = string
  default = "gateway"
}

variable "gateway_stage_name" {
  type    = string
  default = "dev"
}
