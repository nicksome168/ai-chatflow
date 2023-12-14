"use strict";

const { DynamoDBClient, PutItemCommand, GetItemCommand, DeletItemCommand, BatchGetItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const { generateId } = require('./helper');
const { command } = require("yargs");

function unpackPeopleMap(users) {
    var res = []
    for (const u in users) {
        res.push({
            userName: u
        });
    }
    return res;
}

function createRoom(socket, roomName, userName) {
    var roomId = generateId(16);
    var users = {};
    users[userName] = {
        M: {
            "userName": {
                "S": userName
            }
        }
    };

    var params = {
        TableName: 'rooms',
        Item: {
            roomId: { S: roomId },
            roomName: { S: roomName },
            noOfUsers: { N: "1" },
            users: {
                M: users
            }
        }
    };

    const createRoomCommand = new PutItemCommand(params);
    return dynamoDbClient.send(createRoomCommand).then((data) => {
        var resMap = {
            "action": "create",
            "message": "Success!",
            "roomName": roomName
        };
        var room = {
            "roomId": roomId,
            "roomName": roomName,
            "noOfUsers": 1,
            "users": [{
                "userName": userName
            }]
        };
        socket.emit('channel_response', resMap);
        return room;
    }, (error) => {
        socket.emit('channel_response', {
            "action": "create",
            "message": error
        })
    });
}

function joinRoom(socket, roomId, userName) {
    var params = {
        TableName: 'rooms',
        Key: {
            "roomId": { S: roomId }
        },
        UpdateExpression: "SET users.#userName = :users, noOfUsers = noOfUsers + :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" },
            ":users": {
                M: { userName: { S: userName } }
            }
        },
        ExpressionAttributeNames: {
            "#userName": userName
        },
        "ReturnValues": "ALL_NEW"
    };

    var joinRoomCommand = new UpdateItemCommand(params);
    return dynamoDbClient.send(joinRoomCommand).then((data) => {
            var noOfUsers = parseInt(data.Attributes.noOfUsers.N);
            var resMap = {
                "action": "join",
                "noOfUsers": noOfUsers,
                "message": "Success!"
            }
            var users = unpackPeopleMap(data.Attributes.users.M);

            var room = {
                'roomId': data.Attributes.roomId.S,
                'roomName': data.Attributes.roomName.S,
                'users': users,
                'noOfUsers': noOfUsers
            };
            socket.emit('channel_response', resMap);
            return room;
        },
        (error) => {
            socket.emit('channel_response', {
                "action": "join",
                "message": error
            });
        });
}

function removeRoom(roomId) {
    var params = {
        TableName: 'rooms',
        Key: { "roomId": { S: roomId } },
    };
    var removeRoomCommand = new DeleteItemCommand(params);
    dynamoDbClient.send(removeRoomCommand).then(
        (data) => {}, (error) => {}
    );
}

function exitRoom(socket, roomId, userName) {
    var params = {
        TableName: 'rooms',
        Key: {
            "roomId": { S: roomId }
        },
        UpdateExpression: "REMOVE users.#userName  SET noOfUsers = noOfUsers - :incr",
        ExpressionAttributeValues: {
            ":incr": { N: "1" }
        },
        ExpressionAttributeNames: {
            "#userName": userName
        },
        "ReturnValues": "ALL_NEW",
    };

    var exitRoomCommand = new UpdateItemCommand(params);
    return dynamoDbClient.send(exitRoomCommand).then(
        (data) => {
            var noOfUsers = parseInt(data.Attributes.noOfUsers.N);
            if (noOfUsers === 0) delete_channel(roomId);

            socket.emit('channel_response', { "action": "Exit", "message": "Success!" });

            var users = unpackPeopleMap(data.Attributes.users.M);
            var room = {
                'roomId': data.Attributes.roomId.S,
                'roomName': data.Attributes.roomName.S,
                'users': users,
                'user_count': noOfUsers
            };
            return room;
        },
        (error) => {
            console.log(error);
            socket.emit('channel_response', { "action": "Exit", "message": error });
        }
    );
}


