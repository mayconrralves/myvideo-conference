import React,{useState, useEffect} from 'react';
import { configSocket } from '../../config/socket';

export default function Communication(){
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
        setSocket(configSocket);
    },[]);
    

    return null;
}