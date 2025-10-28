import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [currentRoom, setCurrentRoom] = useState('global');
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeChat, setActiveChat] = useState({ type: 'room', id: 'global' });

  const addMessage = useCallback((message) => {
    if (message.type === 'private') {
      setPrivateMessages(prev => {
        const key = message.recipientId === userId ? message.userId : message.recipientId;
        return {
          ...prev,
          [key]: [...(prev[key] || []), message]
        };
      });
    } else {
      setMessages(prev => [...prev, message]);
    }
  }, [userId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addTypingUser = useCallback((username) => {
    setTypingUsers(prev => {
      if (!prev.includes(username)) {
        return [...prev, username];
      }
      return prev;
    });
  }, []);

  const removeTypingUser = useCallback((username) => {
    setTypingUsers(prev => prev.filter(u => u !== username));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Update unread count
    if (notification.type === 'message' && notification.room !== currentRoom) {
      setUnreadCounts(prev => ({
        ...prev,
        [notification.room]: (prev[notification.room] || 0) + 1
      }));
    } else if (notification.type === 'private_message') {
      setUnreadCounts(prev => ({
        ...prev,
        [notification.fromId]: (prev[notification.fromId] || 0) + 1
      }));
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.from, {
        body: notification.message,
        icon: '/chat-icon.png'
      });
    }

    // Play sound
    playNotificationSound();
  }, [currentRoom]);

  const clearUnreadCount = useCallback((id) => {
    setUnreadCounts(prev => ({
      ...prev,
      [id]: 0
    }));
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi77OivUSAMUKfu8LxlHQU2kdbywHwyBSp+zPLZijUIGWiz6+OSUhwMUKjl8r1oJAU3mNjwxYEqBSeAz/LGfzEGI3fH7+SVVhYLU6rk8bllHgU9ntfwtHImBTCBz/Db');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  return (
    <ChatContext.Provider value={{
      username,
      setUsername,
      userId,
      setUserId,
      currentRoom,
      setCurrentRoom,
      messages,
      privateMessages,
      addMessage,
      clearMessages,
      typingUsers,
      addTypingUser,
      removeTypingUser,
      onlineUsers,
      setOnlineUsers,
      rooms,
      setRooms,
      notifications,
      addNotification,
      unreadCounts,
      clearUnreadCount,
      activeChat,
      setActiveChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};