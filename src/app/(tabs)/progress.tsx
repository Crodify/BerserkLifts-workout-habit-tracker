import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatNumber } from '@/utils';

export default function ProgressScreen() {
  const { workouts, personalRecords, bodyMeasurements, profile } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress</Text>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}kg</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>
      </View>

      {/* Personal Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Records</Text>
        {personalRecords.length === 0 ? (
          <Text style={styles.emptyText}>No records yet. Complete workouts to set PRs!</Text>
        ) : (
          personalRecords.map((pr, idx) => (
            <View key={idx} style={styles.prCard}>
              <Text style={styles.prExercise}>{pr.exerciseId}</Text>
              <Text style={styles.prValue}>{pr.weight}kg x {pr.reps} reps</Text>
              <Text style={styles.prDate}>{formatDate(pr.date)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Workout History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout History</Text>
        {workouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts yet. Start training!</Text>
        ) : (
          workouts.slice(0, 10).map((workout) => (
            <View key={workout.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyName}>{workout.name}</Text>
                <Text style={styles.historyDate}>{formatDate(workout.date)}</Text>
              </View>
              <View style={styles.historyStats}>
                <Text style={styles.historyStat}>{workout.exercises.length} exercises</Text>
                <Text style={styles.historyStat}>{formatNumber(workout.totalVolume)}kg</Text>
                <Text style={styles.historyStat}>{workout.duration}min</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Body Measurements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Measurements</Text>
        {bodyMeasurements.length === 0 ? (
          <Text style={styles.emptyText}>No measurements yet. Track your progress!</Text>
        ) : (
          bodyMeasurements.slice(-5).reverse().map((m, idx) => (
            <View key={idx} style={styles.measurementCard}>
              <Text style={styles.measurementDate}>{formatDate(m.date)}</Text>
              <View style={styles.measurementRow}>
                {m.weight && <Text style={styles.measurement}>Weight: {m.weight}kg</Text>}
                {m.chest && <Text style={styles.measurement}>Chest: {m.chest}cm</Text>}
                {m.arms && <Text style={styles.measurement}>Arms: {m.arms}cm</Text>}
                {m.waist && <Text style={styles.measurement}>Waist: {m.waist}cm</Text>}
              </View>
            </View>
          ))
        )}
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
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  prCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  prExercise: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  prValue: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  prDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  historyName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  historyDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyStat: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  measurementCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  measurementDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  measurementRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  measurement: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
});
