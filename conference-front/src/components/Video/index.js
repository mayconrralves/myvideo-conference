import React, {useEffect, useState, useRef} from 'react';

export default function Video({ otherStream }){
    const videoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null)
    
    useEffect(()=>{
        const startVideo = async ()=>{
            try{
              const stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: false,
              }); 
              setMediaStream(stream);
            }catch(error){
              console.error('error', error);
            }
          }
        if(!mediaStream){
            if(!otherStream){
                startVideo();
            }
        } else {
            return function cleanup(){
                mediaStream.getTracks().forEach((track)=>{
                    track.stop();
                })
            }
        }
    },[mediaStream, setMediaStream, otherStream]);
    
      
    const videoPlay = ()=>{
        videoRef.current.play();
    }
   
    if(mediaStream && videoRef.current && !videoRef.current.srcObject){
        videoRef.current.srcObject = otherStream ? otherStream : mediaStream;
    }

 return <div>
     <video ref={videoRef} onCanPlay={videoPlay}></video>
 </div>
}