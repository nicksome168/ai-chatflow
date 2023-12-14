"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "us-east-2" });
const { generateId } = require('./helper')
const apiGateway = require('./apiGateway');

async function sendMessage(socket, msg) {
    var roomId = msg['roomId'];
    var text = msg['text'];
    var userName = msg['userName'];
    var datetime = msg['datetime'];
    var msgId = makeId(16);

    var params = {
        TableName: 'messages',
        Item: {
            msgId: { S: msgId },
            text: { S: text },
            roomId: { S: roomId },
            userName: { S: userName },
            datetime: { S: datetime }
        }
    };

    var msgObj = {
        msgId: msgId,
        userName: userName,
        text: text,
        roomId: roomId,
        datetime: datetime
    };

    const sendMessageCommand = new PutItemCommand(params);
    return dynamoDbClient.send(sendMessageCommand).then((data) => {
        socket.emit('message_response', {
            "action": "SendMessage",
            "message": error
        });
    });

}

async function searchMessage(socket, params) {
    var roomId = params['roomId'];
    var message = params['message'];

    return apiGateway.searchMessages(roomId, message).then((data) => {
        var res_data = [];
        data["Items"].forEach(function(x) {
            res_data.push({
                "msgId": x.msgId.S,
                "text": x.text.S,
                "username": x.userName.S,
                "datetime": x.datetime.S,
            });
        });
        socket.emit('message_response', {
            "action": "fetchAllMessages",
            "data": res_data,
        });
    },(error) => {
                socket.emit('message_response', {
                    "action": "fetchAllMessages",
                    "data": [],
                });
            });

}

exports.sendMessage = sendMessage();
exports.searchMessage = searchMessage();