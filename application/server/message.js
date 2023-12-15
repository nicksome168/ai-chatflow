"use strict";

const dynamodb = require('./aws-config');
const lambda = require('./aws-config');
const {generateId} = require('./helper');


function sendMessage(room, sender, message, recipient) {
    var params = {
        TableName: 'messages',
        Item: {
            msgId: generateId(16),
            room: room,
            sender: sender,
            message: message,
            recipient: recipient,
            datetime: Date.now()
        }
    };

    dynamodb.put(params, (error) => {

       if(error){
        console.log("Error: ", error);
       }else{
        console.log("success");
       }
    });
}

async function summarise(room, messages, userName){
    var params = {
        FunctionName: 'lf2-test',
        InvocationType: 'Event', // Use 'Event' for asynchronous invocation
        Payload: JSON.stringify({ room: room, messages: messages, userName: userName }),
    };

    lambda.invoke(params, (err, data) => {
        if (err) {
          console.error('Error invoking Lambda function:', err);
        } else {
          // Process the response from the Lambda function
        //   const response = JSON.parse(data.Payload);
          console.log('Lambda function response:', data.Item);
        }
      });
}

exports.sendMessage=sendMessage;
exports.summarise=summarise;