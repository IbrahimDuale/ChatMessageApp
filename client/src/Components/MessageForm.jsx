import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

//global styling of the message form component
const MessageFormStyle = {
    display: "flex",
}

const MessageForm = ({ submitMessage }) => {
    //message the user wants to submit
    let [message, setMessage] = useState("");
    //flag thats raised if the user tries to submit an empty message
    let [emptyMessageError, setEmptyMessageError] = useState(false);
    //holds ref of the textfield the user enters there message for focusing purposes
    let textFieldRef = useRef();

    //focus textfield on page load and after message has been submited
    useEffect(() => {
        textFieldRef.current.focus();
    }, [message])

    /**
     * 
     * checks that the user is trying to submit a non empty message
     * to the room then calls the submitMessage method in its properties
     * to submit the message to the server
     * 
     * @param {string} message message to send to server
     * 
     */
    let validateMessage = (message) => {
        if (!message) {
            setEmptyMessageError(true);
        } else {
            setEmptyMessageError(false);
            submitMessage(message);
            setMessage("");
        }
    }

    let error = {};
    //raised if user tries to submit an empty message
    if (emptyMessageError)
        error = { error: true, helperText: "Message cannot be blank" };
    return (
        <div>
            <Box sx={MessageFormStyle}>
                <TextField inputRef={textFieldRef} {...error} id="submitMessage" value={message} label="Message" variant="outlined" onChange={(e) => setMessage(e.target.value)} />
                <Button variant="contained" onClick={() => validateMessage(message)}>Submit</Button>
            </Box>
        </div>
    )
}

export default MessageForm;