import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { BodyMap } from './BodyMap';

interface MusclePickerScreenProps {
  onNext: (muscles: string[]) => void;
}

export function MusclePickerScreen({ onNext }: MusclePickerScreenProps) {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  const handleMuscleToggle = (muscleId: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscleId)
        ? prev.filter((m) => m !== muscleId)
        : [...prev, muscleId]
    );
  };

  const handleNext = () => {
    if (selectedMuscles.length === 0) {
      alert('Please select at least one muscle group');
      return;
    }
    onNext(selectedMuscles);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.stepText}>STEP 1 OF 2</Text>
        <Text style={styles.title}>MUSCLE GROUPS</Text>
      </View>

      <BodyMap selectedMuscles={selectedMuscles} onMuscleToggle={handleMuscleToggle} />

      <View style={styles.selectedDisplay}>
        <Text style={styles.selectedLabel}>SELECTED:</Text>
        <View style={styles.selectedTags}>
          {selectedMuscles.length > 0 ? (
            selectedMuscles.map((muscle) => (
              <View key={muscle} style={styles.tag}>
                <Text style={styles.tagText}>{muscle.toUpperCase()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noSelection}>None selected yet</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedMuscles.length === 0 && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        activeOpacity={0.8}
        disabled={selectedMuscles.length === 0}
        accessible={true}
        accessibilityLabel="Next button"
        testID="musclePickerNextButton"
      >
        <Text style={styles.nextButtonText}>NEXT</Text>
        <Text style={styles.nextButtonArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: Spacing.lg },
  headerContainer: { marginBottom: Spacing.xl },
  stepText: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: Spacing.xs },
  title: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  selectedDisplay: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginVertical: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  selectedLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: Spacing.sm },
  selectedTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  tagText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.xs, letterSpacing: 0.5 },
  noSelection: { color: Colors.textMuted, fontSize: FontSize.sm, fontStyle: 'italic' },
  nextButton: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.xl },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { color: Colors.white, fontWeight: '900', fontSize: FontSize.md, letterSpacing: 1 },
  nextButtonArrow: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '900' },
});
