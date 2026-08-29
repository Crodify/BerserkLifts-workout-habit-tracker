import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';
import { SplashLoader } from '@/components/SplashLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        {showSplash && <SplashLoader onFinish={() => setShowSplash(false)} />}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </ErrorBoundary>
  );
}

