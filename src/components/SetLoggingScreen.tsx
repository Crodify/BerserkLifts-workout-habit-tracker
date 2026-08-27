import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface SetLoggingScreenProps {
  selectedMuscles: string[];
  onSubmit: (data: { exerciseName: string; sets: number; reps: number; weight: number }) => void;
  onBack: () => void;
}

export function SetLoggingScreen({ selectedMuscles, onSubmit, onBack }: SetLoggingScreenProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('50');

  const handleSubmit = () => {
    if (!exerciseName.trim()) {
      alert('Please enter exercise name');
      return;
    }
    onSubmit({
      exerciseName,
      sets: parseInt(sets) || 1,
      reps: parseInt(reps) || 1,
      weight: parseFloat(weight) || 0,
    });
  };

  const calculateVolume = () => {
    const vol = (parseInt(sets) || 0) * (parseInt(reps) || 0) * (parseFloat(weight) || 0);
    return vol.toFixed(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>STEP 2 OF 2</Text>
        <Text style={styles.title}>LOG SETS</Text>
      </View>

      <View style={styles.musclesDisplay}>
        <Text style={styles.musclesLabel}>MUSCLES:</Text>
        <View style={styles.musclesTags}>
          {selectedMuscles.map((muscle) => (
            <View key={muscle} style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>{muscle.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>EXERCISE NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Bench Press"
            placeholderTextColor={Colors.textMuted}
            value={exerciseName}
            onChangeText={setExerciseName}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={styles.label}>SETS</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity onPress={() => setSets(Math.max(1, parseInt(sets) - 1).toString())} style={styles.numberButton}>
                <Text style={styles.numberButtonText}>−</Text>
              </TouchableOpacity>
              <TextInput style={styles.numberValue} value={sets} onChangeText={setSets} keyboardType="number-pad" />
              <TouchableOpacity onPress={() => setSets((parseInt(sets) + 1).toString())} style={styles.numberButton}>
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={styles.label}>REPS</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity onPress={() => setReps(Math.max(1, parseInt(reps) - 1).toString())} style={styles.numberButton}>
                <Text style={styles.numberButtonText}>−</Text>
              </TouchableOpacity>
              <TextInput style={styles.numberValue} value={reps} onChangeText={setReps} keyboardType="number-pad" />
              <TouchableOpacity onPress={() => setReps((parseInt(reps) + 1).toString())} style={styles.numberButton}>
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>WEIGHT</Text>
            <TextInput
              style={styles.input}
              placeholder="50"
              placeholderTextColor={Colors.textMuted}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.volumeDisplay}>
        <Text style={styles.volumeLabel}>TOTAL VOLUME</Text>
        <Text style={styles.volumeValue}>{calculateVolume()} kg</Text>
      </View>

      <TouchableOpacity
        style={styles.logButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Log Workout Button"
        testID="logWorkoutButton"
      >
        <Text style={styles.logButtonIcon}>⚡</Text>
        <Text style={styles.logButtonText}>LOG WORKOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: Spacing.lg },
  headerContainer: { marginBottom: Spacing.xl },
  backButton: { marginBottom: Spacing.md },
  backButtonText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  stepText: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: Spacing.xs },
  title: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  musclesDisplay: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  musclesLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: Spacing.sm },
  musclesTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  muscleTag: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  muscleTagText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.xs },
  formContainer: { marginBottom: Spacing.lg },
  formGroup: { marginBottom: Spacing.lg },
  label: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  numberInput: { flexDirection: 'row', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, alignItems: 'center' },
  numberButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  numberButtonText: { fontWeight: '900', fontSize: FontSize.md, color: Colors.primary },
  numberValue: { flex: 1, textAlign: 'center', color: Colors.text, fontSize: FontSize.md, fontWeight: '800' },
  volumeDisplay: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  volumeLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.xs },
  volumeValue: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.primary },
  logButton: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  logButtonIcon: { fontSize: 24 },
  logButtonText: { color: Colors.white, fontWeight: '900', fontSize: FontSize.md, letterSpacing: 1 },
});
