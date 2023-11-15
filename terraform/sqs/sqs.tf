variable "sqs_name" {}

resource "aws_sqs_queue" "sqs" {
  name = var.sqs_name
}

data "aws_iam_policy_document" "sqs_iam_policy" {
  statement {
    sid    = "First"
    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.sqs.arn]
  }
}
resource "aws_sqs_queue_policy" "test" {
  queue_url = aws_sqs_queue.sqs.id
  policy    = data.aws_iam_policy_document.sqs_iam_policy.json
}

output "sqs_endpoint" {
  value = aws_sqs_queue.sqs.url
}
