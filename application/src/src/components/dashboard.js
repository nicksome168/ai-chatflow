import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const ENDPOINT = process.env.BACKEND_URL || 'http://localhost:4000';
const socket = io(ENDPOINT);

const Dashboard = () => {
    const [partner, setPartner] = useState('');
    const userName = JSON.parse(localStorage.getItem('user')).userName;
    const [recentContacts, setRecentContacts] = useState([]);
    const navigate = useNavigate();

    const handlePartnerSelection = (e) => {
        e.preventDefault();
        if (partner) {
            navigate(`/chat/${partner}`);
        }
    };

    const handleRecentlyContacts = () => {
        console.log("username: ",userName);
        socket.emit('getRecentContacts', { userName });
        // console.log(param);
    };

    useEffect(() => {

        handleRecentlyContacts();
        // Listen for the response from the server
        const handleRecentContacts = (contacts) => {
            setRecentContacts(contacts);
        };

        socket.on('recentContacts', handleRecentContacts);
        return() => socket.off('recentContacts');
    }, [userName]);

    return (

        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>Recently Contacted</h2>

                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}>

                    <ul>
                        {recentContacts.map((contact, index) => (
                            <li key={index}>{contact.room}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <h2>Contact New User</h2>
            <form onSubmit={handlePartnerSelection}>
                <input
                    type="text"
                    placeholder="Enter a username"
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                />
                <button type="submit">Start Chat</button>
            </form>
        </div>
    );
};

export default Dashboard;
