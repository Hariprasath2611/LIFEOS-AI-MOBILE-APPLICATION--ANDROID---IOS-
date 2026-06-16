import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '../components/GlassCard';
import { useAuthStore } from '../store/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} className="mb-4">
        <Text className="text-primary text-base font-bold">← Profile</Text>
      </TouchableOpacity>

      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Preferences</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">Application Settings</Text>
      </View>

      {/* General Settings */}
      <GlassCard className="p-4 mb-6">
        
        {/* Toggle Sound */}
        <View className="flex-row justify-between items-center border-b border-glassBorder/40 pb-4 mb-4">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-semibold">Sound Effects</Text>
            <Text className="text-mutedText text-xs">Vocal chimes on tasks completion & streak rewards</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#222', true: '#00FF88' }}
            thumbColor="#FFF"
          />
        </View>

        {/* Toggle Developer Mode */}
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-semibold">Developer Mode</Text>
            <Text className="text-mutedText text-xs">Expose local mock database queries & logs</Text>
          </View>
          <Switch
            value={developerMode}
            onValueChange={setDeveloperMode}
            trackColor={{ false: '#222', true: '#00FF88' }}
            thumbColor="#FFF"
          />
        </View>

      </GlassCard>

      {/* Connection Info */}
      <Text className="text-white text-base font-bold mb-3">System Information</Text>
      <GlassCard className="p-4 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-mutedText text-xs font-semibold">BUILD VERSION</Text>
          <Text className="text-white text-xs font-bold">1.0.0 (production-ready)</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-mutedText text-xs font-semibold">FIREBASE AUTH SERVICE</Text>
          <Text className="text-white text-xs font-bold">Configured (fallback mode ready)</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-mutedText text-xs font-semibold">GEMINI CORE MODEL</Text>
          <Text className="text-white text-xs font-bold">gemini-1.5-flash</Text>
        </View>
      </GlassCard>

    </ScrollView>
  );
}
