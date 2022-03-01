import React,{useState, useEffect, useRef} from 'react';
import { configSocket } from '../../config/socket';
import iceCandidates from '../../services/iceCandidate';

const mediaConstrains = {
    video: true,
    audio: false,
};

export default function Communication(){
    const videoRef = useRef(null);
    const videoRemoteRef = useRef(null);
    const socket = useRef();
    const [ room, setRoom] = useState(null);
    const [ joinRoom, setJoinRoom] = useState(false);
    useEffect(()=>{
        let rtcPeerConnection = null;
        let localStream = null;
        let roomOwner = false;

        socket.current = configSocket();

            socket.current.on('created_room',async (room)=>{
                roomOwner=true;
                console.log('created_room on');
                localStream = await setLocalStream(mediaConstrains);
            });
            socket.current.on('joined_room',async (room)=>{
                console.log('joined_room on');
                localStream = await setLocalStream(mediaConstrains);
                socket.current.emit('start_call', room);
                
            });
            socket.current.on('start_call', async (room)=>{
                console.log('start_call on');
                if(roomOwner){
                    rtcPeerConnection = new RTCPeerConnection(iceCandidates);
                    addLocalTracks(rtcPeerConnection, localStream);
                    rtcPeerConnection.ontrack = addRemoteStream;
                    rtcPeerConnection.onicecandidate = (event) => sendIceCandidate(event, room);
                    await createOffer(rtcPeerConnection, room);
                }
            });
            socket.current.on('webrtc_offer', async (webrtcEvent)=>{
                console.log('webrtc_offer on');
                if(!roomOwner){
                    rtcPeerConnection = new RTCPeerConnection(iceCandidates);
                    addLocalTracks(rtcPeerConnection, localStream);
                    rtcPeerConnection.ontrack = addRemoteStream;
                    rtcPeerConnection.onicecandidate = (event) => sendIceCandidate(event, webrtcEvent.room);
                    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(webrtcEvent.sdp));
                    await createAnswer(rtcPeerConnection, webrtcEvent.room);
                }
            });
            socket.current.on('webrtc_answer', event=>{
                console.log('answer event on');
                rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
            });
            socket.current.on('ice_candidate', (event)=>{
                console.log('ice candidate on')
                const candidate = new RTCIceCandidate({
                    sdpMLineIndex: event.label,
                    candidate: event.candidate,
                });
                rtcPeerConnection.addIceCandidate(candidate);
            });
    }, []);
    const setLocalStream = async (mediaConstrains) =>{
        let stream;
        try{
            stream = await navigator.mediaDevices.getUserMedia(mediaConstrains);
        }catch(error){
            console.error('Could not get user media', error);
        }
        videoRef.current.srcObject = stream;
        return stream;
        
    }
    const sendIceCandidate = (event, room)=>{
        console.log('ice candidate');
        if(event.candidate){
            socket.current.emit('ice_candidate',{
                room,
                label: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
            })
        }
    }
    const addRemoteStream = (event)=>{
        videoRemoteRef.current.srcObject = event.streams[0];
    }
    const addLocalTracks = (rtcPeerConnection, localStream )=>{
        localStream.getTracks().forEach((track)=>{
            rtcPeerConnection.addTrack(track, localStream);
        })
    }
    const createOffer = async (rtcPeerConnection, room)=>{
        let sessionDescription;
        try{
            sessionDescription = await rtcPeerConnection.createOffer();
            rtcPeerConnection.setLocalDescription(sessionDescription);
        }catch(error){
            console.log(error);
        }
       
        socket.current.emit('webrtc_offer',{
            type: 'webrtc_offer',
            sdp: sessionDescription,
            room
        });
    }
    const createAnswer = async (rtcPeerConnection, room)=>{
        let sessionDescription;
        try{
            sessionDescription = await rtcPeerConnection.createAnswer();
            rtcPeerConnection.setLocalDescription(sessionDescription);
        }catch(error){
            console.error(error);
        }
        socket.current.emit('webrtc_answer',{
            type: 'webrtc_answer',
            sdp: sessionDescription,
            room,
        });
    }
    const changeInput = event=>{
        setRoom(event.target.value);
    }
    const joinOrCreatedRoom =  ()=>{
        setJoinRoom(true);
        socket.current.emit('join_room', room);
    }
    const videoPlay = ()=>{
        videoRef.current.play();
    }
    const videoRemotePlay = ()=>{
        videoRemoteRef.current.play();
    }
    return !joinRoom ? (
        <>
            <label>Room's Name: </label>
            <input onChange={changeInput}/>
            <button onClick={joinOrCreatedRoom}>Join</button>
        </>
    )
    : 
    ( 
        <>
            <video ref={videoRef} onCanPlay={videoPlay}></video>
            <video ref={videoRemoteRef} onCanPlay={videoRemotePlay} ></video>
        </>
    )
}