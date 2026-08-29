import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatNumber } from '@/utils';
import { getRankColor } from '@/constants/rpg';
import { SettingsScreen } from '@/components/SettingsScreen';
import { WorkoutDetailScreen } from '@/components/WorkoutDetailScreen';

export default function ProfileScreen() {
  const { profile, workouts, exercises } = useStore();
  const rankColor = getRankColor(profile.rank);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const recentWorkouts = workouts.slice(0, 10);

  // Workout detail view
  if (selectedWorkoutId) {
    return (
      <WorkoutDetailScreen
        workoutId={selectedWorkoutId}
        visible={true}
        onClose={() => setSelectedWorkoutId(null)}
      />
    );
  }

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
      {/* Profile Header with Settings Icon */}
      <View style={st.header}>
        <View style={st.headerTop}>
          <View style={st.headerSpacer} />
          <TouchableOpacity style={st.settingsBtn} onPress={() => setShowSettings(true)}>
            <Text style={st.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={[st.avatar, { borderColor: rankColor }]}>
          <Text style={st.avatarText}>{profile.avatar}</Text>
        </View>
        <Text style={st.name}>{profile.name}</Text>
        <View style={st.rankRow}>
          <View style={[st.rankBadge, { backgroundColor: rankColor + '20', borderColor: rankColor }]}>
            <Text style={[st.rankText, { color: rankColor }]}>{profile.rank}</Text>
          </View>
          <Text style={st.levelText}>Level {profile.level}</Text>
        </View>
        <Text style={st.joinDate}>Member since {formatDate(profile.joinDate)}</Text>
      </View>

      {/* XP Progress */}
      <View style={st.xpCard}>
        <View style={st.xpHeader}>
          <Text style={st.xpLabel}>EXPERIENCE</Text>
          <Text style={st.xpValue}>{profile.xp} XP</Text>
        </View>
        <View style={st.xpTrack}>
          <View style={[st.xpFill, { width: `${Math.min((profile.xp % 1000) / 10, 100)}%` }]} />
        </View>
        <Text style={st.xpSub}>{1000 - (profile.xp % 1000)} XP to next level</Text>
      </View>

      {/* Stats Card */}
      <View style={st.statsCard}>
        <View style={st.statItem}>
          <Text style={st.statValue}>{profile.totalWorkouts}</Text>
          <Text style={st.statLabel}>Workouts</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statItem}>
          <Text style={st.statValue}>{formatNumber(profile.totalVolume)}</Text>
          <Text style={st.statLabel}>Volume</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statItem}>
          <Text style={st.statValue}>{profile.currentStreak}</Text>
          <Text style={st.statLabel}>Streak</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statItem}>
          <Text style={st.statValue}>{profile.totalPRs}</Text>
          <Text style={st.statLabel}>PRs</Text>
        </View>
      </View>

      {/* Recent Workouts */}
      <View style={st.sectionHeader}>
        <Text style={st.sectionTitle}>RECENT WORKOUTS</Text>
        <Text style={st.sectionCount}>{workouts.length} total</Text>
      </View>

      {recentWorkouts.length === 0 ? (
        <View style={st.emptyCard}>
          <Text style={st.emptyIcon}>📋</Text>
          <Text style={st.emptyText}>No workouts yet</Text>
          <Text style={st.emptySub}>Start a workout to see it here</Text>
        </View>
      ) : (
        recentWorkouts.map(w => {
          const completedSets = w.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
          const muscleGroups = [...new Set(w.exercises.map(we => {
            const exDef = exercises.find(e => e.id === we.exerciseId);
            return exDef?.muscle;
          }).filter(Boolean))];

          return (
            <TouchableOpacity
              key={w.id}
              style={st.workoutCard}
              onPress={() => setSelectedWorkoutId(w.id)}
              activeOpacity={0.7}
            >
              {/* Workout Name & Date */}
              <View style={st.wcTop}>
                <View style={st.wcTopLeft}>
                  <Text style={st.wcName}>{w.name}</Text>
                  <Text style={st.wcDate}>{formatDate(w.date)}</Text>
                </View>
                <View style={st.wcTopRight}>
                  {w.xpGained ? <Text style={st.wcXP}>+{w.xpGained} XP</Text> : null}
                  <Text style={st.wcArrow}>›</Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={st.wcStats}>
                <View style={st.wcStat}>
                  <Text style={st.wcStatIcon}>🏋️</Text>
                  <Text style={st.wcStatVal}>{w.exercises.length}</Text>
                  <Text style={st.wcStatLbl}>exercises</Text>
                </View>
                <View style={st.wcStatDivider} />
                <View style={st.wcStat}>
                  <Text style={st.wcStatIcon}>📊</Text>
                  <Text style={st.wcStatVal}>{completedSets}</Text>
                  <Text style={st.wcStatLbl}>sets</Text>
                </View>
                <View style={st.wcStatDivider} />
                <View style={st.wcStat}>
                  <Text style={st.wcStatIcon}>⚡</Text>
                  <Text style={st.wcStatVal}>{(w.totalVolume / 1000).toFixed(1)}k</Text>
                  <Text style={st.wcStatLbl}>kg vol</Text>
                </View>
                <View style={st.wcStatDivider} />
                <View style={st.wcStat}>
                  <Text style={st.wcStatIcon}>⏱️</Text>
                  <Text style={st.wcStatVal}>{Math.floor(w.duration / 60)}m</Text>
                  <Text style={st.wcStatLbl}>duration</Text>
                </View>
              </View>

              {/* Muscle Groups */}
              {muscleGroups.length > 0 && (
                <View style={st.wcMuscles}>
                  {muscleGroups.map(m => (
                    <View key={m} style={st.wcMuscleChip}>
                      <Text style={st.wcMuscleTxt}>{m}</Text>
                    </View>
                  ))}
                  {w.prsHit && w.prsHit.length > 0 && (
                    <View style={st.wcPRChip}>
                      <Text style={st.wcPRTxt}>🏆 {w.prsHit.length} PR</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Exercise Preview */}
              <View style={st.wcExercises}>
                {w.exercises.slice(0, 3).map(we => (
                  <Text key={we.id} style={st.wcExName} numberOfLines={1}>
                    · {we.exerciseName}
                  </Text>
                ))}
                {w.exercises.length > 3 && (
                  <Text style={st.wcExMore}>+{w.exercises.length - 3} more</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <View style={{ height: 40 }} />
      <SettingsScreen visible={showSettings} onClose={() => setShowSettings(false)} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },

  // Header
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  headerTop: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, paddingHorizontal: Spacing.xs },
  headerSpacer: { width: 40 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  settingsIcon: { fontSize: 20 },

  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md, borderWidth: 3 },
  avatarText: { fontSize: 40 },
  name: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.text },
  rankRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.sm },
  rankBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, borderWidth: 1 },
  rankText: { fontSize: FontSize.xs, fontWeight: '900', letterSpacing: 1 },
  levelText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  joinDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

  // XP Card
  xpCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  xpLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2 },
  xpValue: { fontSize: FontSize.md, fontWeight: '900', color: Colors.primary },
  xpTrack: { height: 8, backgroundColor: Colors.surfaceLight, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.xs },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  xpSub: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right' },

  // Stats
  statsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: Spacing.xs, fontWeight: '600' },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },

  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  sectionCount: { fontSize: FontSize.xs, color: Colors.textMuted },

  // Empty State
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyIcon: { fontSize: 36, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  emptySub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

  // Workout Card (Hevy-style)
  workoutCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  wcTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  wcTopLeft: { flex: 1 },
  wcName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  wcDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  wcTopRight: { alignItems: 'flex-end', gap: 2 },
  wcXP: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  wcArrow: { fontSize: 22, color: Colors.textMuted },

  wcStats: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: Spacing.sm, marginBottom: Spacing.sm },
  wcStat: { flex: 1, alignItems: 'center', gap: 2 },
  wcStatIcon: { fontSize: 12 },
  wcStatVal: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  wcStatLbl: { fontSize: 9, fontWeight: '600', color: Colors.textMuted },
  wcStatDivider: { width: 1, height: 28, backgroundColor: Colors.border },

  wcMuscles: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  wcMuscleChip: { backgroundColor: Colors.primary + '10', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  wcMuscleTxt: { fontSize: 9, fontWeight: '700', color: Colors.primary },
  wcPRChip: { backgroundColor: '#FFD700' + '15', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  wcPRTxt: { fontSize: 9, fontWeight: '700', color: '#FFD700' },

  wcExercises: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  wcExName: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  wcExMore: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic', marginTop: 2 },
});
