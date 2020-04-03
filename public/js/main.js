const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();

//Join Chatroom
socket.emit("joinRoom", { username, room });

//Message sent from server
socket.on("message", message => {
  outputMessage(message);

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submit message
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit("chatMessage", msg);

  //Clear Input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
