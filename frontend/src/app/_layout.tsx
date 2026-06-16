import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { checkAuth, isAuthenticated, user, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Run login/refresh checks on startup
  useEffect(() => {
    checkAuth();
  }, []);

  // Monitor login status and handle navigation transitions
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated) {
      // Direct unauthorized visitors to login screen
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      // If user profile lists no goals/interests, prompt onboarding
      const needsOnboarding = !user?.interests || user.interests.length === 0;

      if (needsOnboarding) {
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)/welcome');
        }
      } else {
        // Logged-in profile, send straight to the dashboard index
        if (inAuthGroup || inOnboardingGroup || segments.length === 0) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [isAuthenticated, user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00FF88" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <Slot />
      <StatusBar style="light" />
    </View>
  );
}
