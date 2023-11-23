resource "aws_iam_role" "lf0_role" {
  name = "lf0_role" # configured in opensearch's access_policies

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

resource "aws_iam_role_policy_attachment" "lf0_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  ])
  role       = aws_iam_role.lf0_role.name
  policy_arn = each.value
}

data "archive_file" "lf0" {
  type        = "zip"
  source_dir  = "../../lambda_functions/lf0"
  output_path = "../../lambda_functions/lf0/lf0.zip"
  excludes    = ["../../lambda_functions/lf0/lf0.zip"]
}

resource "aws_lambda_function" "lf0" {
  function_name    = "lf0"
  filename         = "../../lambda_functions/lf0/lf0.zip"
  runtime          = "python3.11"
  handler          = "lf0.lambda_handler" #entrypoint
  role             = aws_iam_role.lf0_role.arn
  source_code_hash = data.archive_file.lf0.output_base64sha256

  timeout = 15
}
