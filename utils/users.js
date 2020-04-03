const users = [];

//Join users to chat
function joinUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);

  return user;
}

//Get current user
function getCurrentUser(id) {
  const user = users.find(u => u.id === id);
  return user;
}

//User leaves Chat
function leaveUser(id) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

//Get room users
function getRoomUsers(room) {
  return users.filter(u => u.room === room);
}

module.exports = { joinUser, getCurrentUser, leaveUser, getRoomUsers };
