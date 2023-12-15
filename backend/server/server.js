"use strict";

const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config();
const HOST = 'localhost';

const app = express();

const http = require('http').createServer(app);
const io = require("socket.io")(http);
const redisAdapter = require('socket.io-redis');

const user = require('./user');
const room = require('./room');
const message = require('./message');
const apiGateway = require('./apiGateway');

io.adapter(redisAdapter({
    host: process.env.REDIS_ENDPOINT,
    port: 6379,
}));

io.on('connection', (socket) => {
    socket.on('login', (params) => {
        var userName = params['userName'];
        var password = params['password'];
        socket.emit('login_response', params);
        user.userLoginAuth(socket, userName, password);
    });

    socket.on('signup', (params) => {
        var email = params['email'];
        var userName = params['userName'];
        var password = params['password'];
        var firstName = params['firstName'];
        var lastName = params['lastName'];
        socket.emit('signup_response', params);
        user.createNewUser(socket, email, userName, password, firstName, lastName);
    });

    socket.on('room', (params) => {
        var action = params['action'];
        var token = params['token'];
        var userName = params['userName'];

        user.tokenAuth(userName, token).then(() => {
            if (action === "create") {

                var roomName = params['userName'];
                return room.createRoom(socket, roomName, userName);

            } else if (action === "join") {

                var roomId = params['roomId'];
                return room.joinRoom(socket, roomId, userName);

            } else if (action === "exit") {

                var roomId = params['roomId'];
                return room.exitRoom(socket, roomId, userName);

            } else if (action === "fetchAllRooms") {

                var roomId = params['roomId'];
                return room.fetchAllRooms(socket, roomId);

            }
        }).then((data) => {
            var resMap = {
                action: action,
                data: data
            };
            if (action === "join") {

                var roomId = params['roomId'];
                socket.join(roomId);
                socket.to(roomId).emit('receive_channel', resMap);

            } else if (action === "exit") {

                var roomId = params['roomId'];
                socket.leave(roomId);
                socket.to(roomId).emit('receive_channel', resMap);

            } else if (action === "create") {

                socket.join(roomId);
                socket.broadcast.emit('receive_channel', resMap);

            }
        }).catch((error) => {
            socket.emit('channel_response', {
                'action': action,
                'message': 'the token has expired or is invalid'
            });
        });
    });

    socket.on('message', (params) => {
        var action = params['action'];
        var token = params['token'];
        var userName = params['userName'];
        var room = params['room'];
        userName.tokenAuth(userName, token).then(() => {
            if (action === 'send') {

                return message.sendMessage(socket, params);

            } else if (action === 'fetchAllMessages') {

                room.fetchAllMessages(socket, params);

            } else if (action === 'search') {

                message.searchMessages(socket, params);

            }
        }).then((message) => {
            if (action === 'send') {
                var resMap = {
                    action: action,
                    data: message
                };
                socket.to(room).emit('receive_message', resMap)
            } else if (action === 'sendToRoom') {
                var resMap = {
                    action: action,
                    data: message
                };
                socket.to(room).emit('receive_message', resMap)
            }
        }).catch((error) => {
            socket.emit('messageResponse', {
                'action': action,
                'message': error
            });
        });
    });

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.get("/search", (req, res) => {

        var roomId = req.body.roomId;
        var message = req.body.message;

        const response = apiGateway.searchMessages(roomId, message);

        res.json(response);
    });

    app.get("/summarise", (req, res) => {
        var roomId = req.body.roomId;
        var messages = req.body.messages;

        const response = apiGateway.summarizeMessages(roomId, messages);

        res.json(response);
    })

    http.listen(config.PORT);
})