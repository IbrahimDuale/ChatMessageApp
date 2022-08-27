import { io } from "socket.io-client";

const url = "http://localhost:5000/"
const socket = io(url);

socket.on("connect", () => {
    console.log("connected to server");
})

//for debugging purposes
socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on("")

//emitted when user attemps to join a room
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//emitted when server approved the join room request
const APPROVED_JOIN_ROOM_REQUEST = "APPROVED_JOIN_ROOM_REQUEST";
//emitted when a client leaves a room
const LEAVE_ROOM = "LEAVE_ROOM";
//emitted when a client leaves a room to the other users still in the room
const USER_LEFT_ROOM = "USER_LEFT_ROOM";
//event emitted to users in a room when a new user has joined the room
const NEW_USER = "NEW_USER";
//event emitted when user sends a message and event is recieved when a user sends a message
const NEW_MESSAGE = "NEW_MESSAGE";
export default socket;
export { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST, LEAVE_ROOM, USER_LEFT_ROOM, NEW_USER, NEW_MESSAGE };