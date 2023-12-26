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
dynamodb = boto3.client('dynamodb', region_name=region)
ses_client = boto3.client('ses', region_name=region)

# Email Config
sender_email_id = os.getenv('SENDER_EMAIL_ID')

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

# Function to get the email address from DynamoDB based on the username
def get_email_for_username(username):
    try:
        response = dynamodb.get_item(
            TableName='users',
            Key={
                'userName': {'S': username}
            }
        )
        if 'Item' in response and 'email' in response['Item']:
            email = response['Item']['email']['S']
            logger.info(f"Email for user {username} found: {email}")
            return email
        else:
            logger.error(f"No email found for user {username}. Sending to admin.")
            adminEmail = jayesh1302@gmail.com
            return adminEmail
    except ClientError as e:
        logger.error(f"Unable to get email for user {username}: {e.response['Error']['Message']}")
        raise

# Main Lambda handler function
def lambda_handler(event, context):
    try:
        # Parse the message from SQS
        message = json.loads(event['Records'][0]['body'])
        logger.info(f"Received SQS message: {message}")
        roomID = message['room']
        # Extract username and find the associated email
        username = message['username']
        recipient_email_id = get_email_for_username(username)
        if recipient_email_id is None:
            raise ValueError(f"Email for user {username} not found.")
        # Send email to the recipient
        send_email(ses_client, sender_email_id, recipient_email_id, 'AI ChatFlow : Summary text from '+roomID, message['result'])

        # Log and return success response
        msg = f"Email sent successfully to {recipient_email_id}."
        logger.info(msg)
        return _return_response(msg, 200)

    except Exception as e:
        # Log and return error response
        error_msg = f"Error processing the Lambda function: {str(e)}"
        logger.error(error_msg)
        return _return_response(error_msg, 500)