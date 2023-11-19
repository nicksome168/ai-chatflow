variable "message_table_stream_arn" {}
variable "message_table_arn" {}

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
          "${var.message_table_arn}",
          "${var.message_table_arn}/*",
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
  function_name    = element(var.lf_function_names, 3)
  filename         = element(var.lf_filenames, 3)
  runtime          = "python3.11"
  handler          = "${element(var.lf_filenames, 3)}.lambda_handler" #entrypoint
  role             = aws_iam_role.lf4_role.arn
  source_code_hash = data.archive_file.lf4.output_base64sha256

  timeout = 15
  environment {
    variables = {
      OPENSEARCH_ENDPOINT = var.opensearch_endpoint
    }
  }
}

# dynamo event trigger
resource "aws_lambda_event_source_mapping" "lf4_event" {
  event_source_arn  = var.message_table_stream_arn
  function_name     = aws_lambda_function.lf4.arn
  starting_position = "LATEST"
}
