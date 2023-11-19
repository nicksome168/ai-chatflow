variable "lf3_invoke_arn" {}

resource "aws_apigatewayv2_integration" "lf3" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = var.lf3_invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"

}

resource "aws_apigatewayv2_route" "lf3_route_post" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "POST /search_msg"
  target    = "integrations/${aws_apigatewayv2_integration.lf3.id}"

}

resource "aws_lambda_permission" "lf3_api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = element(var.lf_function_names, 2)
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
