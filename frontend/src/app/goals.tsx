import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoalStore } from '../store/goalStore';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

export default function GoalsScreen() {
  const { goals, isLoading, fetchGoals, addGoal, updateGoal, deleteGoal, generateAIActionPlan } = useGoalStore();
  const router = useRouter();
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'short-term' | 'long-term'>('short-term');

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newTitle.trim()) return;
    await addGoal({
      title: newTitle.trim(),
      description: newDesc.trim(),
      type: newType,
      progress: 0,
      milestones: []
    });
    setNewTitle('');
    setNewDesc('');
  };

  const handleToggleMilestone = async (goalId: string, index: number) => {
    const goal = goals.find(g => g._id === goalId);
    if (!goal) return;
    
    const updatedMilestones = [...goal.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      completed: !updatedMilestones[index].completed
    };

    await updateGoal(goalId, { milestones: updatedMilestones });
  };

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Growth</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Goal Management</Text>
      </View>

      {/* Goal Creator Form */}
      <GlassCard className="p-4 mb-6">
        <Text className="text-white text-base font-semibold mb-3">Add Target Goal</Text>
        
        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-3">
          <TextInput
            className="text-white text-base"
            placeholder="Goal Title..."
            placeholderTextColor="#A0A0A0"
            value={newTitle}
            onChangeText={setNewTitle}
          />
        </View>

        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-4">
          <TextInput
            className="text-white text-sm"
            placeholder="Aspiration details..."
            placeholderTextColor="#A0A0A0"
            value={newDesc}
            onChangeText={setNewDesc}
          />
        </View>

        {/* Goal Type Toggles */}
        <View className="flex-row justify-between mb-4">
          {(['short-term', 'long-term'] as const).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setNewType(t)}
              className={`flex-1 mx-1.5 py-2.5 rounded-lg border items-center justify-center ${
                newType === t ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
              }`}
            >
              <Text className={`text-xs uppercase font-bold ${newType === t ? 'text-primary' : 'text-white'}`}>{t.replace('-', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassButton title="Generate Goal" onPress={handleAddGoal} variant="outline" />
      </GlassCard>

      {/* Goals List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#00FF88" className="my-12" />
      ) : (
        <View className="mb-12">
          {goals.length > 0 ? (
            goals.map(goal => (
              <GlassCard key={goal._id} className="mb-4 p-4">
                
                {/* Title and Badge */}
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-2">
                    <Text className="text-white text-lg font-bold">{goal.title}</Text>
                    <Text className="text-mutedText text-xs mt-0.5">{goal.description || 'No description listed'}</Text>
                  </View>
                  <View className="bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
                    <Text className="text-primary text-[10px] font-bold uppercase">{goal.type.replace('-', ' ')}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mt-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-mutedText text-xs font-semibold">Progress Ratio</Text>
                    <Text className="text-primary text-xs font-bold">{goal.progress}%</Text>
                  </View>
                  <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <View className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                  </View>
                </View>

                {/* Milestones Checklists */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <View className="mt-4 border-t border-glassBorder/40 pt-3">
                    <Text className="text-white text-xs font-bold mb-2">Milestones Checklist</Text>
                    {goal.milestones.map((m, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleToggleMilestone(goal._id, idx)}
                        className="flex-row items-center py-1.5"
                      >
                        <View className={`w-4 h-4 rounded border mr-2 items-center justify-center ${
                          m.completed ? 'bg-primary border-primary' : 'border-glassBorder'
                        }`}>
                          {m.completed && <Text className="text-background text-[10px] font-black">✓</Text>}
                        </View>
                        <Text className={`text-xs ${m.completed ? 'line-through text-mutedText' : 'text-white'}`}>{m.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Generate action items if empty */}
                {(!goal.aiActionPlan || goal.aiActionPlan.length === 0) ? (
                  <TouchableOpacity
                    onPress={() => generateAIActionPlan(goal._id)}
                    className="bg-primary/10 border border-primary/20 rounded-xl py-2 mt-4 items-center"
                  >
                    <Text className="text-primary font-bold text-xs">✨ Request AI Action Plan</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="mt-4 border-t border-glassBorder/40 pt-3">
                    <Text className="text-primary text-xs font-bold mb-2">✨ AI Execution Steps</Text>
                    {goal.aiActionPlan.map((act, idx) => (
                      <Text key={idx} className="text-white text-xs leading-relaxed mb-1.5">• {act}</Text>
                    ))}
                  </View>
                )}

                {/* Delete button */}
                <TouchableOpacity onPress={() => deleteGoal(goal._id)} className="align-self-end mt-4">
                  <Text className="text-red-500 text-xs font-semibold">Delete Goal</Text>
                </TouchableOpacity>

              </GlassCard>
            ))
          ) : (
            <Text className="text-mutedText text-center py-12">No goals configured. Add a growth vector!</Text>
          )}
        </View>
      )}

    </ScrollView>
  );
}
