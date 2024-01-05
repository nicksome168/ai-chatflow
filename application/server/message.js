"use strict";

const config = require('./aws-config');
// const lambda = require('./aws-config');
const { generateId } = require('./helper');


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

    config.dynamodb.put(params, (error) => {

        if (error) {
            console.log("Error: ", error);
        } else {
            console.log("success");
        }
    });
}

async function summarise(socket, room, messages, userName) {
    var params = {
        FunctionName: 'lf2-test',
        InvocationType: 'Event', // Use 'Event' for asynchronous invocation
        Payload: JSON.stringify({ room: room, messages: messages, userName: userName }),
    };

    config.lambda.invoke(params, (err, data) => {
        if (err) {
            console.error('Error invoking Lambda function:', err);
        } else {
            var resMap = {
                'action': 'summarise',
                'message': 'success'
             };
            socket.emit('summarise_response', resMap);
            // Process the response from the Lambda function
            //   const response = JSON.parse(data.Payload);
            //   console.log('Lambda function response:', response);
        }
    });
}

exports.sendMessage = sendMessage;
exports.summarise = summarise;
