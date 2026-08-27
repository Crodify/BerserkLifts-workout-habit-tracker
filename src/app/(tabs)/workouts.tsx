import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { LogWorkoutFlow } from '@/components/LogWorkoutFlow';

export default function WorkoutsScreen() {
  const { exercises, profile } = useStore();
  const [logWorkoutVisible, setLogWorkoutVisible] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.titlePrefix}>TRAINING</Text>
          <Text style={styles.greeting}>WORKOUTS</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.currentStreak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round(profile.totalVolume / 1000)}k</Text>
            <Text style={styles.statLabel}>VOLUME</Text>
          </View>
        </View>

        {/* Common Exercises Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMMON EXERCISES</Text>
          {exercises.slice(0, 5).map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={`Exercise: ${exercise.name}`}
              testID={`exercise-${exercise.id}`}
            >
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseInfo}>{exercise.muscle} • {exercise.equipment}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setLogWorkoutVisible(true)}
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Log Workout Floating Button"
        accessibilityRole="button"
        testID="logWorkoutFAB"
      >
        <Text style={styles.fabIcon}>⚡</Text>
        <Text style={styles.fabText}>LOG</Text>
      </TouchableOpacity>

      {/* Log Workout Modal */}
      <Modal
        visible={logWorkoutVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLogWorkoutVisible(false)}
      >
        <LogWorkoutFlow
          visible={logWorkoutVisible}
          onClose={() => setLogWorkoutVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  headerContainer: { marginBottom: Spacing.lg },
  titlePrefix: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  greeting: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl, gap: Spacing.sm },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary, marginBottom: Spacing.xs },
  statLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md },
  exerciseCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  exerciseContent: { flex: 1 },
  exerciseName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  exerciseInfo: { fontSize: FontSize.xs, color: Colors.textSecondary },
  arrow: { fontSize: FontSize.lg, color: Colors.primary, fontWeight: '900' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: Colors.primary, borderRadius: 60, width: 70, height: 70, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 4, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabIcon: { fontSize: 28 },
  fabText: { fontSize: 10, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
});
