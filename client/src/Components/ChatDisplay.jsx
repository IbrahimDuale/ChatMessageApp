import { toTimestamp } from "../utils"
import Message from "./Message";
import "./ChatDisplay.css";
import { useEffect, useRef } from "react";

const ChatDisplay = ({ messages, myId }) => {
    //ref of ul all messages are in, used to scroll to bottom of list on every new message
    let ulRef = useRef();

    //whenever a new message is added to the message state ul containing
    //all messages will scroll to the bottom
    useEffect(() => {
        ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }, [messages, ulRef])


    //to be changed later    
    let messageDisplay = messages.map((message, i) => {
        return <div className="ChatDisplay-message-list-item" key={i}><Message fromSelf={myId === message.id} name={message.name} date={toTimestamp(message.timestamp)} content={message.content} /></div>
    })



    return <div ref={ulRef} className="ChatDisplay-message-list">{messageDisplay}</div>
}

export default ChatDisplay;

