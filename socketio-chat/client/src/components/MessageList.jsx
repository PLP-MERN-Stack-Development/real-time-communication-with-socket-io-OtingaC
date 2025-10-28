import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';

export default function MessageList() {
  const { messages, privateMessages, username, userId, activeChat } = useChat();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, privateMessages]);

  const handleReaction = (messageId, emoji) => {
    socket.emit('message:react', {
      messageId,
      reaction: emoji,
      room: activeChat.type === 'room' ? activeChat.id : null
    });
  };

  const getMessagesToDisplay = () => {
    if (activeChat.type === 'private') {
      return privateMessages[activeChat.id] || [];
    }
    return messages.filter(m => m.room === activeChat.id);
  };

  const displayMessages = getMessagesToDisplay();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={styles.container}>
      {displayMessages.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💬</div>
          <p style={styles.emptyText}>No messages yet</p>
          <p style={styles.emptySubtext}>Start the conversation!</p>
        </div>
      ) : (
        displayMessages.map((msg) => {
          const isOwnMessage = msg.userId === userId;
          return (
            <div
              key={msg.id}
              style={{
                ...styles.messageWrapper,
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
              }}
              onMouseEnter={() => setHoveredMessage(msg.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div
                style={{
                  ...styles.message,
                  backgroundColor: isOwnMessage ? '#667eea' : '#f1f3f4',
                  color: isOwnMessage ? 'white' : '#333',
                  borderRadius: isOwnMessage 
                    ? '18px 18px 4px 18px' 
                    : '18px 18px 18px 4px'
                }}
              >
                {!isOwnMessage && (
                  <div style={styles.messageHeader}>
                    <strong style={{color: isOwnMessage ? 'white' : '#667eea'}}>
                      {msg.username}
                    </strong>
                  </div>
                )}
                
                <div style={styles.messageText}>{msg.message}</div>
                
                <div style={styles.messageFooter}>
                  <span style={{
                    ...styles.timestamp,
                    color: isOwnMessage ? 'rgba(255,255,255,0.8)' : '#999'
                  }}>
                    {formatTime(msg.timestamp)}
                  </span>
                  
                  {msg.readBy && msg.readBy.length > 1 && isOwnMessage && (
                    <span style={styles.readReceipt}>
                      ✓✓ {msg.readBy.length - 1}
                    </span>
                  )}
                </div>

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div style={styles.reactions}>
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <span key={emoji} style={styles.reactionBadge}>
                        {emoji} {users.length}
                      </span>
                    ))}
                  </div>
                )}

                {hoveredMessage === msg.id && (
                  <div style={styles.reactionPicker}>
                    {['👍', '❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
                      <button
                        key={emoji}
                        style={styles.reactionButton}
                        onClick={() => handleReaction(msg.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0 0 0.5rem'
  },
  emptySubtext: {
    fontSize: '0.95rem',
    margin: 0
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '0.5rem'
  },
  message: {
    maxWidth: '70%',
    padding: '0.875rem 1.125rem',
    position: 'relative',
    wordWrap: 'break-word'
  },
  messageHeader: {
    marginBottom: '0.375rem',
    fontSize: '0.85rem'
  },
  messageText: {
    fontSize: '0.95rem',
    lineHeight: '1.4',
    marginBottom: '0.375rem'
  },
  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem'
  },
  timestamp: {
    fontSize: '0.75rem'
  },
  readReceipt: {
    fontSize: '0.75rem',
    opacity: 0.8
  },
  reactions: {
    display: 'flex',
    gap: '0.25rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap'
  },
  reactionBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: '0.125rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem'
  },
  reactionPicker: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    display: 'flex',
    gap: '0.25rem',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    marginBottom: '0.5rem'
  },
  reactionButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'transform 0.2s'
  }
};