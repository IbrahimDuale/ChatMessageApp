import { useEffect, useContext } from "react";
import { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST, LEAVE_ROOM, USER_LEFT_ROOM, NEW_USER, NEW_MESSAGE } from "../socket";
import { socketContext } from "../SocketContext";
import { useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";

const Rooms = () => {

    //socket connection to the chat message server
    let { socket } = useContext(socketContext);
    let [searchParams,] = useSearchParams();
    //name the user chose to be called in the room
    let username = searchParams.get("username");
    //name of the room the user wants to be connected to
    let { roomName } = useParams();
    //array of object containing each users information in the room
    let [users, setUsers] = useState([]);
    //array of messages sent since user entered the room in order
    let [messages, setMessages] = useState([]);

    //requests server to join a room
    useEffect(() => {
        socket.emit(JOIN_ROOM_REQUEST, { username, roomName });
    }, [username, roomName, socket])

    useEffect(() => {
        /**
         * Event occurs when the server approves a join room request
         * the server will send the data of all users which will be added
         * to the state.
         * 
         *@param users contains an array of objects with each users unique socket id and chosen username
         */
        socket.on(APPROVED_JOIN_ROOM_REQUEST, ({ users }) => {
            //adds users in room to state
            console.log(users);
        })

        /***
         * Event emitted by the server when a user left the room. 
         * The user will be removed from the state.
         * 
         * @param id unique socket id corresponding to the user that left
         */
        socket.on(USER_LEFT_ROOM, ({ id }) => {
            //to be implemented
        })

        /**
         * Event runs when a new user joins the room, user data will be
         * added to the state
         * 
         * @param id unique string socket id of user that joined the room
         * @param name handle name of the user that joined the room
         */
        socket.on(NEW_USER, ({ id, name }) => {
            //to be implemented
        })

        return () => {
            socket.off(APPROVED_JOIN_ROOM_REQUEST);
            socket.off(USER_LEFT_ROOM);
            socket.off(NEW_USER);
        }
    }, [socket])

    useEffect(() => {
        /**
         * Leave room event is emitted when the rooms page dismounts
         * this occurs when the user leaves the page by navigating away or
         * closing the browser notifying the other users in the room that
         * this user is no longer connected.
         * 
         */
        return () => {
            socket.emit(LEAVE_ROOM, { id: socket.id, roomName });
        }
    }, [roomName, socket])

    useEffect(() => {

        /**
         * Event occurs when a new message was sent by a user
         * message will be added to the state
         * 
         * @param id  unique string socket id of user that sent the message
         * @param message actual message being sent
         */
        socket.on(NEW_MESSAGE, ({ id, message }) => {
            //to be implemented
        })
    }, [socket])

    return (
        <div>This is the rooms page</div>
    )
}

export default Rooms;