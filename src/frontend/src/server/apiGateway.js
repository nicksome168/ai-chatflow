const axios = require('axios');
require('dotenv').config()
const apiEndpoint = process.env.API_GATEWAY_ENDPOINT;

// const apiEndpoint = "https://www.google.com";

async function searchMessages(roomId, message) {
    const params = {
        roomId: roomId,
        message: message,
    };

    try {
        const response = await axios.get(apiEndpoint, {
            params: params,
        });

        return response
    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function summarizeMessages(roomId, messages) {
    const params = {
        roomId: roomId,
        messages: messages
    };

    try {
        const response = await axios.get(apiEndpoint, {
            params: params,
        });
        return response;
    } catch (error) {
        console.log('Error:', error.message);
    }
}

exports.searchMessages = searchMessages();
exports.summarizeMessages = summarizeMessages();