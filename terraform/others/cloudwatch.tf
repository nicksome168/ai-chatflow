variable "lf1_arn" {}
variable "lf_function_names" {}

resource "aws_cloudwatch_event_rule" "lf1_trigger" {
  name                = "lf1-trigger"
  description         = "Schedule lf1 function"
  schedule_expression = "rate(1 minute)"
}
resource "aws_cloudwatch_event_target" "lf1_target" {
  target_id = "lf1-target"
  rule      = aws_cloudwatch_event_rule.lf1_trigger.name
  arn       = var.lf1_arn
}
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = element(var.lf_function_names, 0)
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lf1_trigger.arn
}
