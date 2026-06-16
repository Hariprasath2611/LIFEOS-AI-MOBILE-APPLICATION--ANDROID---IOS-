import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();

  const handleTogglePreference = async (key: 'notificationsEnabled' | 'aiAssistantEnabled') => {
    if (!user) return;
    const currentPreferences = user.preferences || { notificationsEnabled: true, aiAssistantEnabled: true, theme: 'dark' };
    await updateProfile({
      preferences: {
        ...currentPreferences,
        [key]: !currentPreferences[key]
      }
    });
  };

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <ScrollView className="flex-grow bg-background px-6 pt-16 pb-12">
      
      {/* Header */}
      <View className="mb-6">
        <Text className="text-mutedText text-sm uppercase tracking-wider font-semibold">Settings</Text>
        <Text className="text-white text-2xl font-bold mt-0.5">User Profile</Text>
      </View>

      {/* User Information Card */}
      <GlassCard className="p-6 items-center mb-6">
        
        {/* Avatar mock */}
        <View className="w-24 h-24 rounded-full border-2 border-primary overflow-hidden bg-white/5 justify-center items-center mb-4">
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} className="w-full h-full" />
          ) : (
            <Text className="text-primary text-4xl font-extrabold">{user.displayName?.charAt(0).toUpperCase() || 'U'}</Text>
          )}
        </View>

        <Text className="text-white text-xl font-bold">{user.displayName || 'LifeOS User'}</Text>
        <Text className="text-mutedText text-sm mt-0.5">{user.email}</Text>

        {/* Productivity Points Badge */}
        <View className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mt-4">
          <Text className="text-primary font-bold text-xs uppercase tracking-wider">Level Score: {user.productivityScore || 0} XP</Text>
        </View>

      </GlassCard>

      {/* Interest Chips List */}
      <Text className="text-white text-base font-bold mb-3">Interests Vectors</Text>
      <GlassCard className="mb-6 p-4">
        <View className="flex-row flex-wrap">
          {user.interests && user.interests.length > 0 ? (
            user.interests.map(item => (
              <View key={item} className="bg-white/5 border border-glassBorder rounded-xl px-3 py-1.5 m-1">
                <Text className="text-white text-xs font-semibold">{item}</Text>
              </View>
            ))
          ) : (
            <Text className="text-mutedText text-center py-2">No interests registered.</Text>
          )}
        </View>
      </GlassCard>

      {/* Preferences Toggles List */}
      <Text className="text-white text-base font-bold mb-3">Preferences</Text>
      <GlassCard className="mb-6 p-4">
        
        {/* Alerts Switch */}
        <View className="flex-row justify-between items-center border-b border-glassBorder/40 pb-4 mb-4">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-semibold">System Reminders</Text>
            <Text className="text-mutedText text-xs">Enable scheduled push alert notifications</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleTogglePreference('notificationsEnabled')}
            className={`w-12 h-6 rounded-full p-0.5 justify-center ${user.preferences?.notificationsEnabled ? 'bg-primary' : 'bg-white/10'}`}
          >
            <View className={`w-5 h-5 rounded-full bg-background ${user.preferences?.notificationsEnabled ? 'align-end ml-6' : 'align-start'}`} />
          </TouchableOpacity>
        </View>

        {/* AI Switch */}
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-semibold">Gemini Intelligence Integration</Text>
            <Text className="text-mutedText text-xs">Authorize AI context memory search logs</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleTogglePreference('aiAssistantEnabled')}
            className={`w-12 h-6 rounded-full p-0.5 justify-center ${user.preferences?.aiAssistantEnabled ? 'bg-primary' : 'bg-white/10'}`}
          >
            <View className={`w-5 h-5 rounded-full bg-background ${user.preferences?.aiAssistantEnabled ? 'align-end ml-6' : 'align-start'}`} />
          </TouchableOpacity>
        </View>

      </GlassCard>

      {/* Logout button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500/10 border border-red-500/30 rounded-xl py-3.5 items-center mb-12"
      >
        <Text className="text-red-500 font-bold text-base">Terminate Session</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
