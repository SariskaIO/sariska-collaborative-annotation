import React, {useEffect, useState} from 'react'
import {Socket} from 'phoenix';
import SocketContext from './SocketContext';
import {getToken} from "../../utils";
import { WEB_SOCKET_URL } from '../../config';

const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    let userName = JSON.parse(localStorage.getItem("sariska-chat-userName"));
    let userId = JSON.parse(localStorage.getItem("sariska-chat-userId"));
    useEffect(() => {
        const fetchData = async ()=> {
            const token = await getToken( userName, userId );
            localStorage.setItem("SARISKA_CHAT_TOKEN", JSON.stringify(token));
            const params = {token};
            const s = new Socket(WEB_SOCKET_URL, {params});
            s.onOpen( () => console.log("connection open!") )
            s.onError( (e) => console.log("there was an error with the connection!", e) )
            s.onClose( () => console.log("the connection dropped") )
            s.connect();
            setSocket(s);
        }
        fetchData();
        return () => {
            socket && socket.disconnect();
        }
    }, [userName]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider