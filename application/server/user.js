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
            userName: userName
        }
    };

    config.dynamodb.get(params, (error, data) => {
        console.log("data: ",data)
        console.log("params: ",params)
        if(data){
            if (typeof data.Item != 'undefined' && data.Item.password === password) {
                var resMap = {
                    "message": "success",
                    "userName": data.Item.userName
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

function getAllRooms(socket, user1){
    const tableName = 'rooms';
    const attributeName = 'user1';
    const params = {
        TableName: tableName,
        FilterExpression: `${attributeName} = :value`,
        ExpressionAttributeValues: {
          ':value': user1,
        },
      };
      
      // Perform the scan operation
      config.dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error('Error scanning DynamoDB table:', err);
        } else {
          console.log("Entire Data: ", data);
          console.log('Scanned items:', data.Items);
          socket.emit('recentContacts', data.Items)
        }
      });
}

exports.userLoginAuth = userLoginAuth;
exports.createNewUser = createNewUser;
exports.getAllRooms = getAllRooms;