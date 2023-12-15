import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const ChatWindow = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { partner } = useParams();
    const username = localStorage.getItem('username');
    const ENDPOINT = 'http://localhost:4000';
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!username) {
            // Redirect to login or handle unauthenticated user
            console.log('Redirecting to login...');
            return;
        }

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        const room = username < partner ? `${username}-${partner}` : `${partner}-${username}`;
        newSocket.emit('joinRoom', { room });

        newSocket.on('message', (msg) => {
            setMessages((msgs) => [...msgs, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [ENDPOINT, username, partner]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message && socket) {
            const room = username < partner ? `${username}-${partner}` : `${partner}-${username}`;
            socket.emit('sendMessage', { room, sender: username, message, recipient: partner });
            setMessage('');
        }
    };

    return (
        <div style={styles.chatContainer}>
            <h2>Chat with {partner}</h2>
            <div style={styles.messagesArea}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.sender === username ? styles.ownMessage : styles.receivedMessage}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} style={styles.inputForm}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.messageInput}
                />
                <button type="submit" style={styles.sendButton}>Send</button>
            </form>
        </div>
    );
};

const styles = {
    chatContainer: {
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '600px',
    },
    messagesArea: {
        height: '300px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
    },
    ownMessage: {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px',
        borderRadius: '20px',
        margin: '5px 0',
        maxWidth: '70%',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: 'grey',
        color: 'white',
        padding: '10px',
        borderRadius: '20px',
        margin: '5px 0',
        maxWidth: '70%',
        alignSelf: 'flex-start',
    },
    inputForm: {
        display: 'flex',
        marginTop: '20px',
    },
    messageInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: 'blue',
        color: 'white',
        cursor: 'pointer',
    }
};

export default ChatWindow;
