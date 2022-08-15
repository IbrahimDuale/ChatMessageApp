import { io } from "socket.io-client";

const url = "http://localhost:5000/"
const socket = io(url);

socket.on("connect", () => {
    console.log("connected to server");
})

socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on("")
export default socket;