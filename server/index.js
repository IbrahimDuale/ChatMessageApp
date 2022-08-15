const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,
    {
        cors: {
            origin: "*"
        }
    });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

//emitted when user attemps to join a room
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//emitted when server approved the join room request
const APPROVED_JOIN_ROOM_REQUEST = "APPROVED_JOIN_ROOM_REQUEST";

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);
    socket.on(JOIN_ROOM_REQUEST, ({ username, roomName }) => {
        const rooms = socket.rooms;
        //leaves all previous rooms incase user was in a previous room
        for (let room of rooms) {
            socket.leave(room);
        }
        socket.join(socket.id);
        socket.join(roomName);
        socket.emit(APPROVED_JOIN_ROOM_REQUEST, { username, roomName });
    })
})

const PORT = 5000;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
