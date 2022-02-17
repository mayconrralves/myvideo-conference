import React, {useEffect, useState, useRef} from 'react';

export default function Video(){
    const videoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [startFlag, setStartFlag] = useState(true);
    /* useEffect(()=>{
        console.log('mediaStream', mediaStream)
        const startVideo = async ()=>{
            try{
              const stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: false,
              }); 
              setMediaStream(stream);
            }catch(error){
              console.log('error', error);
            }
          }
        if(!mediaStream){
            startVideo();
        } else {
            return function cleanup(){
                mediaStream.getTracks().forEach((track)=>{
                    track.stop();
                })
            }
        }
    },[mediaStream]);
 */
    const startVideo = async() =>{
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            }); 
            setMediaStream(stream);
            setStartFlag(!startFlag);
          }catch(error){
            console.log('error', error);
          }
        }
     
      
    const videoPlay = ()=>{
        videoRef.current.play();
    }
    const stopVideo = ()=>{
      videoRef.current.srcObject = null;
      mediaStream.getTracks().forEach((track)=>{
          track.stop();
        });
        setMediaStream(null);
        setStartFlag(!startFlag);
    }
    if(mediaStream && videoRef.current && !videoRef.current.srcObject){
        videoRef.current.srcObject = mediaStream;
    }

 return <div>
     <video ref={videoRef} onCanPlay={videoPlay}></video>
    {startFlag && <button onClick={startVideo}>Start</button>}
    {!startFlag && <button onClick={stopVideo}>Stop</button>}
     
 </div>
}