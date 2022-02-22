import express, { response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket=>{
    socket.on('join_room', room=>{
        const numberUsers = socket.adapter.rooms.get(room) ? socket.adapter.rooms.get(room).size : 0;
        if(numberUsers < 1){
            socket.join(room);
            socket.emit('created_room',{
                room,
            });
        }else if(numberUsers < 3){
            socket.join(room);
            socket.to(room).emit('joined_room', room);
        }else{
            socket.emit('full_room', room);
        }
        socket.on('start_call',room=>{
            console.log('start_call');
            socket.to(room).emit('start_call');
        });
        socket.on('webrtc_offer', event=>{
            console.log('offer', event);
            socket.to(event.room).emit('webrtc_offer', event.sdp);
        });
        socket.on('webrtc_answer', event=>{
            console.log('answer', event);
            socket.to(event.room).emit('webrtc_answer', event.sdp);
        });
        socket.on('ice_candidate', event=>{
            console.log('ice_candidate');
            socket.to(event.room).emit('ice_candidate', event);
        });
   });
   
});

httpServer.listen(8000,()=>{
    console.log('listen on port 8000')
});