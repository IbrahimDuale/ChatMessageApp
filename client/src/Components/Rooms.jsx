import { useEffect, useContext } from "react";
import { JOIN_ROOM_REQUEST, APPROVED_JOIN_ROOM_REQUEST, LEAVE_ROOM, USER_LEFT_ROOM, NEW_USER, NEW_MESSAGE } from "../socket";
import { socketContext } from "../SocketContext";
import { useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import ChatMessage from "./ChatMessage";
/**
 * 
 * Component that connects to the room the user chose in the login page
 * and renders the chat message for the room. The room name is expected to be
 * a route parameter in the page called :roomName and the username chosen by 
 * the user is a search parameter called "username".
 * format of the path is {domain name}/:roomName?username={username_chosen}
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

        /**
         * 
         * generates message that notifies user that a user has left the chat room
         * 
         * @param {string} id unique id of user
         * @param {string} name name the user chose to be called
         * @returns 
         */
        const userHasLeftMessage = (id, name) => {

            const userLeftMessage = `${name} has left the chat room.`;
            return { id, name: "Annoucement", fromSelf: false, timestamp: new Date(), content: userLeftMessage }
        }

        /***
         * Event emitted by the server when a user left the room. 
         * The user will be removed from the state.
         * 
         * @param {string} id unique socket id corresponding to the user that left
         */
        socket.on(USER_LEFT_ROOM, ({ id, name }) => {
            //to be implemented
            setUsers((prevUsers) => {
                let newUsers = prevUsers.filter((user) => user.id !== id);
                return newUsers;
            })
            setMessages((prevMessages) => {
                let newMessages = [...prevMessages, userHasLeftMessage(id, name)]
                return newMessages;
            })
        })

        /**
         * 
         * Generates a message to notify the client that a new user has joined
         * the chat room.
         * 
         * @param {string} id unique id of the new user
         * @param {string} name username the new user wants displayed
         * @return {object} returns message object.
         * 
         */
        let newUserJoinedMessage = (id, name) => {
            let newUserMessage = `${name} has joined the chat room. Welcome!.`;
            return { id, name: "Annoucement", fromSelf: false, timestamp: new Date(), content: newUserMessage }
        }

        /**
         * Event runs when a new user joins the room, user data will be
         * added to the state
         * 
         * @param {string} id unique string socket id of user that joined the room
         * @param {string} name handle name of the user that joined the room
         */
        socket.on(NEW_USER, ({ id, name }) => {
            setUsers((prevUsers) => {
                let newUsers = [...prevUsers, { id, name, fromSelf: socket.id === id }];
                return newUsers;
            })

            //displays new user has joined message
            setMessages((prevMessages) => {
                let newMessages = [...prevMessages, newUserJoinedMessage(id, name)]
                return newMessages;
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
         * Leave room event is emitted when the room page dismounts
         * this occurs when the user presses the home button which sends
         * the user to the login page. The server will notify other users
         * in the room that this user has left.
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
            if (id === socket.id)
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
        <>
            <ChatMessage myId={socket.id} users={users} messages={messages} submitMessage={submitMessage} />
        </>
    )
}

export default Rooms;