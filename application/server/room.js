"use strict";

// const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
// const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

const dynamodb = require('./aws-config');

function joinRoom(socket, room) {
    var params = {
        TableName: 'rooms',
        Item: {
            room: room,
            user1: room.split("-")[0],
            user2: room.split("-")[1]
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

exports.joinRoom=joinRoom;