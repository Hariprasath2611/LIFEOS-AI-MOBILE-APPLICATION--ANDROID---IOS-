import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useLearningStore } from '../store/learningStore';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

export default function LearningScreen() {
  const { roadmaps, isLoading, fetchRoadmaps, generateRoadmap, toggleStep, deleteRoadmap } = useLearningStore();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [diff, setDiff] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    try {
      await generateRoadmap(topic.trim(), diff);
      setTopic('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStep = async (roadmapId: string, stepTitle: string, currentVal: boolean) => {
    await toggleStep(roadmapId, stepTitle, !currentVal);
  };

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Knowledge</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Learning Hub</Text>
      </View>

      {/* Generator Card */}
      <GlassCard className="p-4 mb-6">
        <Text className="text-white text-base font-semibold mb-3">Generate AI Custom Roadmap</Text>
        
        <View className="bg-background rounded-xl border border-glassBorder px-4 py-3 mb-3">
          <TextInput
            className="text-white text-base"
            placeholder="Topic (e.g., Deep Learning, Stock Trading)..."
            placeholderTextColor="#A0A0A0"
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        {/* Difficulty Selector */}
        <View className="flex-row justify-between mb-4">
          {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
            <TouchableOpacity
              key={d}
              onPress={() => setDiff(d)}
              className={`flex-1 mx-1 py-2 rounded-lg border items-center justify-center ${
                diff === d ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
              }`}
            >
              <Text className={`text-[10px] uppercase font-bold ${diff === d ? 'text-primary' : 'text-white'}`}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassButton title="Generate AI Curriculum" onPress={handleGenerate} variant="outline" />
      </GlassCard>

      {/* Roadmaps List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#00FF88" className="my-12" />
      ) : (
        <View className="mb-12">
          {roadmaps.length > 0 ? (
            roadmaps.map(rm => {
              const isExpanded = expandedId === rm._id;
              return (
                <GlassCard key={rm._id} className="mb-4 p-4">
                  
                  {/* Summary row */}
                  <TouchableOpacity
                    onPress={() => setExpandedId(isExpanded ? null : rm._id)}
                    className="flex-row justify-between items-start"
                  >
                    <View className="flex-1 pr-2">
                      <Text className="text-white text-base font-bold">{rm.title}</Text>
                      <Text className="text-mutedText text-xs mt-0.5 capitalize">{rm.difficulty} • {rm.steps.length} Steps</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-primary text-sm font-extrabold">{rm.progress}%</Text>
                      <Text className="text-mutedText text-[10px] mt-0.5">{isExpanded ? 'Collapse ▲' : 'Expand ▼'}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Progress Line */}
                  <View className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                    <View className="h-full bg-primary" style={{ width: `${rm.progress}%` }} />
                  </View>

                  {/* Details Lessons Steps list */}
                  {isExpanded && (
                    <View className="mt-4 border-t border-glassBorder/40 pt-3">
                      {rm.steps.map((step, idx) => (
                        <View key={idx} className="mb-4 bg-background border border-glassBorder/40 rounded-xl p-3.5" style={{ backgroundColor: '#0A0A0A' }}>
                          <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-white text-xs font-bold flex-1 pr-2">{step.title}</Text>
                            <Text className="text-primary text-[10px] font-semibold">{step.duration}</Text>
                          </View>
                          
                          <Text className="text-mutedText text-xs leading-relaxed mb-3">{step.content}</Text>
                          
                          {/* Checkoff lesson button */}
                          <TouchableOpacity
                            onPress={() => handleToggleStep(rm._id, step.title, step.completed)}
                            className={`py-1.5 px-4 rounded-lg items-center border ${
                              step.completed ? 'bg-primary/10 border-primary' : 'border-glassBorder'
                            }`}
                          >
                            <Text className={`text-[10px] font-black uppercase ${
                              step.completed ? 'text-primary' : 'text-white'
                            }`}>{step.completed ? 'Lesson Completed ✓' : 'Mark Completed'}</Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Delete button */}
                      <TouchableOpacity
                        onPress={() => deleteRoadmap(rm._id)}
                        className="align-self-end mt-2"
                      >
                        <Text className="text-red-500 text-xs font-semibold">Delete Roadmap</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </GlassCard>
              );
            })
          ) : (
            <Text className="text-mutedText text-center py-12">No active roadmaps. Let AI design your curriculum!</Text>
          )}
        </View>
      )}

    </ScrollView>
  );
}
