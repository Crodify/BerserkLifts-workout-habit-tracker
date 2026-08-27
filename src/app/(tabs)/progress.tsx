import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";
import { useStore } from "@/store";
import { formatNumber } from "@/utils";

export default function ProgressScreen() {
  const { workouts, profile } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.titlePrefix}>STATS</Text>
        <Text style={styles.greeting}>PROGRESS</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>WORKOUTS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}</Text>
            <Text style={styles.statLabel}>VOLUME</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.currentStreak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.longestStreak}</Text>
            <Text style={styles.statLabel}>BEST</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT WORKOUTS</Text>
        {workouts && workouts.length > 0 ? (
          workouts.slice(0, 10).map((w) => {
            const exerciseNames = w.exercises ? w.exercises.map((e) => e.exerciseName).join(', ') : '';
            const totalSets = w.exercises ? w.exercises.reduce((acc, e) => acc + (e.sets ? e.sets.length : 0), 0) : 0;
            return (
              <View key={w.id} style={styles.workoutRow}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.exerciseName}>{w.name || 'Workout'}</Text>
                  <Text style={styles.workoutStats}>{exerciseNames || `${totalSets} sets`} • {w.totalVolume}kg</Text>
                </View>
                {w.xpGained ? <Text style={styles.xpGained}>+{w.xpGained} XP</Text> : null}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No workouts logged yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  headerContainer: { marginBottom: Spacing.lg },
  titlePrefix: { fontSize: 10, fontWeight: "800", color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  greeting: { fontSize: FontSize.title, fontWeight: "900", color: Colors.text, letterSpacing: 1 },
  statsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.md },
  statItem: { flex: 1, marginHorizontal: Spacing.xs, alignItems: "center" },
  statValue: { fontSize: FontSize.xl, fontWeight: "900", color: Colors.primary, marginBottom: Spacing.xs },
  statLabel: { fontSize: 9, fontWeight: "800", color: Colors.textMuted, letterSpacing: 1, textAlign: "center" },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: "900", color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md },
  workoutRow: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  workoutInfo: { flex: 1 },
  exerciseName: { fontSize: FontSize.md, fontWeight: "800", color: Colors.text, marginBottom: Spacing.xs },
  workoutStats: { fontSize: FontSize.xs, color: Colors.textSecondary },
  xpGained: { fontSize: FontSize.sm, fontWeight: "800", color: Colors.primary, marginLeft: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.lg },
});