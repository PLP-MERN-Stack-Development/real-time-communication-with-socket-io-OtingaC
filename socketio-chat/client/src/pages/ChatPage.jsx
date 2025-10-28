import { useState } from 'react';
import { useChatSocket } from '../hooks/useChatSocket';
import ChatHeader from '../components/ChatHeader';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';

export default function ChatPage() {
  useChatSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div style={styles.mainContent}>
          <ChatHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <MessageList />
          <TypingIndicator />
          <MessageInput />
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
  chatWindow: {
    display: 'flex',
    width: '100%',
    maxWidth: '1400px',
    height: '90vh',
    maxHeight: '800px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  }
};