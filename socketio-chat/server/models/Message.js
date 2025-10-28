class Message {
  constructor({ 
    id, 
    username, 
    userId,
    message, 
    room = null, 
    type = 'text',
    recipientId = null,
    timestamp = new Date(),
    reactions = {},
    readBy = []
  }) {
    this.id = id;
    this.username = username;
    this.userId = userId;
    this.message = message;
    this.room = room;
    this.type = type; // text, image, file, system
    this.recipientId = recipientId; // for private messages
    this.timestamp = timestamp;
    this.reactions = reactions; // { emoji: [usernames] }
    this.readBy = readBy; // array of user IDs who read the message
  }

  addReaction(username, emoji) {
    if (!this.reactions[emoji]) {
      this.reactions[emoji] = [];
    }
    if (!this.reactions[emoji].includes(username)) {
      this.reactions[emoji].push(username);
    }
  }

  removeReaction(username, emoji) {
    if (this.reactions[emoji]) {
      this.reactions[emoji] = this.reactions[emoji].filter(u => u !== username);
      if (this.reactions[emoji].length === 0) {
        delete this.reactions[emoji];
      }
    }
  }

  markAsRead(userId) {
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId);
    }
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      userId: this.userId,
      message: this.message,
      room: this.room,
      type: this.type,
      recipientId: this.recipientId,
      timestamp: this.timestamp,
      reactions: this.reactions,
      readBy: this.readBy,
      readCount: this.readBy.length
    };
  }
}

module.exports = Message;