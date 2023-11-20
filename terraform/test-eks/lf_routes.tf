
resource "aws_apigatewayv2_integration" "lf0" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = aws_lambda_function.lf0.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"

}

resource "aws_apigatewayv2_route" "lf0_route_get" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "GET /test"
  target    = "integrations/${aws_apigatewayv2_integration.lf0.id}"

}

resource "aws_lambda_permission" "lf0_api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "lf0"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
