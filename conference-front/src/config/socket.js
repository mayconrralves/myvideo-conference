import { io } from 'socket.io-client';

let socket = null;

export const config = ( )=>{
    socket = io('http://localhost:8000', {
        transports:['websocket', 'polling', 'flashsocket'],
    });
    socket.on('test', event=>{
        console.log('test', event)
    });
    return socket;
}
export const disconnect = ()=>{
    socket.disconnect();
}
