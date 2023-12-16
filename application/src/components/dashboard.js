import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    return (
        
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
        <h2>Recently Contacted</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
          {/* Placeholder for recently contacted users */}
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}></div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}></div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}></div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}></div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'lightgrey' }}></div>
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
