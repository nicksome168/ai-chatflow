import boto3
import json
import requests
from requests_aws4auth import AWS4Auth

def lambda_handler(event, context):
    # Extract input parameters
    chatroom_id = event.get('chatroomID')
    search_keyword = event.get('searchKeyword')

    # Set up the OpenSearch endpoint and authentication
    endpoint = 'https://YOUR_OPENSEARCH_DOMAIN_ENDPOINT'
    region = 'YOUR_REGION'  # e.g., us-west-1
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    headers = {'Content-Type': 'application/json'}

    # Define the search query
    query = {
        "sort": [
            {"timestamp": {"order": "asc"}}
        ],
        "query": {
            "bool": {
                "must": [
                    {"match": {"chatroomID": chatroom_id}},
                    {"prefix": {"message": search_keyword}}
                ]
            }
        }
    }

    # Prepare the search URL
    search_url = f'{endpoint}/YOUR_INDEX_NAME/_search'  # Replace 'YOUR_INDEX_NAME' with your index name

    # Perform the search
    response = requests.post(search_url, auth=awsauth, headers=headers, data=json.dumps(query))
    search_results = response.json()

    # Extract and return results
    return {
        'statusCode': 200,
        'body': json.dumps(search_results['hits']['hits'])
    }
