import { io, Socket } from 'socket.io-client';
import { getStoredToken } from './firebase';
import { Platform } from 'react-native';

const getSocketURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    // Strip '/api' from URL to get root socket connection host
    return process.env.EXPO_PUBLIC_API_URL.replace('/api', '');
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
};

let socket: Socket | null = null;

export const connectSocket = async (
  onChunk: (data: { chunk: string; fullResponse: string }) => void,
  onComplete: (data: any) => void,
  onTypingStatus: (data: { userId: string; isTyping: boolean }) => void
): Promise<Socket> => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = await getStoredToken();
  const socketUrl = getSocketURL();

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server successfully:', socket?.id);
  });

  socket.on('chatResponseChunk', (data) => {
    onChunk(data);
  });

  socket.on('messageComplete', (savedMsg) => {
    onComplete(savedMsg);
  });

  socket.on('typingStatus', (status) => {
    onTypingStatus(status);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected from server');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinConvoRoom = (conversationId: string) => {
  if (socket) {
    socket.emit('joinConversation', conversationId);
  }
};

export const leaveConvoRoom = (conversationId: string) => {
  if (socket) {
    socket.emit('leaveConversation', conversationId);
  }
};

export const emitTyping = (conversationId: string) => {
  if (socket) {
    socket.emit('typing', { conversationId });
  }
};

export const emitStopTyping = (conversationId: string) => {
  if (socket) {
    socket.emit('stopTyping', { conversationId });
  }
};

export const sendSocketMessage = (conversationId: string, content: string) => {
  if (socket) {
    socket.emit('sendMessage', { conversationId, content });
  }
};
