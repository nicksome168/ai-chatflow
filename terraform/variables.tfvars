opensearch_domain_name = "history"
sqs_name               = "q1"
sqs_endpoint           = "dummy_sqs"
elasticache_name       = "redis"
sender_email           = "nicksome.yc@gmail.com"
lf_function_names = [
  "lf1-test",
  "lf2-test",
  "lf3-test",
  "lf4-test"
]
lf_filenames = [
  "../../lambda_functions/lf1/lf1.zip",
  "../../lambda_functions/lf2/lf2.zip",
  "../../lambda_functions/lf3/lf3.zip",
  "../../lambda_functions/lf4/lf4.zip",
]
gateway_name             = "gateway"
gateway_stage_name       = "dev"
message_table_arn        = "arn:aws:dynamodb:us-east-1:764559909612:table/test-table"
message_table_stream_arn = "arn:aws:dynamodb:us-east-1:764559909612:table/test-table/stream/2023-12-14T05:42:09.860"
opensearch_endpoint      = "dummy_es_endpoint"
