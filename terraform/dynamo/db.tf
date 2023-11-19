# resource "aws_dynamodb_table" "profile" {
#   name         = "profile"
#   billing_mode = "PAY_PER_REQUEST"
#   hash_key     = "id"
#   attribute {
#     name = "id"
#     type = "S"
#   }
# }

resource "aws_dynamodb_table" "message" {
  name             = "message"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "id"
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"
  attribute {
    name = "id"
    type = "S"
  }
}

# resource "aws_dynamodb_table" "convo" {
#   name         = "convo"
#   billing_mode = "PAY_PER_REQUEST"
#   hash_key     = "id"
#   attribute {
#     name = "id"
#     type = "S"
#   }
# }

output "message_table_stream_arn" {
  value = aws_dynamodb_table.message.stream_arn
}

output "message_table_arn" {
  value = aws_dynamodb_table.message.arn
}
