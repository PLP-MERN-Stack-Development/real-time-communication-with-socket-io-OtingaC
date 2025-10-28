// In-memory user storage
const users = new Map();

function addUser(user) {
  users.set(user.socketId, user);
  return user;
}

function removeUser(socketId) {
  const user = users.get(socketId);
  users.delete(socketId);
  return user;
}

function getUserBySocketId(socketId) {
  return users.get(socketId);
}

function getUsersInRoom(room) {
  return Array.from(users.values()).filter(user => user.rooms.includes(room));
}

function getAllUsers() {
  return Array.from(users.values());
}

function updateUserStatus(socketId, status) {
  const user = users.get(socketId);
  if (user) {
    user.updateStatus(status);
  }
  return user;
}

function getUserByUsername(username) {
  return Array.from(users.values()).find(user => user.username === username);
}

module.exports = {
  users,
  addUser,
  removeUser,
  getUserBySocketId,
  getUsersInRoom,
  getAllUsers,
  updateUserStatus,
  getUserByUsername
};