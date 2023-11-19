import boto3
import requests
from requests_aws4auth import AWS4Auth
import logging
import os

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

region = 'us-east-1' 
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

host = os.getenv('OPENSEARCH_ENDPOINT')
index = 'history'
datatype = '_doc'
url = 'https://' + host + '/' + index + '/' + datatype + '/'


headers = { "Content-Type": "application/json" }

def lambda_handler(event, context):
    count = 0
    for record in event['Records']:
        # Get the primary key for use as the OpenSearch ID
        id = record['dynamodb']['Keys']['id']['S']

        document = record['dynamodb']['NewImage']
        r = requests.put(url + id, auth=awsauth, json=document, headers=headers)
        count += 1
    LOGGER.info(str(count) + ' records processed.')
    return str(count) + ' records processed.'