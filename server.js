const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = "ChatCord Bot";
//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Run when new client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    socket.emit("message", formatMessage(bot, "Welcome to ChatCord!"));

    //Broadcast when a user connects
    socket.broadcast.emit(
      "message",
      formatMessage(bot, `${username} has joined the room.`)
    );

    //Listen for chat messages
    socket.on("chatMessage", msg => {
      io.emit("message", formatMessage(username, msg));
    });

    //When user disconnects
    socket.on("disconnect", () => {
      io.emit("message", formatMessage(bot, `${username} has left the room.`));
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.....`));
