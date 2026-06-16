import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { GlassCard } from '../../components/GlassCard';
import { CustomChart } from '../../components/CustomChart';
import Svg, { Circle } from 'react-native-svg';

export default function HomeDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users/dashboard');
      setData(res.data);
    } catch (err) {
      console.warn('Dashboard API failed. Loading mock dashboard data.');
      // Offline fallback state
      setData({
        productivityScore: 78,
        focusScore: 82,
        tasks: {
          upcoming: [
            { _id: '1', title: 'Prioritize LifeOS execution plan', priority: 'high', category: 'Work' },
            { _id: '2', title: 'Conduct user interview prep', priority: 'medium', category: 'Growth' },
            { _id: '3', title: 'Mark habit completions', priority: 'low', category: 'Health' }
          ],
          completedToday: 3,
        },
        habits: { total: 4, longestStreak: 12 },
        goals: { activeCount: 2, overallProgress: 65 },
        learning: { activeCount: 1 },
        aiSuggestions: [
          'Tackle your highest priority tasks first to clear your mind.',
          'Consistency is key. You are maintaining an active 12-day habit chain!'
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00FF88" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Welcome Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Dashboard</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">Control Center</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/coaching')}
          className="bg-primary/10 border border-primary/20 rounded-full py-1.5 px-4"
        >
          <Text className="text-primary font-bold text-xs">AI Coach Active</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Cards Row */}
      <View className="flex-row justify-between mb-6">
        
        {/* Productivity Score Circular Progress */}
        <GlassCard className="flex-1 mr-3 p-4 items-center justify-center">
          <Text className="text-mutedText text-xs font-semibold uppercase tracking-wider mb-2">Productivity</Text>
          <View className="w-20 h-20 items-center justify-center">
            <Svg width="72" height="72" viewBox="0 0 36 36">
              <Circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
              <Circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#00FF88"
                strokeWidth="3.5"
                strokeDasharray={`${data.productivityScore} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </Svg>
            <View className="absolute items-center justify-center">
              <Text className="text-white text-lg font-extrabold">{data.productivityScore}%</Text>
            </View>
          </View>
        </GlassCard>

        {/* Focus Score Circular Progress */}
        <GlassCard className="flex-1 ml-3 p-4 items-center justify-center">
          <Text className="text-mutedText text-xs font-semibold uppercase tracking-wider mb-2">Focus Score</Text>
          <View className="w-20 h-20 items-center justify-center">
            <Svg width="72" height="72" viewBox="0 0 36 36">
              <Circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
              <Circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#00C853"
                strokeWidth="3.5"
                strokeDasharray={`${data.focusScore} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </Svg>
            <View className="absolute items-center justify-center">
              <Text className="text-white text-lg font-extrabold">{data.focusScore}%</Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* AI Suggestions Alert Box */}
      <GlassCard className="border-l-4 border-l-primary p-4 mb-6">
        <Text className="text-primary text-xs font-bold uppercase tracking-wider mb-1">AI Suggestion</Text>
        <Text className="text-white text-sm leading-relaxed font-medium">
          "{data.aiSuggestions[0]}"
        </Text>
      </GlassCard>

      {/* Productivity Chart */}
      <CustomChart
        title="Weekly Focus Trends"
        data={[40, 55, 68, 60, 85, 90, 82]}
        labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
        type="line"
      />

      {/* Quick Actions Grid */}
      <Text className="text-white text-base font-bold mb-3">Quick Modules</Text>
      <View className="flex-row flex-wrap justify-between mb-6">
        
        {[
          { title: 'Goals', route: '/goals', desc: `${data.goals.activeCount} active` },
          { title: 'Habits', route: '/habits', desc: `${data.habits.longestStreak}d streak` },
          { title: 'Roadmaps', route: '/learning', desc: `${data.learning.activeCount} topic` },
          { title: 'Calendar', route: '/calendar', desc: 'Sync plans' },
          { title: 'Analytics', route: '/analytics', desc: 'View charts' },
          { title: 'AI Coach', route: '/coaching', desc: 'Check reviews' }
        ].map((mod, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(mod.route as any)}
            className="w-[48%] mb-4"
          >
            <GlassCard className="p-3">
              <Text className="text-primary text-base font-bold">{mod.title}</Text>
              <Text className="text-mutedText text-xs mt-1">{mod.desc}</Text>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Focus Tasks */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-base font-bold">Today's Focus Tasks</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
          <Text className="text-primary text-sm font-semibold">View All</Text>
        </TouchableOpacity>
      </View>

      <GlassCard className="mb-12">
        {data.tasks.upcoming.length > 0 ? (
          data.tasks.upcoming.map((task: any) => (
            <View key={task._id} className="flex-row justify-between items-center border-b border-glassBorder/40 py-3 last:border-b-0">
              <View className="flex-1 pr-2">
                <Text className="text-white text-sm font-medium">{task.title}</Text>
                <Text className="text-mutedText text-xs mt-0.5">{task.category}</Text>
              </View>
              <View className={`rounded-full px-2 py-0.5 ${
                task.priority === 'high' ? 'bg-red-500/10' : task.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
              }`}>
                <Text className={`text-[10px] uppercase font-bold ${
                  task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`}>{task.priority}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-mutedText text-center py-4">No remaining tasks. You are all caught up!</Text>
        )}
      </GlassCard>

    </ScrollView>
  );
}
