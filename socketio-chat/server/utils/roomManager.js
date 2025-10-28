// In-memory room storage
const rooms = new Map();

// Create default rooms
rooms.set('global', {
  id: 'global',
  name: 'Global Chat',
  createdBy: 'system',
  createdAt: new Date(),
  isPrivate: false
});

function createRoom({ name, createdBy, isPrivate = false }) {
  const id = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const room = {
    id,
    name,
    createdBy,
    createdAt: new Date(),
    isPrivate
  };
  
  rooms.set(id, room);
  return room;
}

function getRoom(id) {
  return rooms.get(id);
}

function getRooms() {
  return Array.from(rooms.values()).filter(room => !room.isPrivate);
}

function deleteRoom(id) {
  rooms.delete(id);
}

module.exports = {
  createRoom,
  getRoom,
  getRooms,
  deleteRoom
};