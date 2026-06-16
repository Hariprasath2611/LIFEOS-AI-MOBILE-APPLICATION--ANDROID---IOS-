import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassInput } from '../../components/GlassInput';
import { GlassButton } from '../../components/GlassButton';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [valError, setValError] = useState<string | null>(null);
  
  const { signup, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSignup = async () => {
    setValError(null);
    if (!email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setValError('Passwords do not match');
      return;
    }
    try {
      await signup(email, password);
    } catch (err) {
      console.log('Registration failed:', err);
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
          <Text className="text-mutedText text-sm text-center font-medium">Create your second brain ecosystem</Text>
        </View>

        <GlassCard className="p-6">
          <Text className="text-white text-2xl font-bold mb-6 text-center">Create Account</Text>

          {(error || valError) && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <Text className="text-red-500 text-sm text-center">{error || valError}</Text>
            </View>
          )}

          <GlassInput
            label="Email Address"
            placeholder="enter your email..."
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
              setValError(null);
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
              setValError(null);
            }}
            secureTextEntry
          />

          <GlassInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              setValError(null);
            }}
            secureTextEntry
          />

          <GlassButton
            title="Register Profile"
            onPress={handleSignup}
            isLoading={isLoading}
            className="mt-4"
          />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-mutedText text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-semibold text-sm">Log In</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
