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

output "lf1_arn" {
  value = aws_lambda_function.lf1.arn
}
