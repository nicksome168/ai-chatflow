// aws-config.js
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: "AWS-ACCESS-KEY",
  secretAccessKey: "AWS-SECRET-KEY",
  region: 'us-east-1', // Specify the AWS region you want to use
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamodb;