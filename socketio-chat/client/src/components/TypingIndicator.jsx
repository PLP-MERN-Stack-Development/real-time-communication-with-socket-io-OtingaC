import { useChat } from '../context/ChatContext';

export default function TypingIndicator() {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.dots}>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
        </div>
        <span style={styles.text}>{getTypingText()}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #f0f0f0'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  dots: {
    display: 'flex',
    gap: '0.25rem'
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    animation: 'bounce 1.4s infinite ease-in-out both'
  },
  text: {
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic'
  }
};