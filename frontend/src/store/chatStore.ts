import { create } from 'zustand';
import { api } from '../services/api';
import { Conversation, Memory } from '../types';
import {
  connectSocket,
  joinConvoRoom,
  leaveConvoRoom,
  emitTyping,
  emitStopTyping,
  sendSocketMessage,
  disconnectSocket
} from '../services/socket';

interface ChatState {
  conversations: Conversation[];
  currentConvoId: string | null;
  messages: Memory[];
  isAITyping: boolean;
  isStreaming: boolean;
  streamingText: string;
  isLoading: boolean;
  
  fetchConversations: () => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  uploadVoiceNote: (fileUri: string, mimeType: string) => Promise<void>;
  closeSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConvoId: null,
  messages: [],
  isAITyping: false,
  isStreaming: false,
  streamingText: '',
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Conversation[]>('/ai/conversations');
      set({ conversations: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch conversations:', error);
    }
  },

  createConversation: async (title) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Conversation>('/ai/conversations', { title });
      set({ 
        conversations: [response.data, ...get().conversations],
        currentConvoId: response.data._id,
        messages: [],
        isLoading: false
      });
      return response.data._id;
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },

  deleteConversation: async (id) => {
    try {
      await api.delete(`/ai/conversations/${id}`);
      const remaining = get().conversations.filter(c => c._id !== id);
      set({
        conversations: remaining,
        currentConvoId: get().currentConvoId === id ? (remaining[0]?._id || null) : get().currentConvoId,
        messages: get().currentConvoId === id ? [] : get().messages
      });
      leaveConvoRoom(id);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  },

  togglePin: async (id) => {
    try {
      const response = await api.post<Conversation>(`/ai/conversations/${id}/pin`);
      set({
        conversations: get().conversations.map(c => c._id === id ? response.data : c)
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
      });
    } catch (error) {
      console.error('Failed to toggle conversation pin:', error);
    }
  },

  selectConversation: async (id) => {
    const prevConvoId = get().currentConvoId;
    if (prevConvoId) {
      leaveConvoRoom(prevConvoId);
    }

    set({ currentConvoId: id, messages: [], streamingText: '', isStreaming: false, isAITyping: false });
    
    // Connect WebSocket and setup listeners
    await connectSocket(
      // Chunk listener (streaming state)
      (data) => {
        if (data.conversationId === id) {
          set({ 
            isStreaming: true, 
            streamingText: data.fullResponse 
          });
        }
      },
      // Message Complete listener (persist to local message list)
      (savedMsg) => {
        if (savedMsg.conversationId === id) {
          set({ 
            messages: [...get().messages, savedMsg],
            streamingText: '',
            isStreaming: false
          });
        }
      },
      // Typing status listener
      (typingData) => {
        if (typingData.userId === 'ai') {
          set({ isAITyping: typingData.isTyping });
        }
      }
    );

    joinConvoRoom(id);

    // Fetch conversation message logs
    try {
      const response = await api.get<Memory[]>(`/ai/conversations/${id}/messages`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  },

  sendMessage: async (content) => {
    const convoId = get().currentConvoId;
    if (!convoId) return;

    // Instantly append local user message in UI for responsiveness
    const tempUserMsg: Memory = {
      _id: `temp_${Date.now()}`,
      conversationId: convoId,
      sender: 'user',
      content,
      createdAt: new Date().toISOString()
    };

    set({ messages: [...get().messages, tempUserMsg] });

    // Send via WebSocket connection
    sendSocketMessage(convoId, content);
  },

  uploadVoiceNote: async (fileUri, mimeType) => {
    const convoId = get().currentConvoId;
    if (!convoId) return;

    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'voice_note.m4a',
        type: mimeType
      } as any);

      // Post audio note to receive transcribing summary
      const response = await api.post<{ url: string; transcript: string; summary: string }>(
        '/ai/transcribe',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      set({ isLoading: false });

      // Feed transcripts summary as a user message query to continue chat context
      if (response.data.transcript) {
        await get().sendMessage(response.data.transcript);
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Voice note transcription failed:', error);
    }
  },

  closeSocket: () => {
    disconnectSocket();
  }
}));
