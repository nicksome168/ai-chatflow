"use strict";

// const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { generateId } = require("./helper");
const config = require('./aws-config');

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

    config.dynamodb.put(user, (error) => {
        if(error){
         console.log("Error: ", error);
        }else{
         var resMap = {
            'action': 'signup',
            'message': 'success'
         };
        console.log("hello "+resMap);
        socket.emit('signup_response', resMap);
        }
     });
     
}

async function createNewUser(socket, email, userName, password, firstName, lastName) {
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

    config.dynamodb.get(params, (data) => {
        if(data){
            if (typeof data.Item != 'undefined' && data.Item.password === password) {
                var resMap = {
                    "message": "Success!",
                    "userName": data.Item.token.userName
                };
                socket.emit('login_response', resMap);
            }
           }else{
             resMap = {
                "message": "Login Unsuccessful! Try Again"
            };
            socket.emit('login_response', resMap);
           }
    });
}

exports.userLoginAuth = userLoginAuth;
exports.createNewUser = createNewUser;