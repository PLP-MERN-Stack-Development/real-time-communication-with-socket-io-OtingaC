const Message = require('../models/Message');
const { 
  addMessage, 
  getMessagesByRoom, 
  addReaction, 
  markAsRead,
  getPrivateMessages 
} = require('../utils/messageStore');
const { getUserBySocketId } = require('../utils/userManager');

class MessageController {
  // Send message to room
  static handleSendMessage(io, socket, data, callback) {
    const { room, message, type = 'text' } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) {
      callback && callback({ success: false, error: 'User not found' });
      return;
    }

    const newMessage = new Message({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: user.username,
      userId: socket.id,
      message,
      room: room || 'global',
      type,
      timestamp: new Date(),
      reactions: {},
      readBy: [socket.id]
    });

    addMessage(newMessage);

    // Emit to room
    if (room) {
      io.to(room).emit('message:receive', newMessage.toJSON());
    } else {
      io.emit('message:receive', newMessage.toJSON());
    }

    // Send notification to other users
    const notification = {
      id: `notif_${Date.now()}`,
      type: 'message',
      from: user.username,
      room: room || 'global',
      message: message.substring(0, 50),
      timestamp: new Date()
    };

    socket.to(room || 'global').emit('notification:new', notification);

    callback && callback({ success: true, messageId: newMessage.id });
  }

  // Private message
  static handlePrivateMessage(io, socket, data, callback) {
    const { recipientId, message } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) {
      callback && callback({ success: false, error: 'User not found' });
      return;
    }

    const privateMessage = new Message({
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: user.username,
      userId: socket.id,
      message,
      type: 'private',
      recipientId,
      timestamp: new Date(),
      reactions: {},
      readBy: [socket.id]
    });

    addMessage(privateMessage);

    // Send to recipient
    io.to(recipientId).emit('message:private-receive', privateMessage.toJSON());
    
    // Send back to sender
    socket.emit('message:private-receive', privateMessage.toJSON());

    // Notification
    const notification = {
      id: `notif_${Date.now()}`,
      type: 'private_message',
      from: user.username,
      fromId: socket.id,
      message: message.substring(0, 50),
      timestamp: new Date()
    };

    io.to(recipientId).emit('notification:new', notification);

    callback && callback({ success: true, messageId: privateMessage.id });
  }

  // Message reactions
  static handleMessageReaction(io, socket, data) {
    const { messageId, reaction, room } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    addReaction(messageId, user.username, reaction);

    const updateData = { messageId, username: user.username, reaction };

    if (room) {
      io.to(room).emit('message:reaction-update', updateData);
    } else {
      io.emit('message:reaction-update', updateData);
    }
  }

  // Mark messages as read
  static handleMarkAsRead(io, socket, data) {
    const { messageIds, room } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    messageIds.forEach(msgId => {
      markAsRead(msgId, socket.id);
    });

    if (room) {
      socket.to(room).emit('message:read-receipt', {
        userId: socket.id,
        username: user.username,
        messageIds
      });
    }
  }

  // Load older messages (pagination)
  static handleLoadMessages(io, socket, data, callback) {
    const { room, limit = 50, before } = data;
    
    const messages = getMessagesByRoom(room || 'global', limit, before);
    
    callback && callback({ 
      success: true, 
      messages: messages.map(m => m.toJSON()),
      hasMore: messages.length === limit
    });
  }

  // Typing indicators
  static handleTypingStart(io, socket, data) {
    const { room, recipientId } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    if (recipientId) {
      // Private typing
      io.to(recipientId).emit('typing:update', { 
        username: user.username,
        userId: socket.id,
        isTyping: true,
        isPrivate: true
      });
    } else if (room) {
      socket.to(room).emit('typing:update', { 
        username: user.username, 
        userId: socket.id,
        isTyping: true 
      });
    } else {
      socket.broadcast.emit('typing:update', { 
        username: user.username,
        userId: socket.id,
        isTyping: true 
      });
    }
  }

  static handleTypingStop(io, socket, data) {
    const { room, recipientId } = data;
    const user = getUserBySocketId(socket.id);
    
    if (!user) return;

    if (recipientId) {
      io.to(recipientId).emit('typing:update', { 
        username: user.username,
        userId: socket.id,
        isTyping: false,
        isPrivate: true
      });
    } else if (room) {
      socket.to(room).emit('typing:update', { 
        username: user.username,
        userId: socket.id,
        isTyping: false 
      });
    } else {
      socket.broadcast.emit('typing:update', { 
        username: user.username,
        userId: socket.id,
        isTyping: false 
      });
    }
  }
}

module.exports = MessageController;