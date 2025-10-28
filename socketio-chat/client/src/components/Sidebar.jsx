import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';

export default function Sidebar({ isOpen, onToggle }) {
  const { 
    onlineUsers, 
    rooms, 
    currentRoom, 
    setCurrentRoom, 
    userId,
    unreadCounts,
    clearUnreadCount,
    activeChat,
    setActiveChat
  } = useChat();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('rooms');
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleRoomChange = (roomId) => {
    if (currentRoom !== roomId) {
      socket.emit('room:leave', { room: currentRoom });
      socket.emit('room:join', { room: roomId });
      setCurrentRoom(roomId);
      setActiveChat({ type: 'room', id: roomId });
      clearUnreadCount(roomId);
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      socket.emit('room:create', { roomName: newRoomName });
      setNewRoomName('');
      setShowCreateRoom(false);
    }
  };

  const handlePrivateChat = (user) => {
    setActiveChat({ type: 'private', id: user.id, username: user.username });
    clearUnreadCount(user.id);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.sidebar}>
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'rooms' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('rooms')}
        >
          🏠 Rooms
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'users' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({onlineUsers.length})
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'rooms' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Chat Rooms</h3>
              <button
                style={styles.createButton}
                onClick={() => setShowCreateRoom(!showCreateRoom)}
              >
                +
              </button>
            </div>

            {showCreateRoom && (
              <form onSubmit={handleCreateRoom} style={styles.createForm}>
                <input
                  type="text"
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  style={styles.createInput}
                  autoFocus
                />
                <button type="submit" style={styles.createSubmit}>Create</button>
              </form>
            )}

            <div style={styles.list}>
              {rooms.length === 0 ? (
                <p style={styles.emptyText}>No rooms available</p>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    style={{
                      ...styles.listItem,
                      ...(currentRoom === room.id && activeChat.type === 'room' ? styles.activeItem : {})
                    }}
                    onClick={() => handleRoomChange(room.id)}
                  >
                    <span style={styles.roomIcon}>🏠</span>
                    <span style={styles.itemText}>{room.name}</span>
                    {unreadCounts[room.id] > 0 && (
                      <span style={styles.badge}>{unreadCounts[room.id]}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Online Users</h3>
            <div style={styles.list}>
              {onlineUsers.filter(u => u.id !== userId).map((user) => (
                <button
                  key={user.id}
                  style={{
                    ...styles.listItem,
                    ...(activeChat.type === 'private' && activeChat.id === user.id ? styles.activeItem : {})
                  }}
                  onClick={() => handlePrivateChat(user)}
                >
                  <div style={styles.userInfo}>
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      style={styles.avatar}
                    />
                    <span style={styles.itemText}>{user.username}</span>
                  </div>
                  <div style={styles.userStatus}>
                    {unreadCounts[user.id] > 0 && (
                      <span style={styles.badge}>{unreadCounts[user.id]}</span>
                    )}
                    <span style={{
                      ...styles.statusDot,
                      backgroundColor: user.status === 'online' ? '#4caf50' : '#9e9e9e'
                    }} />
                  </div>
                </button>
              ))}
              {onlineUsers.filter(u => u.id !== userId).length === 0 && (
                <p style={styles.emptyText}>No other users online</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0'
  },
  tab: {
    flex: 1,
    padding: '1rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s'
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '1rem'
  },
  section: {
    marginBottom: '1rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  createButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: '#667eea',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createForm: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  createInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    outline: 'none'
  },
  createSubmit: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s',
    width: '100%'
  },
  activeItem: {
    background: '#667eea',
    color: 'white'
  },
  roomIcon: {
    fontSize: '1.25rem',
    marginRight: '0.75rem'
  },
  itemText: {
    flex: 1,
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1
  },
  userStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  badge: {
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '10px',
    padding: '0.125rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.875rem',
    padding: '1rem'
  }
};