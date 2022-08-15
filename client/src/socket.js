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

//emitted when user attemps to join a room
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//emitted when server approved the join room request
const APPROVED_JOIN_ROOM_REQUEST = "APPROVED_JOIN_ROOM_REQUEST";
export default socket;
export { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST };