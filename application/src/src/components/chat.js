import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/chat.css'
import TranslateMenu from './translate';
import SummarizeMenu from './summarize';

const ChatWindow = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const userName = JSON.parse(localStorage.getItem('user')).userName;
    // const [ partner, setPartner ] = useState('');
    const { partner } = useParams();
    const ENDPOINT = 'a9e2107d65c954c52893e93040871de5-dfca6f5438fb8cb5.elb.us-east-1.amazonaws.com:4000';
    const [socket, setSocket] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false); // State to control TranslateMenu visibility
    const [showSummarize, setShowSummarize] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();


    console.log(userName)

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
        if (showTranslate) {
            setShowTranslate(false); // Close the TranslateMenu if it's open
        }
        if (showSummarize) {
            setShowSummarize(false); // Close the TranslateMenu if it's open
        }
    };

    const handleTranslateClick = () => {
        setShowTranslate(true);
        setShowMenu(false); // Optionally close the main menu
    };

    const closeTranslate = () => {
        setShowTranslate(false);
    };

    const handleSummarizeClick = () => {
        setShowSummarize(true);
        setShowMenu(false); // Optionally close the main menu
    };

    const closeSummarize = () => {
        setShowSummarize(false);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
            setShowTranslate(false);
            setShowSummarize(false); // Close the TranslateMenu if clicking outside
        }
    };

    useEffect(() => {
        // Bind the event listener for clicks outside of the menu
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // if (!userName) {
        //     // Redirect to login or handle unauthenticated user
        //     console.log('Redirecting to login...');
        //     return;
        // }

        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        const room = userName < partner ? `${userName}-${partner}` : `${partner}-${userName}`;
        newSocket.emit('joinRoom', { room });

        newSocket.on('message', (msg) => {
            setMessages((msgs) => [...msgs, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [ENDPOINT, userName, partner]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message && socket) {
            const room = userName < partner ? `${userName}-${partner}` : `${partner}-${userName}`;
            socket.emit('sendMessage', { room, sender: userName, message, recipient: partner });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">

            <div style={{ borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Chat with {partner}</h2>
                <div>
                    <button style={{ marginRight: '10px' }}>🔍</button>

                </div>
            </div>
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === userName ? "own-message" : "received-message"}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="input-form">
                <button type="button" onClick={handleMenuToggle} style={{ background: 'none', border: 'none', padding: '5px', width: '50px', cursor: 'pointer', marginRight: '5px' }}>➕</button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
            {showMenu && (
                <div ref={menuRef} style={{ position: 'absolute', bottom: '50px', left: '0', backgroundColor: 'white', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: '8px', padding: '10px' }}>
                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                        <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleTranslateClick} >Translate</li>
                        <li style={{ padding: '8px', cursor: 'pointer' }}>Send Image</li>
                        <li style={{ padding: '8px', cursor: 'pointer' }}>Send Notion</li>
                        <li style={{ padding: '8px', cursor: 'pointer' }}>Call Bot</li>
                        <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleSummarizeClick}>Summarise</li>
                    </ul>
                </div>
            )}

            {/* Conditionally render TranslateMenu */}
            {showTranslate && (
                <TranslateMenu onClose={closeTranslate} />
            )}

            {showSummarize && (
                <SummarizeMenu onClose={closeSummarize} />
            )}

        </div>
    );

};



export default ChatWindow;
