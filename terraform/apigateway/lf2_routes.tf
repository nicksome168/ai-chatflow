variable "lf2_invoke_arn" {}

resource "aws_apigatewayv2_integration" "lf2" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = var.lf2_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"

}

resource "aws_apigatewayv2_route" "lf2_route_post" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "POST /summarize"
  target    = "integrations/${aws_apigatewayv2_integration.lf2.id}"

}

resource "aws_lambda_permission" "lf2_api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = element(var.lf_function_names, 1)
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
