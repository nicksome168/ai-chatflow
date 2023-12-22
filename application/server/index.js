const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Room = require('./room');
const Message = require('./message');
const User = require('./user');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);


const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('login', (params) => {
        var userName = params['userName'];
        var password = params['password'];
        //socket.emit('login_response', params);
        User.userLoginAuth(socket, userName, password);
    });

    socket.on('signup', (params) => {
        var email = params['email'];
        var userName = params['userName'];
        var password = params['password'];
        var firstName = params['firstName'];
        var lastName = params['lastName'];
        //socket.emit('signup_response', params);
        User.createNewUser(socket, email, userName, password, firstName, lastName);
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

app.get("/summarise", (req, res) => {
    console.log("entered function");
    var room = req.query.room; // Use req.query to get parameters from the query string
    var messages = req.query.messages; // Use req.query to get parameters from the query string
    var userName = req.query.userName;
    const response = Message.summarise(room, messages, userName);

    res.json(response);
    console.log("exited function")
});

// app.post('/translate',async (req, res) => {
//     console.log(req.body)
//     const { text, fromLanguage, toLanguage } = req.body;

//     const params = {
//         Text: text,
//         SourceLanguageCode: fromLanguage,
//         TargetLanguageCode: toLanguage
//     };

//     try {
//         const translated = await translate.translateText(params).promise();
//         res.json({ translatedText: translated.TranslatedText });
//     } catch (error) {
//         console.error('Error during translation:', error);
//         res.status(500).send('Error during translation');
//     }
// });

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));