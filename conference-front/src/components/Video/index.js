import React, {useRef, useEffect } from 'react';

export default function Video( { srcObject, ...rest }){
    const video = useRef(null);
    useEffect(()=>{
        if(video.current){
            video.current.srcObject = srcObject;
        }
    },[srcObject]);

    return <video ref={video} {...rest } ></video>
}