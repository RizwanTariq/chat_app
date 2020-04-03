const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  joinUser,
  getCurrentUser,
  leaveUser,
  getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = "DevChat";
//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Run when new client connects
io.on("connection", socket => {
  //Joi Room
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(bot, "Welcome to DevChat!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          bot,
          `<strong>${user.username}</strong> has joined the room.`
        )
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //Listen for chat messages
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //When user disconnects
  socket.on("disconnect", () => {
    const user = leaveUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(
          bot,
          `<strong>${user.username}</strong> has left the room.`
        )
      );
    }

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}.....`));
