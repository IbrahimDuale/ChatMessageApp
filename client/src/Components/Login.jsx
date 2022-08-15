import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST } from "../socket";
const LoginStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    AlignItems: "center",
    paddingTop: "15px",
    maxWidth: "500px",
    margin: "auto",
    marginTop: "10%",
    rowGap: "25px",
}

const Login = () => {
    let [username, setUsername] = useState("");
    let [roomName, setRoomName] = useState("");
    let [roomNameError, setRoomNameError] = useState({});
    let [usernameError, setUsernameError] = useState({});
    let navigate = useNavigate();
    useEffect(() => {
        socket.on(APPROVED_JOIN_ROOM_REQUEST, ({ username, roomName }) => {
            navigate(`/${roomName}?username=${username}`);
        })
        return () => {
            socket.off(APPROVED_JOIN_ROOM_REQUEST)
        }
    }, [navigate])

    const joinRoom = (username, roomName) => {
        console.log(`username : ${username} room name : ${roomName}`)
        if (!username) {
            setUsernameError({ error: true, helperText: "Username cannot be blank." })
        }
        if (!roomName) {
            setRoomNameError({ error: true, helperText: "Room Name cannot be blank." });
        }

        if (roomName && username) {
            setUsernameError({});
            setRoomNameError({});
            //communicate to server and navigate to appropriate room
            socket.emit(JOIN_ROOM_REQUEST, { username, roomName });
        }
    }

    return (
        <Box sx={LoginStyle}>
            <Typography align="center" variant="h2" component="h1" gutterBottom>
                Join A Room
            </Typography>
            <TextField {...usernameError} onChange={(e) => { setUsername(e.target.value); setUsernameError({}) }} id="username" label="Username" variant="outlined" />
            <TextField {...roomNameError} id="roomName" onChange={(e) => { setRoomName(e.target.value); setRoomNameError({}); }} label="Room Name" variant="outlined" />
            <Button onClick={(e) => joinRoom(username, roomName)} variant="contained" size="large">Enter</Button>
        </Box>
    )
}

export default Login;