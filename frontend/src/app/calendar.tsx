import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

export default function CalendarScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'task' | 'habit' | 'goal' | 'meeting'>('meeting');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
      
      const res = await api.get(`/calendar?start=${start}&end=${end}`);
      setEvents(res.data);
    } catch (err) {
      console.warn('Calendar API failed. Generating fallback schedule slots.');
      setEvents([
        { _id: '1', title: 'Deep Work Focus Block', type: 'task', start: '2026-06-16T10:00:00.000Z', end: '2026-06-16T12:00:00.000Z' },
        { _id: '2', title: 'Daily Cardio Check-in', type: 'habit', start: '2026-06-16T18:00:00.000Z', end: '2026-06-16T18:30:00.000Z' },
        { _id: '3', title: 'Project Design Alignment', type: 'meeting', start: '2026-06-17T14:00:00.000Z', end: '2026-06-17T15:00:00.000Z' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!title.trim()) return;
    try {
      const start = new Date();
      start.setHours(start.getHours() + 1, 0, 0, 0); // Next hour
      const end = new Date(start);
      end.setHours(end.getHours() + 1); // 1 hour duration

      const newEv = await api.post('/calendar', {
        title: title.trim(),
        type,
        start: start.toISOString(),
        end: end.toISOString()
      });
      setEvents([...events, newEv.data]);
      setTitle('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.delete(`/calendar/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Timeline</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Calendar Planner</Text>
      </View>

      {/* Quick Scheduler Form */}
      <GlassCard className="p-4 mb-6">
        <Text className="text-white text-base font-semibold mb-3">Quick Schedule Slot</Text>
        
        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-3">
          <TextInput
            className="text-white text-base"
            placeholder="Event details or title..."
            placeholderTextColor="#A0A0A0"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Type selector */}
        <View className="flex-row justify-between mb-4">
          {(['task', 'habit', 'meeting'] as const).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className={`flex-1 mx-1.5 py-2 rounded-lg border items-center justify-center ${
                type === t ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
              }`}
            >
              <Text className={`text-[10px] uppercase font-bold ${type === t ? 'text-primary' : 'text-white'}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassButton title="Schedule Slot" onPress={handleAddEvent} variant="outline" />
      </GlassCard>

      {/* Scheduled lists */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#00FF88" className="my-12" />
      ) : (
        <View className="mb-12">
          {events.length > 0 ? (
            events.map(ev => {
              const startStr = new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dayStr = new Date(ev.start).toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <GlassCard key={ev._id} className="mb-3 p-4 flex-row justify-between items-center">
                  <View className="flex-1 pr-4">
                    <Text className="text-white text-base font-semibold">{ev.title}</Text>
                    <Text className="text-mutedText text-xs mt-0.5">{dayStr} • {startStr} • {ev.type.toUpperCase()}</Text>
                  </View>
                  
                  {/* Delete Event icon */}
                  <TouchableOpacity onPress={() => handleDeleteEvent(ev._id)} className="p-1 active:opacity-60">
                    <Text className="text-red-500 font-bold text-base">×</Text>
                  </TouchableOpacity>
                </GlassCard>
              );
            })
          ) : (
            <Text className="text-mutedText text-center py-12">No scheduled slots in your calendar.</Text>
          )}
        </View>
      )}

    </ScrollView>
  );
}
