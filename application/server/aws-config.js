// aws-config.js
const AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1', // Specify the AWS region you want to use
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamodb;