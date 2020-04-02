const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Run when new client connects
io.on("connection", socket => {
  console.log("New connection...");

  socket.emit("message", "Welcome to ChatCord!");

  //Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the room.");

  //When user disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user hs left the room.");
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.....`));
