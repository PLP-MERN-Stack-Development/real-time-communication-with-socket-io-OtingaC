const { getUserBySocketId, getUsersInRoom } = require('../utils/userManager');
const { createRoom, getRooms, getRoom } = require('../utils/roomManager');

class RoomController {
  static handleCreateRoom(io, socket, data) {
    const { roomName, isPrivate = false } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    const room = createRoom({
      name: roomName,
      createdBy: user.username,
      isPrivate
    });

    socket.emit('room:created', room);
    
    if (!isPrivate) {
      io.emit('room:new', room);
    }

    console.log(`🏠 Room created: ${roomName} by ${user.username}`);
  }

  static handleJoinRoom(io, socket, data) {
    const { room } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    socket.join(room);
    
    if (!user.rooms.includes(room)) {
      user.rooms.push(room);
    }
    
    const roomUsers = getUsersInRoom(room);
    
    // Notify room
    io.to(room).emit('room:user-joined', {
      username: user.username,
      userId: socket.id,
      room,
      users: roomUsers.map(u => ({ 
        id: u.id, 
        username: u.username,
        avatar: u.avatar,
        status: u.status
      }))
    });

    // Send room info to user
    socket.emit('room:joined', {
      room,
      users: roomUsers.map(u => u.toJSON())
    });
    
    console.log(`🚪 ${user.username} joined room: ${room}`);
  }

  static handleLeaveRoom(io, socket, data) {
    const { room } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    socket.leave(room);
    user.rooms = user.rooms.filter(r => r !== room);
    
    io.to(room).emit('room:user-left', {
      username: user.username,
      userId: socket.id,
      room
    });
    
    socket.emit('room:left', { room });
    
    console.log(`👋 ${user.username} left room: ${room}`);
  }

  static handleListRooms(io, socket) {
    const rooms = getRooms();
    socket.emit('room:list', rooms);
  }
}

module.exports = RoomController;