function fetchAllRooms(socket, roomId) {
    const limit = 20;
    var params = {
        TableName: 'rooms'
    }
    var fetchAllRoomsCommand = new ScanCommand(params);
    dynamoDbClient.send(fetchAllRoomsCommand).then(
        (data) => {
            var rooms = data['Items'].sort((a, b) => Object.values(b['noOfUsers'])[0] - Object.values(a['noOfUsers']));
            var allRooms;

            if (roomId === "") {
                allRooms = rooms.slice(0, limit);
            } else if (roomId !== "") {
                var roomIndex = rooms.findIndex(function(item, i) {
                    return item.roomId.S === roomId;
                });
                allRooms = rooms.slice((roomIndex + 1), (roomIndex + 1 + limit));
            }
            var res_data = [];
            allRooms.forEach(function(x) {
                res_data.push({
                    "users": unpackPeopleMap(x.users.M),
                    "roomName": x.roomName.S,
                    "roomId": x.roomId.S,
                    "noOfUsers": x.noOfUsers.N,
                });
            });
            socket.emit('channel_response', { "action": "fetchAllRooms", "data": res_data });
        },
        (error) => {
            console.log(error);
            socket.emit('channel_response', { "action": "fetchAllRooms", "data": [] });
        }
    );
}

function fetchAllMessages(socket, msg) {

    var roomId = msg['roomId'];
    var msgId = msg['msgId'] || '';
    const msgCount = 50; //Number(msg_params['count']);

    if (msgId === "") {
        var params = {
            KeyConditionExpression: "roomId = :rid",
            ExpressionAttributeValues: {
                ":rid": { S: roomId },
            },
            TableName: "messages",
            Limit: msgCount,
            ScanIndexForward: false,
        };

        var fetchAllMessagesCommand = new QueryCommand(params);
        dynamoDbClient.send(fetchAllMessagesCommand).then(
            (data) => {
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
            },
            (error) => {
                socket.emit('message_response', {
                    "action": "fetchAllMessages",
                    "data": [],
                });
            }
        );
    } else if (msgId !== "") {
        var params = {
            KeyConditionExpression: "roomId = :rid",
            FilterExpression: "#msgId = :msgId",
            ExpressionAttributeNames: { "#msgId": "msgId" },
            ExpressionAttributeValues: {
                ":rid": { S: roomId },
                ":msgId": { S: msgId },
            },
            TableName: "messages",
        };

        var command = new QueryCommand(params);
        dynamoDbClient.send(command).then(
            (data) => {

                var msg_datetime = Object.values(data['Items'][0]['datetime'])[0];
                var params = {
                    KeyConditionExpression: "roomId = :rid AND #datetime < :datetime",
                    ExpressionAttributeNames: { "#datetime": "datetime" },
                    ExpressionAttributeValues: {
                        ":rid": { S: roomId },
                        ":datetime": { S: msg_datetime },
                    },
                    TableName: "messages",
                    Limit: message_count,
                    ScanIndexForward: false, //descending
                };

                var command = new QueryCommand(params);
                client.send(command).then(
                    (data) => {
                        var res_data = [];
                        data["Items"].forEach(function(x) {
                            res_data.push({
                                "message_id": x.message_id.S,
                                "text": x.text.S,
                                "username": x.username.S,
                                "datetime": x.datetime.S,
                            });
                        });
                        socket.emit('message_response', {
                            "action": "fetchAllMessages",
                            "data": res_data,
                        });
                    },
                    (error) => {
                        console.log(error);
                        socket.emit('message_response', {
                            "action": "fetchAllMessages",
                            "data": [],
                        });
                    }
                );
            },
            (error) => {
                console.log(error);
                socket.emit('message_response', {
                    "action": "fetchAllMessages",
                    "data": [],
                });
            }
        );
    }
}

exports.createRoom = createRoom();
exports.joinRoom = joinRoom();
exports.exitRoom = exitRoom();
exports.fetchAllRooms = fetchAllRooms();
exports.fetchAllMessages = fetchAllMessages();