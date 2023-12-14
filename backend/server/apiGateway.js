const axios = require('axios');
const apiEndpoint = API_GATEWAY_ENDPOINT;

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