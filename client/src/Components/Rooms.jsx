import { useEffect, useContext } from "react";
import { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST, LEAVE_ROOM, USER_LEFT_ROOM, NEW_USER, NEW_MESSAGE } from "../socket";
import { socketContext } from "../SocketContext";
import { useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import ChatDisplay from "./ChatDisplay";
import UsersDisplay from "./UsersDisplay";
import MessageForm from "./MessageForm";
/**
 * 
 * Component that connects to the room the user chose in the login page
 * and renders the chat message for the room. The room name is a route parameter 
 * in the page called :roomName and the username chosen by the user is a search parameter 
 * called "username".
 * 
 * 
 */
const Rooms = () => {

    //socket connection to the chat message server
    let { socket } = useContext(socketContext);
    let [searchParams,] = useSearchParams();
    //name the user chose to be called in the room
    let username = searchParams.get("username");
    //name of the room the user wants to be connected to
    let { roomName } = useParams();
    //array of object containing the name and unique ids of every user in the room
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
         *@param {object} users contains an array of objects with each users unique socket id and chosen username
         *                       the unique id of the user is in the id attribute and the username is in the name attribute
         *
         */
        socket.on(APPROVED_JOIN_ROOM_REQUEST, ({ users }) => {
            //adds users in room to state
            setUsers((prevUsers) => {
                let newUsers = [...prevUsers];
                users.forEach((user) => {
                    newUsers.push({ id: user.id, name: user.name, fromSelf: false });
                })
                return newUsers;
            })
        })

        /***
         * Event emitted by the server when a user left the room. 
         * The user will be removed from the state.
         * 
         * @param {string} id unique socket id corresponding to the user that left
         */
        socket.on(USER_LEFT_ROOM, ({ id }) => {
            //to be implemented
            setUsers((prevUsers) => {
                let newUsers = prevUsers.filter((user) => user.id != id);
                return newUsers;
            })
        })

        /**
         * Event runs when a new user joins the room, user data will be
         * added to the state
         * 
         * @param {string} id unique string socket id of user that joined the room
         * @param {string} name handle name of the user that joined the room
         */
        socket.on(NEW_USER, ({ id, name }) => {
            setUsers((prevUsers) => {
                let newUsers = [...prevUsers, { id, name, fromSelf: socket.id == id }];
                return newUsers;
            })
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
         * Event occurs when a new message was recieved by a user
         * message will be added to the state
         * 
         * @param {string} id  unique string socket id of user that sent the message
         * @param {string} name chosen name of the user
         * @param {string} content actual message being sent
         */
        socket.on(NEW_MESSAGE, ({ id, name, content }) => {
            //if its users message it was already added, and so the function returns immediately
            if (id == socket.id)
                return;

            //adds new message to message array
            setMessages((oldMessages) => {
                let newMessages = [...oldMessages, { id, name, content, fromSelf: false, timestamp: new Date() }]
                return newMessages;
            })
        })

        return () => {
            socket.off(NEW_MESSAGE);
        }
    }, [socket])

    /**
     * 
     * submits the users message to the server
     * 
     * @param {string} message message the users wants to submit
     */
    const submitMessage = (message) => {
        //adds own message to state
        setMessages((oldMessages) => {
            let newMessages = [...oldMessages, { id: socket.id, name: username, fromSelf: true, timestamp: new Date(), content: message }];
            return newMessages;
        })

        //notifies server of new message
        socket.emit(NEW_MESSAGE, { id: socket.id, name: username, content: message, roomName });
    }

    return (
        <div>
            <MessageForm submitMessage={submitMessage} />
            <ChatDisplay messages={messages} userInfo={users} />
            <UsersDisplay usersInfo={users} />
        </div>
    )
}

export default Rooms;