import json
import boto3
from boto3.dynamodb.conditions import Attr
import requests

def lambda_handler(event, context):
    # OpenAI and SQS
    api_key = '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'
    sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/764559909612/Q1'
    # DynamoDB setup
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('messages')

    # Extract room and userName from the event
    room = event['room']
    userName = event['userName']
    
    print(room)
    print(userName)

    # Scan DynamoDB for messages in the given room
    scan_kwargs = {
        'FilterExpression': Attr('room').eq(room),
        'Limit': 20 
    }

    # Perform the scan operation on DynamoDB table
    scan_result = table.scan(**scan_kwargs)
    print(scan_result)

    # Concatenate messages into one big string
    messages = scan_result.get('Items', [])
    print(messages)
    sentMessage = ' '.join(message['message'] for message in messages if 'message' in message)
    print("***************************")
    print(sentMessage)

    # Define the query
    query = "Summarize the text in less than 100 words: " + sentMessage;
    
    print("*******************")
    print(query)
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": query}]
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
        print("**********RESPONSE*********")
        print(response)
        if response.status_code == 200:
            result = response.json().get('choices')[0].get('message').get('content').strip() if response.json().get('choices') else 'No response'
            
            # Prepare the message for SQS queue
            sqs_message_body = {
                'room': event['room'],
                'username': event['userName'],
                'result': result
            }
            
            # Send message to SQS queue
            sqs_client = boto3.client('sqs')
            sqs_response = sqs_client.send_message(
                QueueUrl=sqs_queue_url,
                MessageBody=json.dumps(sqs_message_body)
            )
            
            return {
                'statusCode': 200,
                'body': json.dumps({'GPT-3 Response': result, 'SQS Response': sqs_response})
            }
        else:
            return {
                'statusCode': response.status_code,
                'body': json.dumps("Error occurred: " + response.text)
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps("Error occurred: " + str(e))
        }

    