import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { WorkoutExercise } from '@/types';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onAddSet: () => void;
  onUpdateSet: (setId: string, weight: number, reps: number) => void;
  onToggleComplete: (setId: string) => void;
  onDeleteExercise: () => void;
}

export function ExerciseCard({
  exercise,
  onAddSet,
  onUpdateSet,
  onToggleComplete,
  onDeleteExercise,
}: ExerciseCardProps) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        <TouchableOpacity onPress={onDeleteExercise} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>

      {exercise.previousBest && (
        <Text style={styles.previousBest}>
          Last: {exercise.previousBest.weight}kg × {exercise.previousBest.reps}
        </Text>
      )}

      <View style={styles.setsContainer}>
        <View style={styles.setHeaderRow}>
          <Text style={styles.setHeaderLabel}>SET</Text>
          <Text style={styles.setHeaderLabel}>KG</Text>
          <Text style={styles.setHeaderLabel}>REPS</Text>
          <Text style={styles.setHeaderLabel}>✓</Text>
        </View>

        {exercise.sets.map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={styles.setNumber}>{index + 1}</Text>
            
            <TextInput
              style={[styles.setInput, set.completed && styles.setInputCompleted]}
              value={set.weight === 0 ? '' : set.weight.toString()}
              onChangeText={(text) => {
                const weight = parseFloat(text) || 0;
                onUpdateSet(set.id, weight, set.reps);
              }}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              editable={!set.completed}
            />

            <TextInput
              style={[styles.setInput, set.completed && styles.setInputCompleted]}
              value={set.reps === 0 ? '' : set.reps.toString()}
              onChangeText={(text) => {
                const reps = parseInt(text) || 0;
                onUpdateSet(set.id, set.weight, reps);
              }}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              editable={!set.completed}
            />

            <TouchableOpacity
              style={[styles.checkButton, set.completed && styles.checkButtonCompleted]}
              onPress={() => onToggleComplete(set.id)}
            >
              <Text style={styles.checkButtonText}>{set.completed ? '✓' : ''}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Text style={styles.addSetButtonText}>+ ADD SET</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exerciseName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, flex: 1 },
  deleteButton: { padding: Spacing.xs },
  deleteText: { fontSize: 18 },
  previousBest: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.md },
  setsContainer: { marginBottom: Spacing.md },
  setHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  setHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  setNumber: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.textSecondary,
    width: 40,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginHorizontal: Spacing.xs,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setInputCompleted: { opacity: 0.6 },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  checkButtonCompleted: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkButtonText: { color: Colors.white, fontSize: 18, fontWeight: '800' },
  addSetButton: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addSetButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
});
