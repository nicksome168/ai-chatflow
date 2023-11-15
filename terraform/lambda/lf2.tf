resource "aws_iam_role" "lf2_role" {
  name = "lf2_role" # configured in opensearch's access_policies

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
resource "aws_iam_role_policy_attachment" "lf2_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonSQSFullAccess",
  ])

  role       = aws_iam_role.lf2_role.name
  policy_arn = each.value
}
resource "aws_lambda_function" "lf2" {
  function_name = element(var.lf_function_names, 1)
  filename      = element(var.lf_filenames, 1)
  runtime       = "python3.11"
  handler       = "${element(var.lf_filenames, 1)}.lambda_handler" #entrypoint
  role          = aws_iam_role.lf2_role.arn
  timeout       = 15
  environment {
    variables = {
      SQS_ENDPOINT = var.sqs_endpoint
    }
  }
}

output "lf2_invoke_arn" {
  value = aws_lambda_function.lf2.invoke_arn
}
