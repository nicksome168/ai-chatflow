// aws-config.js
const AWS = require('aws-sdk');
//require('dotenv').config();


AWS.config.update({
  accessKeyId: '***',
  secretAccessKey: "***",
  region: 'us-east-1', // Specify the AWS region you want to use
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

exports.lambda=lambda;
exports.dynamodb = dynamodb;