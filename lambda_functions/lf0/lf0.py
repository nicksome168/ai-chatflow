import os

VAR = os.getenv('ENV_VAR')

def lambda_handler(event, context):
    return { 
        'message' : 'Hello World with {}!'.format(VAR)
    }