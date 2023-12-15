// Home.js
import React from 'react';
import '../css/home.css';

const Home = ({ handleLogout }) => {
 return (
    <div className="home">
      <h1>Home</h1>
      <h2>Recently Contacted</h2>
      <h2>Contact New User</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
 );
};

export default Home;