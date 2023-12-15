"use strict";

const dynamodb = require('./aws-config');
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

exports.sendMessage=sendMessage;