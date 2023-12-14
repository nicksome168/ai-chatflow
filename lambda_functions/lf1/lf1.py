import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

# Initialize logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration
region = 'us-east-1'
ses_client = boto3.client('ses', region_name=region)

# Email Config
sender_email_id = os.getenv('SENDER_EMAIL_ID', 'jayesh1302@gmail.com')
recipient_email_id = os.getenv('RECIPIENT_EMAIL_ID', 'jayesh1302@gmail.com')

# Function to return a standardized response
def _return_response(msg, statusCode):
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": '*',
        },
        "body": json.dumps(msg)
    }

# Function to send an email using SES
def send_email(ses_client, sender_email, recipient_email, subject, body_text):
    CHARSET = "UTF-8"
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
        raise

# Main Lambda handler function
def lambda_handler(event, context):
    try:
        # The 'event' parameter now contains the message from SQS provided by EventBridge
        body = event['Records'][0]['body']
        send_email(ses_client, sender_email_id, recipient_email_id, 'AI Photo Album : Summary text from chat', body)

        # Log success message
        msg = "Email sent successfully."
        logger.info(msg)
        return _return_response(msg, 200)

    except Exception as e:
        # Log and return error response
        logger.error(e)
        return _return_response(str(e), 500)