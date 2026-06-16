import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassInput } from '../../components/GlassInput';
import { GlassButton } from '../../components/GlassButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch (err) {
      console.log('Login action failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0A0A0A' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8">
          <Text className="text-primary text-4xl font-extrabold tracking-widest mb-2">LifeOS AI</Text>
          <Text className="text-mutedText text-sm text-center">Your AI-Powered Personal Operating System</Text>
        </View>

        <GlassCard className="p-6">
          <Text className="text-white text-2xl font-bold mb-6 text-center">Welcome Back</Text>

          {error && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            </View>
          )}

          <GlassInput
            label="Email Address"
            placeholder="enter your email..."
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <GlassInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError();
            }}
            secureTextEntry
          />

          <GlassButton
            title="Authenticate"
            onPress={handleLogin}
            isLoading={isLoading}
            className="mt-4"
          />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-mutedText text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-primary font-semibold text-sm">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
