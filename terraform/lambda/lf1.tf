variable "lf1_root" {
  default = "../../lambda_functions/lf1"
}
resource "aws_iam_role" "lf1_role" {
  name = "lf1_role" # configured in opensearch's access_policies

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
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
    "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess",
    "arn:aws:iam::aws:policy/AmazonSESFullAccess"
  ])

  role       = aws_iam_role.lf1_role.name
  policy_arn = each.value
}
resource "null_resource" "lf1_dependencies" {
  provisioner "local-exec" {
    command = "pip install -r ${var.lf1_root}/requirements.txt -t ${var.lf1_root}"
  }

  triggers = {
    dependencies_versions = filemd5("${var.lf1_root}/requirements.txt")
    source_versions       = filemd5("${var.lf1_root}/lf1.py")
  }
}


data "archive_file" "lf1" {
  depends_on  = [null_resource.lf1_dependencies]
  type        = "zip"
  source_dir  = var.lf1_root
  output_path = "../../lambda_functions/lf1/lf1.zip"
}
resource "aws_lambda_function" "lf1" {
  function_name = element(var.lf_function_names, 0)
  filename      = element(var.lf_filenames, 0)
  runtime       = "python3.11"
  handler       = "${element(var.lf_filenames, 0)}.lambda_handler" #entrypoint
  role          = aws_iam_role.lf1_role.arn
  timeout       = 15
  environment {
    variables = {
      SENDER_EMAIL = var.sender_email,
      SQS_ENDPOINT = var.sqs_endpoint
    }
  }
}

# clean up only dependencies directories
resource "null_resource" "lf1_cleanup" {
  depends_on = [aws_lambda_function.lf1]
  provisioner "local-exec" {
    command = "rm -rf ${var.lf1_root}/*/ ${var.lf1_root}/lf1.zip"
  }
}

output "lf1_arn" {
  value = aws_lambda_function.lf1.arn
}
