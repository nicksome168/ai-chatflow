"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "us-east-2" });

function addUser(socket, email, userName, password, firstName, lastName, token) {
    var user = {
        TableName: 'users',
        Item: {
            userName: { S: userName },
            password: { S: password },
            email: { S: email },
            firstName: { S: firstName },
            lastName: { S: lastName },
            token: { S: token }
        }
    };

    const addUserCommand = new PutItemCommand(user);
    dynamoDbClient.send(addUserCommand).then((data) => {
            var resMap = {
                "message": "Success!",
                "userName": userName,
                "token": token
            };
            socket.emit('login_response', resMap);
        },
        (error) => {
            console.log(error);
        });
}

function createNewUser(socket, email, userName, password, firstName, lastName){
    var token = makeid(16);
    return addUser(socket, email, userName, password, firstName, lastName, token);
}

function userLoginAuth(socket, userName, password) {
    var params = {
        TableName: 'users',
        Key: {
            userName: { S: userName }
        }
    };

    const userLoginAuthCommand = new GetItemCommand(params);
    dynamoDbClient.send(userLoginAuthCommand).then((data) => {
        if (typeof data.Item != 'undefined' && data.Item.password.S === password) {
            var resMap = {
                "message": "Success!",
                "token": data.Item.token.S
            };
            socket.emit('login_response', resMap);
        }

    }, (error) => {
        var resMap = {
            "message": error
        };
        socket.emit('login_response', resMap);
    });
}

function tokenAuth(userName, token) {
    var params = {
        TableName: 'users',
        Key: {
            userName: { S: userName }
        }
    }

    const tokenAuthCommand = new GetItemCommand(params);
    return dynamoDbClient.send(tokenAuthCommand).then((data) => {
        if (data.Item.token.S !== token) {
            throw new Error('the token is expired or invalid');
        }
    });
}

exports.userLoginAuth = userLoginAuth();
exports.tokenAuth = tokenAuth();