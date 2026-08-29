import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('arise-onboarding-done').then(val => {
      setShowOnboarding(val !== 'true');
    });
  }, []);

  // Still loading
  if (showOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        {showOnboarding ? (
          <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        )}
      </View>
    </ErrorBoundary>
  );
}
