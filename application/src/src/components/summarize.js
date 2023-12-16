import React, { useState } from 'react';

const SummarizeMenu = ({ onClose }) => {
    const userName = JSON.parse(localStorage.getItem('user')).userName;
    const [summaryOption, setSummaryOption] = useState('all');
    const room = JSON.parse(localStorage.getItem('room')).roomName

    console.log(room)
    

    async function handleViewSummary(room, userName) {
        try {
            // Construct the URL with query parameters
            const ENDPOINT = process.env.BACKEND_URL || 'http://localhost:4000';
            const url = ENDPOINT + "/summarise?room="+room+"&userName="+userName;
            
            console.log(url)

            // Define fetch options
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Uncomment the next line if you need to include credentials like cookies
                    // 'credentials': 'include',
                }
            };

            // Make the request to the backend
            const response = await fetch(url, fetchOptions);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();

            // Handle the response data
            console.log("Email sent");
            alert('Email sent!');
            return data;
        } catch (error) {
            // Handle any errors
            console.error('Error fetching summarised messages:', error);
            alert('Failed to send email');
        }
    }



    return (
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
            <h2>SUMMARISE</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        name="summaryOption"
                        value="all"
                        checked={summaryOption === 'all'}
                        onChange={(e) => setSummaryOption(e.target.value)}
                    />
                    All
                </label>
            </div>
            <button onClick={() => handleViewSummary(room, userName)}>Send to email</button>        
            </div>
    );
};

export default SummarizeMenu