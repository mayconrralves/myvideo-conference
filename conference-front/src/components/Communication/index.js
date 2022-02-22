import React,{useState, useEffect} from 'react';
import { configSocket } from '../../config/socket';
import Video from '../Video';

export default function Communication(){
    const [socket, setSocket] = useState(null);
    const [roomOwner, setRoomOwner] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [ joinRoom, setJoinRoom] = useState(false);
    useEffect(()=>{
        if (!socket) setSocket(configSocket);
        if(socket){
            socket.on('created_room',room=>{
                console.log('created_room');
            });
            socket.on('joined_room',room=>{
                console.log('joined_room');
            });
        }
    },[socket]);

      

    const joinOrCreatedRoom = (event)=>{
        socket.emit('join_room');
    }

    return joinRoom ? (
        <div/>
    )
    : 
    ( <Video />)
}