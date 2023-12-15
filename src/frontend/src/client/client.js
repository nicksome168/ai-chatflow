const { io } = require("socket.io-client");

const CONNECTION_PORT = 'http://localhost:8080';

let socket = io(CONNECTION_PORT, { transports: ['websocket'] });

export default socket;