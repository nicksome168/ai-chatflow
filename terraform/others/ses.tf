variable "sender_email" {}

resource "aws_ses_email_identity" "ses" {
  email = var.sender_email
}
