import React, { useEffect, useState } from "react";
import Communication from "./components/Communication";
import Video from "./components/Video";

function App() {
  
  const [mediaStream, setMediaStream] = useState(null);
  
  return (
    <div className="App">
      <Communication />
    </div>
  );
}

export default App;
