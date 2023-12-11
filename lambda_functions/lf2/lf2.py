import json
import requests
import boto3

def lambda_handler(event, context):
    api_key = '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'
    sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/764559909612/Q1'
    
    # Define the query
    query = "Summarize the text in less than 100 words: " + "Exciting news! Our cloud computing project is making significant progress. Over the past few weeks, we've been diligently working on migrating our data and applications to the cloud, and I'm thrilled to share some updates. Firstly, our migration plan is proceeding smoothly. We've successfully moved a substantial portion of our data to the cloud, resulting in improved accessibility and scalability. This will enable us to handle increased workloads seamlessly.Additionally, our cloud infrastructure is proving to be highly reliable. We've conducted thorough testing, and the results have been very promising. Downtime has been minimized, and our systems are running more efficiently than ever."

    # try:
    #     headers = {
    #         "Authorization": f"Bearer {api_key}",
    #         "Content-Type": "application/json"
    #     }

    #     data = {
    #         "model": "gpt-3.5-turbo",
    #         "messages": [{"role": "user", "content": query}]
    #     }

    #     response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
        
    #     if response.status_code == 200:
    #         result = response.json().get('choices')[0].get('message').get('content').strip() if response.json().get('choices') else 'No response'
            
    #         # Send message to SQS queue
    #         sqs_client = boto3.client('sqs')
    #         sqs_response = sqs_client.send_message(
    #             QueueUrl=sqs_queue_url,
    #             MessageBody=json.dumps(result)
    #         )
            
    #         return {
    #             'statusCode': 200,
    #             'body': json.dumps({'GPT-3 Response': result, 'SQS Response': sqs_response})
    #         }
    #     else:
    #         return {
    #             'statusCode': response.status_code,
    #             'body': json.dumps("Error occurred: " + response.text)
    #         }
    # except Exception as e:
    #     print("Error while querying OpenAI or sending to SQS: ", str(e))
    #     return {
    #         'statusCode': 500,
    #         'body': json.dumps("Error occurred")
    #     }


    # TESTING CODE
    try:
        sqs_client = boto3.client('sqs')
        sqs_response = sqs_client.send_message(
            QueueUrl=sqs_queue_url,
            MessageBody="This is the testing code for SQS queue"
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'GPT-3 Response': "This is testing code for response", 'SQS Response': sqs_response})
        }
    except Exception as e:
        print("Error whilesending to SQS: ", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps("Error occurred")
        }