import socket from "./client";
import Authorization from './authorization';
import { useEffect, useState } from 'react';

const roomListData = [];

const useRoom = () => {
    const [roomList, setRoomList] = useState(roomListData);
    const currUser = Authorization.getCurrentUser();

    const reloadList = (data) => {
        let idx = roomList.findIndex((r) => r.roomId === data.roomId);

        if(idx === -1){
            setRoomList([...roomList, data]);
        }else {
            setRoomList([...roomList.slice(0,idx), data, ...roomList.slice(idx+1)]);
        }
    };

    useEffect(() => {
        socket.on('receive_channel', (response) => {
            const { action, data } = response;
            if(data)
                reloadList(data);
            
            socket.off('receive_channel')
        });
    });

    const getAllRooms = async(roomId) => {
        if(!socket)
            return 'The connection to Socket failed. Try Again!!';

        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'fetchAllRooms',
            roomId: roomId,
        };

        try {
            socket.emit('channel', values);
            let{action,data} = await new Promise((resolve) => {
                socket.on('channel_response', (response) => {
                    resolve(response);
                });
            });

            if(action == 'fetchAllRooms'){
                setRoomList(data);
            }
        }
        catch(error){
            console.log('Error:', error.message);
        }
    };

    const createRoom = async(roomName, param) => {
        var values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'create',
            roomId: roomId,
        };
        try {
            socket.emit('channel', values);
            socket.on('channel_response', (response) => {
                const { action, message,roomId } = response;

                if((action === 'create') & (message === 'Success!')){
                    const roomInfo = {
                        roomId: roomId,
                        roomName: roomName,
                        noOfUsers: 1,
                        users: [
                            {
                                userName: currUser.userName
                            }
                        ]
                    };
                    setRoomList([...roomList, roomInfo]);
                    return param(null, roomId);
                }
            });
        } catch(error){
            console.log('Error:', error.message);
            return param(error, null);
        }
    };

    const exitRoom = async (roomId) => {
        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'exit',
            roomId: roomId,
        };

        try {
            socket.emit('channel', values);
            socket.on('channel_response', (response) => {
                const { action, message } = response;
                if ((action === 'exit') & (message === 'Success!')) {
                    socket.off('channel_response');
                }
            });
        } catch (error) {
            console.log('Error:', error.message);
        }
    };

    const joinRoom = (roomId, param) => {
        let values = {
            userName: currUser.userName,
            token: currUser.token,
            action: 'join',
            roomId: roomId,
        };

        try {
            socket.emit('channel', data);
            socket.on('channel_response', (response) => {
                const { action, noOfUsers, message } = response;
                if ((action === 'join') & (message === 'Success!')) {
                    return param(null, noOfUsers)
                }
            });
        } catch (error) {
            console.log('Error:', error.message);
            return param(error, null);
        }
    };

    return {
        roomList,
        getAllRooms,
        createRoom,
        joinRoom,
        exitRoom,
    };
}