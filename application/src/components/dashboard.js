import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [partner, setPartner] = useState('');
    const navigate = useNavigate();

    const handlePartnerSelection = (e) => {
        e.preventDefault();
        if (partner) {
            navigate(`/chat/${partner}`);
        }
    };

    return (
        <div>
            <h2>Select Chat Partner</h2>
            <form onSubmit={handlePartnerSelection}>
                <input
                    type="text"
                    placeholder="Enter partner's username"
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                />
                <button type="submit">Start Chat</button>
            </form>
        </div>
    );
};

export default Dashboard;
