// CORS
const cors = require('cors')
// const corsOptions = require('./config/corsOptions')
const corsOptions = { origin: true, optionsSuccessStatus: 200 }
// express and socket io
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors : corsOptions})

// if we deploy with render, first line is important
const port = process.env.PORT || 3000;

let counterValue = 0

app.use(express.static("public"))
// uncomment to allow all cors
//app.use(cors())
app.use(cors(corsOptions))

// use these lines to get all clients in a room
// const clients = io.sockets.adapter.rooms.get('Room Name');
// const numClients = clients ? clients.size : 0;

// room map : room name => {information about room, e.g. ative socket}
let roomMap = new Map();

// test connection with api
app.use('/about', (req, res) => {
    res.json({name: "Kniffel", author: "Lennart"})
})

/*
// TODO update
function forgetClientSocket(id) {
    // special case: delete active socket
    if (activeSocket.id === id && clientSockets.length > 1) {
        changePermission()
    } else if (activeSocket.id === id && clientSockets.length === 1) {
        activeSocket = null
    }
    // filter out the socket that shall be deleted
    clientSockets = clientSockets.filter(socket => socket.id !== id)
}

// TODO update
function changePermission() {
    // socket.IO DOES guarantee message ordering, so we do not need to pay attention if there is only one socket
    io.to(activeSocket.id).emit("remove-permission")
    // get index of active socket
    let i = clientSockets.findIndex(socket => socket.id === activeSocket.id)
    activeSocket = clientSockets[(i + 1) % clientSockets.length]
    io.to(activeSocket.id).emit("set-permission")
}
*/

io.on("connection", (socket) => {
    console.log(`server recognized new connection with ${socket.id}`)
    
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});