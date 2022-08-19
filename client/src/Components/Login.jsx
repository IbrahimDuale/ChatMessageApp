import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    //holds the name the user wants to be called
    let [username, setUsername] = useState("");
    //name of room the user wants to be connected to
    let [roomName, setRoomName] = useState("");
    //error state for the room name they chose
    let [roomNameError, setRoomNameError] = useState({});
    //error state for the username they chose
    let [usernameError, setUsernameError] = useState({});
    let navigate = useNavigate();

    /***
     * 
     * Checks if the user chose a username and a room name then sends then 
     * connects them with the room they chose as their username
     * 
     * @param {string} username name the user chose
     * @param {string} roomName room name user chose
     * 
     */
    const joinRoom = (username, roomName) => {
        if (!username) {
            setUsernameError({ error: true, helperText: "Username cannot be blank." })
        }
        if (!roomName) {
            setRoomNameError({ error: true, helperText: "Room Name cannot be blank." });
        }

        if (roomName && username) {
            setUsernameError({});
            setRoomNameError({});
            navigate(`/${roomName}?username=${username}`);
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