import { io } from 'socket.io-client';


export const configSocket = ( )=>{

   const socket =  io('http://localhost:5000', {
        transports:['websocket', 'polling', 'flashsocket'],
    });

    return socket;
   
}