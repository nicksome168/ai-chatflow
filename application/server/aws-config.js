// aws-config.js
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'aws-access-key',
  secretAccessKey: 'aws-secret-key',
  region: 'us-east-1', // Specify the AWS region you want to use
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

module.exports = dynamodb;
module.exports = lambda;