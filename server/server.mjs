import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = 5000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket=>{
    socket.on('join_room', room=>{
        const numberUsers = socket.adapter.rooms.get(room) ? socket.adapter.rooms.get(room).size : 0;
        if(numberUsers < 1){
            socket.join(room);
            console.log('created_room', room)
            socket.emit('created_room',{
                room,
            });
        }else if(numberUsers < 3){
            console.log('joined_room', room);
            socket.join(room);
            socket.emit('joined_room', room);
        }else{
            socket.emit('full_room', room);
        }
        socket.on('start_call',room=>{
            console.log('start_call', room);
            socket.to(room).emit('start_call', room);
        });
        socket.on('webrtc_offer', event=>{
            console.log('webrtc_offer', event.room);
            socket.to(event.room).emit('webrtc_offer',{ 
                sdp: event.sdp,
                room: event.room,
            });
        });
        socket.on('webrtc_answer', event=>{
            console.log('answer', event.room);
            socket.to(event.room).emit('webrtc_answer', event.sdp);
        });
        socket.on('ice_candidate', event=>{
            console.log('ice_candidate', event.room);
            socket.to(event.room).emit('ice_candidate', event);
        });
   });
   
});

httpServer.listen(PORT,()=>{
    console.log(`listen on port ${PORT}`);
});