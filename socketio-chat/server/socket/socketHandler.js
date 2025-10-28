const { Server } = require('socket.io');
const MessageController = require('../controllers/messageController');
const UserController = require('../controllers/userController');
const RoomController = require('../controllers/roomController');
const NotificationController = require('../controllers/notificationController');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Main namespace
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // User authentication & join
    socket.on('user:join', (data) => {
      UserController.handleUserJoin(io, socket, data);
    });

    // Room management
    socket.on('room:create', (data) => {
      RoomController.handleCreateRoom(io, socket, data);
    });

    socket.on('room:join', (data) => {
      RoomController.handleJoinRoom(io, socket, data);
    });

    socket.on('room:leave', (data) => {
      RoomController.handleLeaveRoom(io, socket, data);
    });

    socket.on('room:list', () => {
      RoomController.handleListRooms(io, socket);
    });

    // Messaging
    socket.on('message:send', (data, callback) => {
      MessageController.handleSendMessage(io, socket, data, callback);
    });

    socket.on('message:private', (data, callback) => {
      MessageController.handlePrivateMessage(io, socket, data, callback);
    });

    socket.on('message:react', (data) => {
      MessageController.handleMessageReaction(io, socket, data);
    });

    socket.on('message:read', (data) => {
      MessageController.handleMarkAsRead(io, socket, data);
    });

    socket.on('messages:load', (data, callback) => {
      MessageController.handleLoadMessages(io, socket, data, callback);
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      MessageController.handleTypingStart(io, socket, data);
    });

    socket.on('typing:stop', (data) => {
      MessageController.handleTypingStop(io, socket, data);
    });

    // Notifications
    socket.on('notification:read', (data) => {
      NotificationController.handleMarkAsRead(io, socket, data);
    });

    // Status updates
    socket.on('user:status', (data) => {
      UserController.handleStatusUpdate(io, socket, data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      UserController.handleDisconnect(io, socket);
      console.log('❌ User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = { initializeSocket };