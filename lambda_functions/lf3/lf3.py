import boto3
import json
import requests
from requests_aws4auth import AWS4Auth
import os

# Configuration
region = 'us-east-1'
endpoint = os.getenv('OPENSEARCH_ENDPOINT')  # Make sure this is set in your environment variables
index_name = 'history' # Make sure this is set in your environment variables

print("************************")
print("Endpoint:", endpoint)
print("Index Name:", index_name)

def lambda_handler(event, context):
    # Extract input parameters
    # chatroom_id = event.get('chatroomID')  # Now extracting from the event object
    # search_keyword = event.get('searchKeyword')  # Now extracting from the event object
    chatroom_id = 'jayesh-nick'
    search_keyword = 'test'
    # Set up the OpenSearch endpoint and authentication
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    headers = {'Content-Type': 'application/json'}

    # Define the search query
    query = {
        "query": {
            "bool": {
                "must": [
                    {"match": {"room": chatroom_id}},
                    {"match": {"message": search_keyword}}
                ]
            }
        }
    }
    print("Query:", json.dumps(query, indent=4))

    # Prepare the search URL
    search_url = f'{endpoint}/{index_name}/_search'
    print("Search URL:", search_url)

    # Perform the search
    response = requests.post(search_url, auth=awsauth, headers=headers, data=json.dumps(query))
    print("Response Status Code:", response.status_code)
    print("Response Text:", response.text)

    if response.status_code == 200:
        search_results = response.json()
        return {
            'statusCode': 200,
            'body': json.dumps(search_results['hits']['hits'], indent=4)
        }
    else:
        return {
            'statusCode': response.status_code,
            'body': 'Error in performing the search: ' + response.text
        }