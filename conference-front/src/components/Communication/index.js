import React,{useState, useEffect} from 'react';
import { configSocket } from '../../config/socket';

export default function Communication(){
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
        if (!socket) setSocket(configSocket);
        if(socket){
            socket.on('created_room',(room)=>{
                console.log('created_room');
            });
            socket.on('joined_room',room=>{
                console.log('joined_room');
            });
        }
    },[socket]);

      

    const teste = (event)=>{
        socket.emit('join_room', 'teste1');
        console.log('teste')
    }

    return <button onClick={teste}>joined</button>;
}