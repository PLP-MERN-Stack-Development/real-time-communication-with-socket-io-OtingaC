class User {
  constructor({ id, username, socketId, avatar, room = null, status = 'online' }) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.avatar = avatar;
    this.rooms = room ? [room] : [];
    this.status = status; // online, away, busy, offline
    this.connectedAt = new Date();
    this.lastActive = new Date();
  }

  updateStatus(status) {
    this.status = status;
    this.lastActive = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      rooms: this.rooms,
      status: this.status,
      connectedAt: this.connectedAt,
      lastActive: this.lastActive
    };
  }
}

module.exports = User;