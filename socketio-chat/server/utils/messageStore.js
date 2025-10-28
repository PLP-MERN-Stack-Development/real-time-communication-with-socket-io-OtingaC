// In-memory message storage
const messages = new Map();
const privateMessages = new Map();

function addMessage(message) {
  if (message.type === 'private') {
    const key = [message.userId, message.recipientId].sort().join('-');
    if (!privateMessages.has(key)) {
      privateMessages.set(key, []);
    }
    privateMessages.get(key).push(message);
  } else {
    const room = message.room || 'global';
    if (!messages.has(room)) {
      messages.set(room, []);
    }
    messages.get(room).push(message);
    
    // Keep only last 1000 messages per room
    if (messages.get(room).length > 1000) {
      messages.get(room).shift();
    }
  }
  return message;
}

function getMessagesByRoom(room, limit = 50, before = null) {
  const roomMessages = messages.get(room) || [];
  
  let filtered = roomMessages;
  if (before) {
    const beforeIndex = roomMessages.findIndex(m => m.id === before);
    if (beforeIndex > 0) {
      filtered = roomMessages.slice(0, beforeIndex);
    }
  }
  
  return filtered.slice(-limit);
}

function getPrivateMessages(userId1, userId2, limit = 50) {
  const key = [userId1, userId2].sort().join('-');
  const msgs = privateMessages.get(key) || [];
  return msgs.slice(-limit);
}

function addReaction(messageId, username, reaction) {
  // Search in all rooms
  for (const [room, msgs] of messages.entries()) {
    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      msg.addReaction(username, reaction);
      return msg;
    }
  }
  
  // Search in private messages
  for (const [key, msgs] of privateMessages.entries()) {
    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      msg.addReaction(username, reaction);
      return msg;
    }
  }
  
  return null;
}

function markAsRead(messageId, userId) {
  // Search in all rooms
  for (const [room, msgs] of messages.entries()) {
    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      msg.markAsRead(userId);
      return msg;
    }
  }
  
  // Search in private messages
  for (const [key, msgs] of privateMessages.entries()) {
    const msg = msgs.find(m => m.id === messageId);
    if (msg) {
      msg.markAsRead(userId);
      return msg;
    }
  }
  
  return null;
}

function searchMessages(room, query) {
  const roomMessages = messages.get(room) || [];
  return roomMessages.filter(msg => 
    msg.message.toLowerCase().includes(query.toLowerCase())
  );
}

module.exports = {
  addMessage,
  getMessagesByRoom,
  getPrivateMessages,
  addReaction,
  markAsRead,
  searchMessages
};