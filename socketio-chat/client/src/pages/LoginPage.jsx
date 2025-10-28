import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';
import { connectSocket } from '../socket/socket.js';

export default function LoginPage({ onLogin }) {
  const [inputUsername, setInputUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { socket } = useSocket();
  const { setUsername } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim() && !isConnecting) {
      setIsConnecting(true);
      connectSocket();
      
      socket.once('user:joined', () => {
        setUsername(inputUsername);
        setIsConnecting(false);
        onLogin();
      });
      
      socket.emit('user:join', { 
        username: inputUsername,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(inputUsername)}&background=random`
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>💬 Socket.IO Chat</h1>
          <p style={styles.subtitle}>Real-time messaging application</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              style={styles.input}
              autoFocus
              disabled={isConnecting}
              maxLength={20}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isConnecting ? 0.7 : 1,
              cursor: isConnecting ? 'not-allowed' : 'pointer'
            }}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Join Chat'}
          </button>
        </form>

        <div style={styles.features}>
          <h3 style={styles.featuresTitle}>Features</h3>
          <ul style={styles.featureList}>
            <li>🌍 Global & Private Chat</li>
            <li>🏠 Multiple Chat Rooms</li>
            <li>⚡ Real-time Messaging</li>
            <li>✍️ Typing Indicators</li>
            <li>👍 Message Reactions</li>
            <li>🔔 Push Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '440px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#333',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0.5rem 0 0',
    color: '#666',
    fontSize: '0.95rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '0.875rem',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  features: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  featuresTitle: {
    margin: '0 0 1rem',
    fontSize: '1rem',
    color: '#333',
    fontWeight: '600'
  },
  featureList: {
    margin: 0,
    padding: '0 0 0 1.5rem',
    listStyle: 'none'
  }
};