import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { MuscleHeatmap } from '@/components/MuscleHeatmap';
import { VolumeChart } from '@/components/VolumeChart';
import { PRBadge } from '@/components/PRBadge';
import { ExerciseStatus } from '@/components/ExerciseStatus';
import { LogWorkoutFlow } from '@/components/LogWorkoutFlow';
import { calculateMuscleVolumes } from '@/utils/volumeCalc';
import { getExerciseStatus } from '@/utils/prDetection';
import { MuscleGroup } from '@/utils/muscleMapping';

export default function WorkoutsScreen() {
  const { workouts, exercises, personalRecords, profile } = useStore();
  const [logWorkoutVisible, setLogWorkoutVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const muscleVolumes = useMemo(() => {
    return calculateMuscleVolumes(workouts, exercises);
  }, [workouts, exercises]);

  const weeklyVolume = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => w.date === dateStr);
      const volume = dayWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
      
      last7Days.push({
        label: date.toLocaleDateString('en', { weekday: 'short' }),
        value: volume,
      });
    }
    
    return last7Days;
  }, [workouts]);

  const recentExercises = useMemo(() => {
    const exerciseMap = new Map();
    
    workouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .forEach(workout => {
        workout.exercises.forEach(we => {
          const exercise = exercises.find(e => e.id === we.exerciseId);
          if (!exercise) return;
          
          if (!exerciseMap.has(exercise.id)) {
            const exercisePRs = personalRecords.filter(pr => pr.exerciseId === exercise.id);
            const status = getExerciseStatus(exercise.id, workouts);
            
            exerciseMap.set(exercise.id, {
              name: exercise.name,
              lastWorkout: workout.date,
              prs: exercisePRs,
              status,
            });
          }
        });
      });
    
    return Array.from(exerciseMap.values()).slice(0, 5);
  }, [workouts, exercises, personalRecords]);

  const handleMusclePress = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.titlePrefix}>ANALYTICS</Text>
          <Text style={styles.greeting}>WORKOUTS</Text>
        </View>

        <View style={styles.section}>
          <MuscleHeatmap 
            muscleVolumes={muscleVolumes} 
            onMusclePress={handleMusclePress}
          />
        </View>

        <View style={styles.section}>
          <VolumeChart
            data={weeklyVolume}
            title="THIS WEEK"
            subtitle="Daily volume in KG"
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>TOTAL</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.currentStreak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.totalPRs}</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT EXERCISES</Text>
          {recentExercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseCard}
              activeOpacity={0.7}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <ExerciseStatus 
                  status={exercise.status.status}
                  trend={exercise.status.trend}
                  sessions={exercise.status.sessions}
                />
              </View>
              
              {exercise.prs.length > 0 && (
                <View style={styles.prRow}>
                  {exercise.prs.slice(0, 3).map((pr, prIndex) => (
                    <PRBadge
                      key={prIndex}
                      type={pr.type === '1rm' ? '1rm' : pr.type === 'maxVolume' ? 'volume' : 'reps'}
                      value={`${pr.value}${pr.type === '1rm' ? ' KG' : ''}`}
                      compact
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setLogWorkoutVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>⚡</Text>
        <Text style={styles.fabText}>LOG</Text>
      </TouchableOpacity>

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
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl, gap: Spacing.sm },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary, marginBottom: Spacing.xs },
  statLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  exerciseCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  exerciseName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, flex: 1 },
  prRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: Colors.primary, borderRadius: 60, width: 70, height: 70, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 4, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabIcon: { fontSize: 28 },
  fabText: { fontSize: 10, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
});
