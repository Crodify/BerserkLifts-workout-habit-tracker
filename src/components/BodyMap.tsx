import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const muscleGroups = [
  { id: 'chest', name: 'Chest', icon: '🫀' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'shoulders', name: 'Shoulders', icon: '💪' },
  { id: 'arms', name: 'Arms', icon: '🦾' },
  { id: 'abs', name: 'Abs', icon: '6️⃣' },
];

interface BodyMapProps {
  selectedMuscles: string[];
  onMuscleToggle: (muscleId: string) => void;
}

export function BodyMap({ selectedMuscles, onMuscleToggle }: BodyMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SELECT MUSCLES</Text>
      <Text style={styles.subtitle}>What did you work today?</Text>

      <View style={styles.muscleGrid}>
        {muscleGroups.map((muscle) => {
          const isSelected = selectedMuscles.includes(muscle.id);
          return (
            <TouchableOpacity
              key={muscle.id}
              style={[
                styles.muscleButton,
                isSelected && styles.muscleButtonSelected,
              ]}
              onPress={() => onMuscleToggle(muscle.id)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={`${muscle.name} muscle group`}
              testID={`muscle-${muscle.id}`}
            >
              <Text style={styles.muscleIcon}>{muscle.icon}</Text>
              <Text
                style={[
                  styles.muscleName,
                  isSelected && styles.muscleNameSelected,
                ]}
              >
                {muscle.name}
              </Text>
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  muscleButton: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  muscleButtonSelected: {
    backgroundColor: 'rgba(255, 26, 60, 0.15)',
    borderColor: Colors.primary,
  },
  muscleIcon: { fontSize: 32, marginBottom: Spacing.sm },
  muscleName: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  muscleNameSelected: { color: Colors.primary },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '900',
  },
});
