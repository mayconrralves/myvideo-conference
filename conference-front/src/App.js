import React, { useEffect, useState } from "react";
import Video from "./components/Video";
import {config} from './config/socket';
function App() {
  const [socket, setSocket] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const teste = () =>{
    console.log('ok')
    socket.emit('test', 'ola back')
    
  }
  useEffect(()=>{
      setSocket(config());
    }, []);
    if(socket){
    }
  return (
    <div className="App">
     <Video mediaStream={mediaStream} setMediaStream={setMediaStream}/>
    </div>
  );
}

export default App;
