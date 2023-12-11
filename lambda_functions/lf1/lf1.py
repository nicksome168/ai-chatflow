import boto3
import json
import logging
from botocore.exceptions import ClientError


# Initialize logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration
region = 'us-east-1'
ses_client = boto3.client('ses', region_name=region)
sqs_client = boto3.client('sqs')
queue_url = 'https://sqs.us-east-1.amazonaws.com/764559909612/Q1'

# Email Config
sender_email_id = 'jayesh1302@gmail.com'
recipient_email_id = 'jayesh1302@gmail.com'

# Function to return a standardized response
def _return_response(msg, statusCode):
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": '*',
        },
        "body": json.dumps(msg)
    }

# Main Lambda handler function
def lambda_handler(event, context):
    logger.info("Polling from: {}".format(queue_url))
    try:
        # Receive messages from SQS
        response = sqs_client.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=10,
            WaitTimeSeconds=7
        )
        response = {
            'Messages': [
                {
                    'MessageId': 'dummy-message-id',
                    'ReceiptHandle': 'dummy-receipt-handle',
                    'Body': 'This is a test message body. This is a summary of the response.',
                    'Attributes': {
                        'ApproximateReceiveCount': '1',
                        'SentTimestamp': '1234567890',
                        'SenderId': 'AIDACKCEVSQ6C2EXAMPLE',
                        'ApproximateFirstReceiveTimestamp': '1234567890'
                    },
                    'MD5OfBody': 'cee8bfae8a6d415f9e1b827b3ff258c6',
                    'EventSource': 'aws:sqs',
                    'EventSourceARN': 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
                    'AwsRegion': 'us-east-1'
                }
            ]
        }
        # Check if messages were received
        if 'Messages' not in response:
            msg = "No messages in queue."
            logger.info(msg)
            return _return_response(msg, 200)

        # Process messages
        for message in response['Messages']:
            body = message['Body']
            receipt_handle = message['ReceiptHandle']

            # Here's where you'd parse the message body to extract email details, if needed
            # For example purposes, we'll just send the SQS message body as the email body
            send_email(ses_client, sender_email_id, recipient_email_id, 'AI Photo Album : Summary text from chat', body)

            # Delete the message from the queue after processing
            sqs_client.delete_message(
                QueueUrl=queue_url,
                ReceiptHandle=receipt_handle
            )

        # Return success response
        msg = "Emails sent successfully."
        logger.info(msg)
        return _return_response(msg, 200)

    except Exception as e:
        # Log and return error response
        logger.error(e)
        return _return_response(str(e), 500)

# Function to send an email using SES
def send_email(ses_client, sender_email, recipient_email, subject, body_text):
    CHARSET = "UTF-8"
    print('************************************')
    print(body_text)
    print(ses_client)
    print(sender_email)
    print(recipient_email)
    print(subject)
    try:
        response = ses_client.send_email(
            Destination={
                "ToAddresses": [recipient_email],
            },
            Message={
                "Body": {
                    "Text": {
                        "Charset": CHARSET,
                        "Data": body_text,
                    },
                },
                "Subject": {
                    "Charset": CHARSET,
                    "Data": subject,
                },
            },
            Source=sender_email,
        )
        logger.info(f"Email sent to {recipient_email} with Message ID: {response['MessageId']}")
    except ClientError as e:
        logger.error(f"An error occurred: {e.response['Error']['Message']}")
