const app = require("express")();
const server = require("http").createServer(app);
const e = require("express");
const { Server } = require("socket.io");
const io = new Server(server,
    {
        cors: {
            origin: "*"
        }
    });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

//event emitted when user attemps to join a room
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//event emitted when server approved the join room request
const APPROVED_JOIN_ROOM_REQUEST = "APPROVED_JOIN_ROOM_REQUEST";
//event emitted when a client leaves a room
const LEAVE_ROOM = "LEAVE_ROOM";
//event emitted when a client leaves a room to the other users still in the room
const USER_LEFT_ROOM = "USER_LEFT_ROOM";
//event emitted to users in a room when a new user has joined the room
const NEW_USER = "NEW_USER";
//event emitted when user sends a message and event is recieved when a user sends a message
const NEW_MESSAGE = "NEW_MESSAGE";

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);

    /**
     * Event occurs when a user wishes to join a room
     * the user will be added to the room and notified
     * the user will also be sent an approval event along with
     * data on users currently in the room. Also Users in the room will
     * be notified that a new user has joined along with the unique id
     * of the user and the name they chose.
     * 
     * @param {string} username name, the user joining the room wants to be called
     * @param {string} roomName name of the room the user wants to connect to
     * 
     */
    socket.on(JOIN_ROOM_REQUEST, ({ username, roomName }) => {
        socket.username = username;
        let socketIdsSet = io.of("/").adapter.rooms.get(roomName);
        let users = [];
        if (socketIdsSet) {
            for (const id of socketIdsSet) {
                const socket = io.sockets.sockets.get(id);
                users.push({ id: socket.id, name: socket.username })
            }
        }
        socket.join(roomName);
        io.to(roomName).emit(NEW_USER, { id: socket.id, name: socket.username });
        socket.emit(APPROVED_JOIN_ROOM_REQUEST, { users });
    })


    /**
     * Event occurs when a user leaves the room. Every 
     * other user in the room will be notified of the user
     * that left the room by id
     * 
     * @param {string} id unique socket id of user that left the room
     * @param {string} roomName name of the room the user is leaving
     */
    socket.on(LEAVE_ROOM, ({ id, roomName }) => {
        socket.leave(roomName);
    })

    /**
     * Event occurs when a user sends a chat message to the server
     * they would like broadcasted to all other users.
     * 
     * @param {string} id unique socket id of the user sending the message
     * @param {string} content message content the user wants to send
     * @param {string} name name the user wants to be called in the room
     * @param {string} roomName name of the room the user is in
     */
    socket.on(NEW_MESSAGE, ({ id, content, name, roomName }) => {
        io.to(roomName).emit(NEW_MESSAGE, { id, content, name });
    })

})

/**
 *
 * event occurs when a client leaves a room, this can happen
 * when the client sends a LEAVE_ROOM event to the server
 * or automatically when the clients connection to the server ends.
 * All other users in the room will be notified of the clients departure by socket id.
 * 
 */
io.of("/").adapter.on("leave-room", (room, id) => {
    const socket = io.sockets.sockets.get(id);
    io.to(room).emit(USER_LEFT_ROOM, { id, name: socket.username });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
