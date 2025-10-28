import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const { socket } = useSocket();
  const { username, currentRoom, activeChat } = useChat();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      const data = activeChat.type === 'private' 
        ? { recipientId: activeChat.id }
        : { room: currentRoom };
      socket.emit('typing:start', data);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const data = activeChat.type === 'private' 
        ? { recipientId: activeChat.id }
        : { room: currentRoom };
      socket.emit('typing:stop', data);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      if (activeChat.type === 'private') {
        socket.emit('message:private', {
          recipientId: activeChat.id,
          message: message.trim()
        }, (response) => {
          if (response.success) {
            console.log('Private message sent');
          }
        });
      } else {
        socket.emit('message:send', {
          room: currentRoom,
          message: message.trim(),
          username
        }, (response) => {
          if (response.success) {
            console.log('Message sent');
          }
        });
      }

      setMessage('');
      
      if (isTyping) {
        setIsTyping(false);
        const data = activeChat.type === 'private' 
          ? { recipientId: activeChat.id }
          : { room: currentRoom };
        socket.emit('typing:stop', data);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <div style={styles.inputWrapper}>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder={
            activeChat.type === 'private' 
              ? `Message ${activeChat.username}...`
              : 'Type a message...'
          }
          style={styles.input}
          rows={1}
        />
        <button 
          type="submit" 
          style={{
            ...styles.button,
            opacity: message.trim() ? 1 : 0.5,
            cursor: message.trim() ? 'pointer' : 'not-allowed'
          }}
          disabled={!message.trim()}
        >
          <span style={styles.sendIcon}>➤</span>
        </button>
      </div>
    </form>
  );
}

const styles = {
  container: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fff'
  },
  inputWrapper: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    padding: '0.875rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid #e0e0e0',
    borderRadius: '24px',
    outline: 'none',
    resize: 'none',
    maxHeight: '120px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  button: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
    flexShrink: 0
  },
  sendIcon: {
    display: 'block'
  }
};