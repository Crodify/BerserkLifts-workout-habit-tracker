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
import { useStore } from '@/store';

function AppContent() {
  const { session, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setShowOnboarding(false);
      return;
    }
    // Check Supabase for existing profile
    import('@/lib/supabase').then(({ supabase }) => {
      supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            // Returning user — skip onboarding, pull data in background
            setShowOnboarding(false);
            import('@/lib/syncUtils').then(({ pullAllFromSupabase }) => {
              pullAllFromSupabase(session.user.id).then(pulled => {
                if (pulled.profile) useStore.setState({ profile: pulled.profile });
                if (pulled.workouts.length > 0) useStore.setState({ workouts: pulled.workouts });
                if (pulled.habits.length > 0) useStore.setState({ habits: pulled.habits });
                if (pulled.routines.length > 0) useStore.setState({ routines: pulled.routines });
                if (pulled.folders.length > 0) useStore.setState({ folders: pulled.folders });
                if (pulled.settings) useStore.setState({ settings: pulled.settings });
              });
            });
          } else {
            setShowOnboarding(true);
          }
        });
    });
  }, [session]);

  // Loading state — only wait for auth, not Supabase sync
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

  // Main app — show immediately, data loads in background
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
