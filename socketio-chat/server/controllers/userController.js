const User = require('../models/User');
const { 
  addUser, 
  removeUser, 
  getUserBySocketId, 
  getUsersInRoom,
  getAllUsers,
  updateUserStatus
} = require('../utils/userManager');

class UserController {
  static handleUserJoin(io, socket, data) {
    const { username, avatar } = data;
    
    const user = new User({
      id: socket.id,
      username,
      socketId: socket.id,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      status: 'online'
    });

    addUser(user);
    
    // Join global room by default
    socket.join('global');
    user.rooms.push('global');
    
    // Notify user
    socket.emit('user:joined', { 
      userId: socket.id, 
      username,
      user: user.toJSON()
    });

    // Notify others
    socket.broadcast.emit('user:online', { 
      username, 
      userId: socket.id,
      avatar: user.avatar,
      status: 'online'
    });

    // Send current online users to the new user
    const onlineUsers = getAllUsers().map(u => u.toJSON());
    socket.emit('users:list', onlineUsers);
    
    console.log(`👤 ${username} joined (${socket.id})`);
  }

  static handleStatusUpdate(io, socket, data) {
    const { status } = data; // online, away, busy, offline
    const user = getUserBySocketId(socket.id);
    
    if (user) {
      updateUserStatus(socket.id, status);
      
      io.emit('user:status-change', {
        userId: socket.id,
        username: user.username,
        status
      });
    }
  }

  static handleDisconnect(io, socket) {
    const user = getUserBySocketId(socket.id);
    
    if (user) {
      // Notify rooms
      user.rooms.forEach(room => {
        io.to(room).emit('room:user-left', {
          username: user.username,
          userId: socket.id,
          room
        });
      });
      
      // Notify all users
      io.emit('user:offline', { 
        username: user.username, 
        userId: socket.id 
      });
      
      removeUser(socket.id);
      
      console.log(`👋 ${user.username} disconnected`);
    }
  }
}

module.exports = UserController;