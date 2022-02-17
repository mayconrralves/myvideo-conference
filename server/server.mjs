import express, { response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket=>{

});

httpServer.listen(8000,()=>{
    console.log('listen on port 8000')
});