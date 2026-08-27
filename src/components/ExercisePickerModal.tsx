import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

interface ExercisePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ExercisePickerModal({ visible, onClose }: ExercisePickerModalProps) {
  const { exercises, addExerciseToWorkout } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');

  const muscles = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || exercise.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleSelectExercise = (exerciseId: string) => {
    addExerciseToWorkout(exerciseId);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ADD EXERCISE</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.muscleFilter}
          contentContainerStyle={styles.muscleFilterContent}
        >
          {muscles.map(muscle => (
            <TouchableOpacity
              key={muscle}
              style={[
                styles.muscleTag,
                selectedMuscle === muscle && styles.muscleTagActive,
              ]}
              onPress={() => setSelectedMuscle(muscle)}
            >
              <Text
                style={[
                  styles.muscleTagText,
                  selectedMuscle === muscle && styles.muscleTagTextActive,
                ]}
              >
                {muscle.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.exerciseList} contentContainerStyle={styles.exerciseListContent}>
          {filteredExercises.map(exercise => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => handleSelectExercise(exercise.id)}
            >
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.muscle} • {exercise.equipment}
                </Text>
              </View>
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          ))}

          {filteredExercises.length === 0 && (
            <Text style={styles.emptyText}>No exercises found</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: '800' },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  searchContainer: { padding: Spacing.lg },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  muscleFilter: { maxHeight: 50, marginBottom: Spacing.md },
  muscleFilterContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  muscleTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  muscleTagActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  muscleTagText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
  muscleTagTextActive: { color: Colors.white },
  exerciseList: { flex: 1 },
  exerciseListContent: { padding: Spacing.lg },
  exerciseItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  exerciseDetails: { fontSize: FontSize.xs, color: Colors.textSecondary },
  addIcon: { fontSize: 24, color: Colors.primary, fontWeight: '800' },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
