import { noteRepo } from '../repositories';
import { INote } from '../models/Note';
import { geminiService } from './GeminiService';

export class NoteService {
  async createNote(userId: string, noteData: Partial<INote>): Promise<INote> {
    const note = await noteRepo.create({ ...noteData, userId });
    
    // Auto-generate AI summary and tags if content exists
    if (note.content && note.content.length > 50) {
      await this.enrichNoteWithAI(note);
    }
    
    return note;
  }

  async getNotes(userId: string): Promise<INote[]> {
    return noteRepo.findByUserId(userId);
  }

  async getNoteById(userId: string, noteId: string): Promise<INote | null> {
    return noteRepo.findOne({ _id: noteId, userId });
  }

  async updateNote(userId: string, noteId: string, updateData: Partial<INote>): Promise<INote | null> {
    const note = await noteRepo.update({ _id: noteId, userId }, updateData);
    
    // Trigger AI summarization if content has changed substantially
    if (note && updateData.content && updateData.content.length > 50) {
      await this.enrichNoteWithAI(note);
    }

    return note;
  }

  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    const result = await noteRepo.delete({ _id: noteId, userId });
    return result.deletedCount > 0;
  }

  private async enrichNoteWithAI(note: INote): Promise<void> {
    try {
      const aiResults = await geminiService.summarizeNote(note.content);
      if (aiResults) {
        note.aiSummary = aiResults.summary;
        note.aiTags = aiResults.tags || [];
        note.aiInsights = aiResults.insights;
        await note.save();
      }
    } catch (error) {
      console.error('Failed to enrich note with AI:', error);
    }
  }
}

export const noteService = new NoteService();
