"use strict";

// const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { generateId } = require("./helper");
const dynamodb = require('./aws-config');

function addUser(socket, email, userName, password, firstName, lastName, token) {
    var user = {
        TableName: 'users',
        Item: {
            userName: userName,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
        }
    };

    dynamodb.put(user, (error) => {

        if(error){
         console.log("Error: ", error);
        }else{
         console.log("user added! success!");
        }
     });
}

function createNewUser(socket, email, userName, password, firstName, lastName) {
    var token = generateId(16);
    return addUser(socket, email, userName, password, firstName, lastName, token);
}

function userLoginAuth(socket, userName, password) {
    var params = {
        TableName: 'users',
        Key: {
            userName: { S: userName }
        }
    };

    dynamodb.get(params, (data) => {
        if(data){
            if (typeof data.Item != 'undefined' && data.Item.password === password) {
                var resMap = {
                    "message": "Success!",
                    "userName": data.Item.token.userName
                };
                socket.emit('login_response', resMap);
            }
           }else{
            var resMap = {
                "message": "Login Unsuccessful! Try Again"
            };
            socket.emit('login_response', resMap);
           }
    });
}

exports.userLoginAuth = userLoginAuth;
exports.createNewUser = createNewUser;