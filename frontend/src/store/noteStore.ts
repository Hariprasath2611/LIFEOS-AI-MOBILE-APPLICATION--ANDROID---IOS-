import { create } from 'zustand';
import { api } from '../services/api';
import { Note } from '../types';

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  addNote: (noteData: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, noteData: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  uploadAttachment: (noteId: string, fileUri: string, mimeType: string, type: 'image' | 'audio' | 'document') => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Note[]>('/notes');
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch notes:', error);
    }
  },

  fetchNoteById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get<Note>(`/notes/${id}`);
      set({ currentNote: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch note:', error);
    }
  },

  addNote: async (noteData) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Note>('/notes', noteData);
      set({ 
        notes: [response.data, ...get().notes], 
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to add note:', error);
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const response = await api.put<Note>(`/notes/${id}`, noteData);
      set({
        notes: get().notes.map(n => n._id === id ? response.data : n),
        currentNote: get().currentNote?._id === id ? response.data : get().currentNote
      });
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set({
        notes: get().notes.filter(n => n._id !== id),
        currentNote: get().currentNote?._id === id ? null : get().currentNote
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  },

  uploadAttachment: async (noteId, fileUri, mimeType, type) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('type', type);
      // Construct file upload mock object
      formData.append('file', {
        uri: fileUri,
        name: fileUri.split('/').pop() || 'upload_file',
        type: mimeType
      } as any);

      const response = await api.post<Note>(`/notes/${noteId}/attachment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({
        notes: get().notes.map(n => n._id === noteId ? response.data : n),
        currentNote: response.data,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to upload attachment:', error);
    }
  },
}));
