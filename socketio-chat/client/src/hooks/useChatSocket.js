import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';

export const useChatSocket = () => {
  const { socket } = useSocket();
  const { 
    addMessage, 
    addTypingUser, 
    removeTypingUser, 
    setOnlineUsers, 
    setUserId,
    addNotification,
    setRooms
  } = useChat();

  useEffect(() => {
    if (!socket) return;

    // User joined confirmation
    socket.on('user:joined', ({ userId }) => {
      setUserId(userId);
    });

    // Online users list
    socket.on('users:list', (users) => {
      setOnlineUsers(users);
    });

    // User status changes
    socket.on('user:online', (userData) => {
      setOnlineUsers(prev => [...prev, userData]);
    });

    socket.on('user:offline', ({ userId }) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
    });

    socket.on('user:status-change', ({ userId, status }) => {
      setOnlineUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ));
    });

    // Message received
    socket.on('message:receive', (message) => {
      addMessage(message);
    });

    // Private message received
    socket.on('message:private-receive', (message) => {
      addMessage(message);
    });

    // Typing updates
    socket.on('typing:update', ({ username, isTyping }) => {
      if (isTyping) {
        addTypingUser(username);
      } else {
        removeTypingUser(username);
      }
    });

    // Room events
    socket.on('room:new', (room) => {
      setRooms(prev => [...prev, room]);
    });

    socket.on('room:list', (roomList) => {
      setRooms(roomList);
    });

    socket.on('room:user-joined', ({ username }) => {
      console.log(`${username} joined the room`);
    });

    socket.on('room:user-left', ({ username }) => {
      console.log(`${username} left the room`);
    });

    // Notifications
    socket.on('notification:new', (notification) => {
      addNotification(notification);
    });

    // Message reactions
    socket.on('message:reaction-update', ({ messageId, username, reaction }) => {
      console.log(`${username} reacted with ${reaction} to message ${messageId}`);
    });

    // Read receipts
    socket.on('message:read-receipt', ({ username, messageIds }) => {
      console.log(`${username} read ${messageIds.length} messages`);
    });

    return () => {
      socket.off('user:joined');
      socket.off('users:list');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('user:status-change');
      socket.off('message:receive');
      socket.off('message:private-receive');
      socket.off('typing:update');
      socket.off('room:new');
      socket.off('room:list');
      socket.off('room:user-joined');
      socket.off('room:user-left');
      socket.off('notification:new');
      socket.off('message:reaction-update');
      socket.off('message:read-receipt');
    };
  }, [socket, addMessage, addTypingUser, removeTypingUser, setOnlineUsers, setUserId, addNotification, setRooms]);
};