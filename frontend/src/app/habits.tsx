import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../store/habitStore';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { CustomChart } from '../components/CustomChart';

export default function HabitsScreen() {
  const { habits, isLoading, fetchHabits, addHabit, toggleHabit, deleteHabit } = useHabitStore();
  const router = useRouter();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Health');
  const [newFreq, setNewFreq] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async () => {
    if (!newTitle.trim()) return;
    await addHabit({
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFreq,
      streak: 0,
      history: []
    });
    setNewTitle('');
  };

  const handleToggleCheck = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    await toggleHabit(habitId, today);
  };

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Routine</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Habit Tracker</Text>
      </View>

      {/* Habit Creator Form */}
      <GlassCard className="p-4 mb-6">
        <Text className="text-white text-base font-semibold mb-3">Add Custom Habit</Text>
        
        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-3">
          <TextInput
            className="text-white text-base"
            placeholder="Habit Title..."
            placeholderTextColor="#A0A0A0"
            value={newTitle}
            onChangeText={setNewTitle}
          />
        </View>

        {/* Frequency Toggles */}
        <View className="flex-row justify-between mb-4">
          {(['daily', 'weekly'] as const).map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setNewFreq(f)}
              className={`flex-1 mx-1.5 py-2.5 rounded-lg border items-center justify-center ${
                newFreq === f ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
              }`}
            >
              <Text className={`text-xs uppercase font-bold ${newFreq === f ? 'text-primary' : 'text-white'}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Selector */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-mutedText text-xs font-semibold">CATEGORY</Text>
          <View className="flex-row">
            {['Health', 'Focus', 'Finance'].map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCategory(cat)}
                className={`ml-2 px-3 py-1 rounded-md border ${
                  newCategory === cat ? 'bg-white/10 border-white/30' : 'bg-transparent border-glassBorder'
                }`}
              >
                <Text className="text-white text-xs">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <GlassButton title="Create Habit" onPress={handleAddHabit} variant="outline" />
      </GlassCard>

      {/* Habit Heatmap Density Chart */}
      <CustomChart type="heatmap" data={[]} labels={[]} title="Consistency Heatmap" />

      {/* Habits Checklist */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#00FF88" className="my-12" />
      ) : (
        <View className="mb-12">
          {habits.length > 0 ? (
            habits.map(habit => {
              const todayStr = new Date().toISOString().split('T')[0];
              const completedToday = habit.history.some(d => d.startsWith(todayStr));

              return (
                <GlassCard key={habit._id} className="mb-4 p-4">
                  
                  <View className="flex-row justify-between items-center">
                    
                    {/* Left check section */}
                    <TouchableOpacity
                      onPress={() => handleToggleCheck(habit._id)}
                      className="flex-row items-center flex-1 pr-4"
                    >
                      <View className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-3 ${
                        completedToday ? 'bg-primary border-primary' : 'border-glassBorder'
                      }`}>
                        {completedToday && <Text className="text-background text-base font-black">✓</Text>}
                      </View>
                      
                      <View className="flex-1">
                        <Text className={`text-white text-base font-bold ${completedToday ? 'line-through text-mutedText' : ''}`}>
                          {habit.title}
                        </Text>
                        <Text className="text-mutedText text-xs mt-0.5">{habit.category} • {habit.frequency}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Streak Badge */}
                    <View className="bg-secondary/10 border border-secondary/20 rounded-xl px-3 py-1 items-center justify-center">
                      <Text className="text-secondary text-xs font-extrabold">{habit.streak}d 🔥</Text>
                    </View>

                  </View>

                  {/* AI Consistency Tips */}
                  {habit.aiSuggestions && habit.aiSuggestions.length > 0 && (
                    <View className="mt-3 border-t border-glassBorder/40 pt-3">
                      <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">✨ AI Habits Hack</Text>
                      <Text className="text-white text-xs leading-relaxed mt-1">{habit.aiSuggestions[0]}</Text>
                    </View>
                  )}

                  {/* Delete Option */}
                  <TouchableOpacity onPress={() => deleteHabit(habit._id)} className="align-self-end mt-3">
                    <Text className="text-red-500 text-xs font-semibold">Delete</Text>
                  </TouchableOpacity>

                </GlassCard>
              );
            })
          ) : (
            <Text className="text-mutedText text-center py-12">No habits configured. Start building routine!</Text>
          )}
        </View>
      )}

    </ScrollView>
  );
}
