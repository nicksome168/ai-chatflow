variable "message_table_stream_arn" {}
variable "message_table_arn" {}
variable "lf4_root" {
  default = "../../lambda_functions/lf4"
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

resource "null_resource" "lf4_dependencies" {
  provisioner "local-exec" {
    command = "pip install -r ${var.lf4_root}/requirements.txt -t ${var.lf4_root}"
  }

  triggers = {
    dependencies_versions = filemd5("${var.lf4_root}/requirements.txt")
    source_versions       = filemd5("${var.lf4_root}/lf4.py")
  }
}


data "archive_file" "lf4" {
  depends_on  = [null_resource.lf4_dependencies]
  type        = "zip"
  source_dir  = var.lf4_root
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

# clean up the dependencies
resource "null_resource" "lf4_cleanup" {
  depends_on = [aws_lambda_function.lf4]
  provisioner "local-exec" {
    command = "rm -rf ${var.lf4_root}/*/ ${var.lf4_root}/lf4.zip ${var.lf4_root}/six.py"
  }
}

# dynamo event trigger
resource "aws_lambda_event_source_mapping" "lf4_event" {
  event_source_arn  = var.message_table_stream_arn
  function_name     = aws_lambda_function.lf4.arn
  starting_position = "LATEST"
}
