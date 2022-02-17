import { io } from 'socket.io-client';

let socket = null;

export const configSocket = ( )=>{
    socket = io('http://localhost:8000', {
        transports:['websocket', 'polling', 'flashsocket'],
    });
    return socket;
}
export const disconnect = ()=>{
    socket.disconnect();
}
