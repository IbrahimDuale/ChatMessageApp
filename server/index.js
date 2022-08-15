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

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);
})

const PORT = 5000;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
