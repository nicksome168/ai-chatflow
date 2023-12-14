import React, { useState } from 'react';

const Dashboard = () => {
  const [newUsername, setNewUsername] = useState('');

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleStartContact = (e) => {
    e.preventDefault();
    // Logic to handle starting contact with new user
    console.log('Start contact with:', newUsername);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>HOME</h1>
      </div>
      
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

      <div>
        <h2>Contact New User</h2>
        <form onSubmit={handleStartContact} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
            placeholder="Username"
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Start</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
