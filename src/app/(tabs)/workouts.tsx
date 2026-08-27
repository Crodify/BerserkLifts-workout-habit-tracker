import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

export default function WorkoutsScreen() {
  const { routines, exercises } = useStore();

  const getExerciseName = (id: string) => {
    return exercises.find((e) => e.id === id)?.name || 'Unknown';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Workouts</Text>

      {/* Empty Workout Button */}
      <TouchableOpacity style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>+ Empty Workout</Text>
        <Text style={styles.emptyButtonSubtext}>Start without a template</Text>
      </TouchableOpacity>

      {/* Routines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Workouts</Text>
        
        {routines.map((routine) => (
          <TouchableOpacity key={routine.id} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Text style={styles.routineName}>{routine.name}</Text>
              <Text style={styles.routineCount}>
                {routine.exercises.length} exercises
              </Text>
            </View>
            
            <View style={styles.exerciseList}>
              {routine.exercises.slice(0, 3).map((ex, idx) => (
                <Text key={idx} style={styles.exerciseName}>
                  {getExerciseName(ex.exerciseId)} - {ex.targetSets}x{ex.targetReps}
                </Text>
              ))}
              {routine.exercises.length > 3 && (
                <Text style={styles.moreText}>
                  +{routine.exercises.length - 3} more
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>START</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exercise Library */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercise Library</Text>
        <Text style={styles.sectionSubtitle}>{exercises.length} exercises</Text>
        
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View>
              <Text style={styles.exerciseItemName}>{exercise.name}</Text>
              <Text style={styles.exerciseItemMuscle}>{exercise.muscle}</Text>
            </View>
            <Text style={styles.exerciseItemEquipment}>{exercise.equipment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButtonText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
  emptyButtonSubtext: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  routineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  routineName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  routineCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  exerciseList: {
    marginBottom: Spacing.md,
  },
  exerciseName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  moreText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.white,
  },
  exerciseItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseItemName: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  exerciseItemMuscle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  exerciseItemEquipment: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
