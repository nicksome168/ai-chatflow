resource "aws_iam_role" "lf3_role" {
  name = "lf3_role" # configured in opensearch's access_policies

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
resource "aws_iam_role_policy_attachment" "lf3_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonOpenSearchServiceReadOnlyAccess",
  ])

  role       = aws_iam_role.lf3_role.name
  policy_arn = each.value
}
resource "aws_lambda_function" "lf3" {
  function_name = element(var.lf_function_names, 2)
  filename      = element(var.lf_filenames, 2)
  runtime       = "python3.11"
  handler       = "${element(var.lf_filenames, 2)}.lambda_handler" #entrypoint
  role          = aws_iam_role.lf3_role.arn
  timeout       = 15
  environment {
    variables = {
      OPENSEARCH_ENDPOINT = var.opensearch_endpoint
    }
  }
}

output "lf3_invoke_arn" {
  value = aws_lambda_function.lf3.invoke_arn
}
