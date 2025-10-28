import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';

export default function ChatHeader({ onMenuClick }) {
  const { username, currentRoom, activeChat, notifications } = useChat();
  const { connected } = useSocket();

  const getChatTitle = () => {
    if (activeChat.type === 'private') {
      return `💬 ${activeChat.username}`;
    }
    const room = currentRoom === 'global' ? 'Global Chat' : currentRoom;
    return `🏠 ${room}`;
  };

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <button style={styles.menuButton} onClick={onMenuClick}>
          ☰
        </button>
        <div style={styles.info}>
          <h2 style={styles.title}>{getChatTitle()}</h2>
          <span style={styles.username}>Logged in as: {username}</span>
        </div>
      </div>
      
      <div style={styles.right}>
        {notifications.length > 0 && (
          <div style={styles.notificationBadge}>
            <span style={styles.notificationIcon}>🔔</span>
            <span style={styles.notificationCount}>{notifications.length}</span>
          </div>
        )}
        
        <div style={styles.status}>
          <span style={{
            ...styles.statusDot,
            backgroundColor: connected ? '#4caf50' : '#f44336'
          }} />
          <span style={styles.statusText}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#667eea'
  },
  info: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#333',
    fontWeight: '600'
  },
  username: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  notificationBadge: {
    position: 'relative',
    cursor: 'pointer'
  },
  notificationIcon: {
    fontSize: '1.5rem'
  },
  notificationCount: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '10px',
    padding: '0.125rem 0.4rem',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '20px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  statusText: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500'
  }
};