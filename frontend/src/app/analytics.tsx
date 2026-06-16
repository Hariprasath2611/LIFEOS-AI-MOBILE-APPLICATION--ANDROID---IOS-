import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { CustomChart } from '../components/CustomChart';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/analytics');
      setHistory(res.data);
    } catch (err) {
      console.warn('Analytics API failed. Rendering mock metrics.');
      setHistory([
        { _id: '1', date: '2026-06-16T00:00:00Z', focusScore: 82, tasksCompleted: 4, habitConsistency: 75, aiInsights: 'Focus is high. Keep completing critical tasks first thing in the morning to maintain momentum.' },
        { _id: '2', date: '2026-06-15T00:00:00Z', focusScore: 65, tasksCompleted: 2, habitConsistency: 50, aiInsights: 'Habit chain was broken. Form a simple micro-trigger tomorrow to restart streaks.' },
        { _id: '3', date: '2026-06-14T00:00:00Z', focusScore: 90, tasksCompleted: 6, habitConsistency: 100, aiInsights: 'Peak productivity day. Balanced routine and tasks executed flawlessly.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const latestRecord = history[0];

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Dashboard</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Metrics</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Productivity Analytics</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00FF88" className="my-12" />
      ) : (
        <View className="mb-12">
          
          {/* Latest Daily AI Review Insight */}
          {latestRecord && latestRecord.aiInsights && (
            <GlassCard className="border-l-4 border-l-primary p-4 mb-6">
              <Text className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Daily AI Coach Insight</Text>
              <Text className="text-white text-sm leading-relaxed font-medium">
                "{latestRecord.aiInsights}"
              </Text>
            </GlassCard>
          )}

          {/* Quick Metrics Cards */}
          {latestRecord && (
            <View className="flex-row justify-between mb-6">
              <GlassCard className="flex-1 mr-2 p-3 items-center">
                <Text className="text-mutedText text-[10px] uppercase font-bold">Tasks Done</Text>
                <Text className="text-white text-lg font-black mt-1">{latestRecord.tasksCompleted}</Text>
              </GlassCard>

              <GlassCard className="flex-1 mx-1 p-3 items-center">
                <Text className="text-mutedText text-[10px] uppercase font-bold">Habits Hit</Text>
                <Text className="text-white text-lg font-black mt-1">{latestRecord.habitConsistency}%</Text>
              </GlassCard>

              <GlassCard className="flex-1 ml-2 p-3 items-center">
                <Text className="text-mutedText text-[10px] uppercase font-bold">Focus Rating</Text>
                <Text className="text-white text-lg font-black mt-1">{latestRecord.focusScore}</Text>
              </GlassCard>
            </View>
          )}

          {/* Productivity Trends Line Chart */}
          <CustomChart
            title="Focus History Trends"
            data={history.map(h => h.focusScore).reverse()}
            labels={history.map(h => new Date(h.date).toLocaleDateString([], { weekday: 'short' })).reverse()}
            type="line"
          />

          {/* Tasks Finished Bar Chart */}
          <CustomChart
            title="Completed Tasks Trends"
            data={history.map(h => h.tasksCompleted).reverse()}
            labels={history.map(h => new Date(h.date).toLocaleDateString([], { weekday: 'short' })).reverse()}
            type="bar"
          />

        </View>
      )}

    </ScrollView>
  );
}
