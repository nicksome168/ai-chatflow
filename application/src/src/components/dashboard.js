import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('a05e4bdedb5854296ab1d72ec601226b-e24303a11e28619a.elb.us-east-1.amazonaws.com:3000');

const Dashboard = () => {
    const [partner, setPartner] = useState('');
    const userName = JSON.parse(localStorage.getItem('user')).userName;
    const navigate = useNavigate();

    const handlePartnerSelection = (e) => {
        e.preventDefault();
        if (partner) {
            navigate(`/chat/${partner}`);
        }
    };

    const [recentContacts, setRecentContacts] = useState([]);

    useEffect(() => {
        socket.emit('getRecentContacts', { userName });
        socket.on('recentContacts', (contacts) => {
            setRecentContacts(contacts);
        });

        return () => socket.off('recentContacts');
    }, [userName]);

    return (

        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>Recently Contacted</h2>

                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}>

                    <ul>
                        {recentContacts.map((contact, index) => (
                            <li key={index}>{contact}</li>
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
