import React, { useEffect, useState } from "react";
import Video from "./components/Video";
import {config} from './config/socket';
function App() {
  const [socket, setSocket] = useState(null);
  const teste = () =>{
    console.log('ok')
    socket.emit('test', 'ola back')
    
  }
  useEffect(()=>{
      setSocket(config());
    }, []);
    if(socket){
    }
    console.log(1)
  return (
    <div className="App">
     <Video />
    </div>
  );
}

export default App;
