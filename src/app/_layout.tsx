import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppContent() {
  const { session, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('arise-onboarding-done').then(val => {
      setShowOnboarding(val !== 'true');
    });
  }, []);

  // Loading state
  if (loading || showOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Not logged in → Auth screen
  if (!session) {
    return <AuthScreen />;
  }

  // First time after login → Onboarding
  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  // Main app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <StatusBar style="light" />
          <AppContent />
        </View>
      </AuthProvider>
    </ErrorBoundary>
  );
}
