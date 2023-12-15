import socket from "./client";
import authorization from "./authorization";
import { useEffect, useState } from "react";

const useChat = () => {
    const currUser = authorization.getCurrentUser();
    const [msgList, setMessageList] = useState([]);
    const [lastRoomId, setlastRoomId] = useState('');
    useEffect(() => {
        socket.on('receive_message', (response) => {
            const { res } = response;
            setMessageList([...msgList, res]);
        });
    });

    const searchMessage = async(roomId, messages) => {
        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'search',
            message: messages
        };

        try {
            socket.emit('message', values);
            let response = await new Promise((resolve) => {
                resolve(response.data);
            });
            setMessageList([...response.reverse(), ...msgList]);
            return response;
        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    const sendMessage = async(roomId, text, datetime) => {
        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'send',
            text: text,
            datetime: datetime
        };

        try {
            socket.emit('message', values);
            let response = await new Promise((resolve) => {
                socket.on('message_response', (response) => {
                    resolve(response);
                });
            });
            setMessageList([...msgList, values]);
            return response;
        } catch (error) {
            console.log('Error:', error.message);
            return null;
        }
    };

    const fetchAllMessages = async(roomId, messageId) => {
        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'fetchAllMessages',
            roomId: roomId,
            messageId: messageId
        };
        try {
            let local_msgList = msgList;
            if (lastRoomId !== roomId) {
                setMessageList([]);
                local_msgList = [];
            }
            socket.emit('message', values);
            let response = await new Promise((resolve) => {
                socket.on('message_response', (response) => {
                    resolve(response.data);
                });
            });
            setlastRoomId(roomId);
            setMessageList([...response.reverse(), ...local_msgList]);
            return response;
        } catch (error) {
            console.log('Error:', error.message);
            return null;
        }
    };

    return {
        msgList,
        sendMessage,
        fetchAllMessages
    };
};

export default useChat;