import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const GOALS = [
  { id: 'strength', icon: '💪', title: 'Get Stronger', desc: 'Build strength with progressive overload' },
  { id: 'muscle', icon: '🏋️', title: 'Build Muscle', desc: 'Hypertrophy-focused training' },
  { id: 'endurance', icon: '🏃', title: 'Endurance', desc: 'Conditioning and stamina' },
  { id: 'health', icon: '❤️', title: 'General Health', desc: 'Stay active and healthy' },
];

const AVATARS = ['⚔️', '🛡️', '🦅', '🔥', '💀', '🐉', '⚡', '🗡️', '👑', '🎯', '💎', '🦾'];

interface Props {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: Props) {
  const { profile, setWeightUnit } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name === 'Hunter' ? '' : profile.name);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const nextStep = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setStep(s => s + 1);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleFinish = async () => {
    // Update profile name and avatar
    const store = useStore.getState();
    useStore.setState({
      profile: {
        ...store.profile,
        name: name.trim() || 'Hunter',
        avatar: selectedAvatar,
      },
      settings: {
        ...store.settings,
        weightUnit: unit,
      },
    });
    // Mark onboarding as complete
    await AsyncStorage.setItem('arise-onboarding-done', 'true');
    onFinish();
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return selectedGoal !== null;
    return true;
  };

  return (
    <View style={s.container}>
      <Animated.View style={[s.content, { opacity: fadeAnim }]}>
        {/* Step 0: Welcome */}
        {step === 0 && (
          <View style={s.stepContainer}>
            <Text style={s.welcomeIcon}>⚔️</Text>
            <Text style={s.welcomeTitle}>BERSERKLIFTS</Text>
            <Text style={s.welcomeSub}>Workout & Habit Tracker</Text>
            <View style={s.welcomeDivider} />
            <Text style={s.welcomeDesc}>
              Track your workouts, build habits, level up your character, and compete with friends.
            </Text>
            <View style={s.featureList}>
              <View style={s.featureRow}>
                <Text style={s.featureIcon}>🏋️</Text>
                <Text style={s.featureText}>Hevy-style workout tracking</Text>
              </View>
              <View style={s.featureRow}>
                <Text style={s.featureIcon}>✅</Text>
                <Text style={s.featureText}>Daily habit tracking with streaks</Text>
              </View>
              <View style={s.featureRow}>
                <Text style={s.featureIcon}>📈</Text>
                <Text style={s.featureText}>XP system, ranks & leveling</Text>
              </View>
              <View style={s.featureRow}>
                <Text style={s.featureIcon}>🏆</Text>
                <Text style={s.featureText}>Leaderboards & challenges</Text>
              </View>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={nextStep}>
              <Text style={s.primaryBtnTxt}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 1: Profile Name */}
        {step === 1 && (
          <View style={s.stepContainer}>
            <Text style={s.stepLabel}>STEP 1 OF 3</Text>
            <Text style={s.stepTitle}>WHAT'S YOUR NAME?</Text>
            <Text style={s.stepDesc}>This will be shown on your profile and leaderboard</Text>

            {/* Avatar Picker */}
            <Text style={s.fieldLabel}>Choose Avatar</Text>
            <View style={s.avatarGrid}>
              {AVATARS.map(av => (
                <TouchableOpacity
                  key={av}
                  style={[s.avatarOption, selectedAvatar === av && s.avatarOptionActive]}
                  onPress={() => setSelectedAvatar(av)}
                >
                  <Text style={s.avatarEmoji}>{av}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name Input */}
            <Text style={s.fieldLabel}>Your Name</Text>
            <TextInput
              style={s.nameInput}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={20}
            />

            <TouchableOpacity
              style={[s.primaryBtn, !canProceed() && s.primaryBtnDisabled]}
              onPress={nextStep}
              disabled={!canProceed()}
            >
              <Text style={s.primaryBtnTxt}>NEXT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <View style={s.stepContainer}>
            <Text style={s.stepLabel}>STEP 2 OF 3</Text>
            <Text style={s.stepTitle}>WHAT'S YOUR GOAL?</Text>
            <Text style={s.stepDesc}>Pick your primary training goal</Text>

            <View style={s.goalList}>
              {GOALS.map(goal => (
                <TouchableOpacity
                  key={goal.id}
                  style={[s.goalCard, selectedGoal === goal.id && s.goalCardActive]}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <Text style={s.goalIcon}>{goal.icon}</Text>
                  <View style={s.goalInfo}>
                    <Text style={s.goalTitle}>{goal.title}</Text>
                    <Text style={s.goalDesc}>{goal.desc}</Text>
                  </View>
                  {selectedGoal === goal.id && <Text style={s.goalCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, !canProceed() && s.primaryBtnDisabled]}
              onPress={nextStep}
              disabled={!canProceed()}
            >
              <Text style={s.primaryBtnTxt}>NEXT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Unit & Finish */}
        {step === 3 && (
          <View style={s.stepContainer}>
            <Text style={s.stepLabel}>STEP 3 OF 3</Text>
            <Text style={s.stepTitle}>PREFERRED UNIT</Text>
            <Text style={s.stepDesc}>Choose how weights are displayed</Text>

            <View style={s.unitRow}>
              <TouchableOpacity
                style={[s.unitBtn, unit === 'kg' && s.unitBtnActive]}
                onPress={() => setUnit('kg')}
              >
                <Text style={[s.unitBtnTxt, unit === 'kg' && s.unitBtnTxtActive]}>KG</Text>
                <Text style={[s.unitBtnSub, unit === 'kg' && s.unitBtnSubActive]}>Kilograms</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.unitBtn, unit === 'lbs' && s.unitBtnActive]}
                onPress={() => setUnit('lbs')}
              >
                <Text style={[s.unitBtnTxt, unit === 'lbs' && s.unitBtnTxtActive]}>LBS</Text>
                <Text style={[s.unitBtnSub, unit === 'lbs' && s.unitBtnSubActive]}>Pounds</Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={s.summaryCard}>
              <Text style={s.summaryTitle}>YOUR PROFILE</Text>
              <View style={s.summaryRow}>
                <Text style={s.summaryIcon}>{selectedAvatar}</Text>
                <Text style={s.summaryName}>{name.trim() || 'Hunter'}</Text>
              </View>
              <Text style={s.summaryGoal}>
                {GOALS.find(g => g.id === selectedGoal)?.icon} {GOALS.find(g => g.id === selectedGoal)?.title}
              </Text>
              <Text style={s.summaryUnit}>Weights in {unit.toUpperCase()}</Text>
            </View>

            <TouchableOpacity style={s.primaryBtn} onPress={handleFinish}>
              <Text style={s.primaryBtnTxt}>START TRAINING ⚔️</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Progress Dots */}
      <View style={s.dotsRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[s.dot, step === i && s.dotActive, step > i && s.dotDone]} />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center' },
  stepContainer: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg },

  // Welcome
  welcomeIcon: { fontSize: 64, textAlign: 'center', marginBottom: Spacing.lg },
  welcomeTitle: { fontSize: 32, fontWeight: '900', color: Colors.text, textAlign: 'center', letterSpacing: 3 },
  welcomeSub: { fontSize: FontSize.md, fontWeight: '600', color: Colors.primary, textAlign: 'center', marginTop: Spacing.xs },
  welcomeDivider: { width: 40, height: 3, backgroundColor: Colors.primary, borderRadius: 2, alignSelf: 'center', marginVertical: Spacing.lg },
  welcomeDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },

  featureList: { marginBottom: Spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.md },
  featureIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  featureText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, flex: 1 },

  // Steps
  stepLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, textAlign: 'center', marginBottom: Spacing.sm },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.text, textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.xs },
  stepDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xl },

  // Avatar
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.md },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  avatarOption: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.border },
  avatarOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '20' },
  avatarEmoji: { fontSize: 22 },

  // Name
  nameInput: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, borderWidth: 1, borderColor: Colors.border, textAlign: 'center', marginBottom: Spacing.lg },

  // Goals
  goalList: { gap: Spacing.sm, marginBottom: Spacing.lg },
  goalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border },
  goalCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  goalIcon: { fontSize: 28, marginRight: Spacing.md },
  goalInfo: { flex: 1 },
  goalTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  goalDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  goalCheck: { fontSize: 20, fontWeight: '900', color: Colors.primary },

  // Unit
  unitRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  unitBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 2, borderColor: Colors.border },
  unitBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  unitBtnTxt: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textSecondary },
  unitBtnTxtActive: { color: Colors.primary },
  unitBtnSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
  unitBtnSubActive: { color: Colors.primary },

  // Summary
  summaryCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  summaryTitle: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  summaryIcon: { fontSize: 24 },
  summaryName: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  summaryGoal: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary, marginBottom: Spacing.xs },
  summaryUnit: { fontSize: FontSize.xs, color: Colors.textMuted },

  // Buttons
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: Spacing.lg, alignItems: 'center' },
  primaryBtnDisabled: { backgroundColor: Colors.surfaceLight },
  primaryBtnTxt: { fontSize: FontSize.md, fontWeight: '900', color: Colors.white, letterSpacing: 1 },

  // Dots
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingBottom: 50 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  dotDone: { backgroundColor: Colors.primary + '60' },
});
