const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Room = require('./room');
const Message = require('./message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Adjust as per your CORS policy
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

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

    socket.on('joinRoom', ({ room }) => {
        Room.joinRoom(socket, room);
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
    });

    socket.on('sendMessage', ({ room, sender, message, recipient }) => {
        Message.sendMessage(room, sender, message, recipient);
        io.to(room).emit('message', { sender, message });
        console.log(`Message from ${sender} in room ${room}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
