import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNoteStore } from '../../store/noteStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import Svg, { Path, Circle } from 'react-native-svg';

export default function NotesScreen() {
  const { notes, isLoading, fetchNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const [search, setSearch] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  // Note edit parameters
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFolder, setEditFolder] = useState('Personal');

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSelectNote = (id: string) => {
    const note = notes.find(n => n._id === id);
    if (note) {
      setSelectedNoteId(id);
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditFolder(note.folder);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await addNote({
        title: 'Untitled Note',
        content: '',
        folder: 'Uncategorized',
        tags: []
      });
      handleSelectNote(newNote._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNoteId) return;
    await updateNote(selectedNoteId, {
      title: editTitle,
      content: editContent,
      folder: editFolder
    });
    // Exit edit mode
    setSelectedNoteId(null);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    await updateNote(id, { isFavorite: !isFav });
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const activeEditingNote = notes.find(n => n._id === selectedNoteId);

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Edit Note Modal Screen State */}
      {selectedNoteId && activeEditingNote ? (
        <View className="mb-12">
          {/* Back Action Bar */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => setSelectedNoteId(null)} className="flex-row items-center py-1">
              <Text className="text-primary text-base font-bold">← Back</Text>
            </TouchableOpacity>
            
            <GlassButton title="Save Note" onPress={handleSaveNote} variant="outline" className="py-1 px-4" />
          </View>

          {/* Edit Inputs */}
          <GlassCard className="p-4 mb-4">
            <TextInput
              className="text-white text-xl font-bold mb-4 border-b border-glassBorder pb-2"
              placeholder="Title..."
              placeholderTextColor="#A0A0A0"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <TextInput
              className="text-white text-base min-h-[160px]"
              placeholder="Write markdown details here..."
              placeholderTextColor="#A0A0A0"
              multiline
              value={editContent}
              onChangeText={setEditContent}
              textAlignVertical="top"
            />
          </GlassCard>

          {/* AI Insights panel */}
          {activeEditingNote.aiSummary && (
            <GlassCard className="border-l-4 border-l-primary p-4 mb-4">
              <Text className="text-primary text-xs font-bold uppercase tracking-wider mb-2">AI Summary & Insights</Text>
              <Text className="text-white text-sm leading-relaxed mb-3">{activeEditingNote.aiSummary}</Text>
              
              {activeEditingNote.aiInsights && (
                <View className="border-t border-glassBorder/40 pt-3">
                  <Text className="text-mutedText text-xs font-bold uppercase mb-1">Actionable Insights</Text>
                  <Text className="text-white text-xs leading-relaxed">{activeEditingNote.aiInsights}</Text>
                </View>
              )}

              {/* AI Tags */}
              <View className="flex-row flex-wrap mt-3">
                {activeEditingNote.aiTags.map(tag => (
                  <View key={tag} className="bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 m-0.5">
                    <Text className="text-primary text-[10px] font-bold">#{tag}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          <TouchableOpacity
            onPress={() => handleDeleteNote(activeEditingNote._id)}
            className="bg-red-500/10 border border-red-500/30 rounded-xl py-3 items-center"
          >
            <Text className="text-red-500 font-bold text-sm">Delete Document</Text>
          </TouchableOpacity>

        </View>
      ) : (
        // List Board Screen State
        <View className="mb-12">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Notes</Text>
              <Text className="text-white text-2xl font-bold mt-0.5">Second Brain</Text>
            </View>
            
            <TouchableOpacity onPress={handleCreateNote} className="bg-primary w-10 h-10 rounded-xl items-center justify-center">
              <Text className="text-background text-2xl font-black">+</Text>
            </TouchableOpacity>
          </View>

          {/* Search box */}
          <View className="bg-card border border-glassBorder rounded-xl px-4 py-3 mb-6 flex-row items-center" style={{ backgroundColor: '#111111' }}>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2" className="mr-2">
              <Circle cx="11" cy="11" r="8" />
              <Path d="M21 21l-4.35-4.35" />
            </Svg>
            <TextInput
              className="flex-1 text-white text-base p-0"
              placeholder="Search notes content..."
              placeholderTextColor="#A0A0A0"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Notes Grid List */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#00FF88" className="my-12" />
          ) : (
            <View>
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <TouchableOpacity
                    key={note._id}
                    onPress={() => handleSelectNote(note._id)}
                    className="mb-4"
                  >
                    <GlassCard className="p-4">
                      
                      {/* Title Header */}
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-2">
                          <Text className="text-white text-base font-bold">{note.title}</Text>
                          <Text className="text-mutedText text-xs font-semibold uppercase mt-0.5">{note.folder}</Text>
                        </View>
                        
                        {/* Toggle Fav */}
                        <TouchableOpacity onPress={() => handleToggleFavorite(note._id, note.isFavorite)} className="p-1">
                          <Text className={note.isFavorite ? 'text-primary font-bold text-base' : 'text-white/20 text-base'}>★</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Content Preview */}
                      <Text className="text-mutedText text-sm mt-3 leading-relaxed" numberOfLines={2}>
                        {note.content || 'Empty note content...'}
                      </Text>

                      {/* AI Tags Preview */}
                      {note.aiTags && note.aiTags.length > 0 && (
                        <View className="flex-row flex-wrap mt-3 border-t border-glassBorder/20 pt-3">
                          {note.aiTags.slice(0, 3).map(tag => (
                            <View key={tag} className="bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 mr-1.5 mb-1.5">
                              <Text className="text-primary text-[10px] font-bold">#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                    </GlassCard>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-mutedText text-center py-12">No notes catalogued. Create a new document!</Text>
              )}
            </View>
          )}

        </View>
      )}

    </ScrollView>
  );
}
