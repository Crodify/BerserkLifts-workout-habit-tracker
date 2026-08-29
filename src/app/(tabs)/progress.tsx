import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatNumber } from '@/utils';

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().split('T')[0];
}

function getLast8Weeks(): string[] {
  const weeks: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    weeks.push(start.toISOString().split('T')[0]);
  }
  return weeks;
}

export default function ProgressScreen() {
  const { workouts, profile, personalRecords, exercises } = useStore();

  // Volume per week for chart
  const last8Weeks = useMemo(() => getLast8Weeks(), []);
  const volumeByWeek = useMemo(() => {
    const map: Record<string, number> = {};
    workouts.forEach(w => {
      const wk = getWeekKey(w.date);
      map[wk] = (map[wk] || 0) + w.totalVolume;
    });
    return last8Weeks.map(wk => ({ week: wk, volume: map[wk] || 0 }));
  }, [workouts, last8Weeks]);

  const maxVolume = Math.max(...volumeByWeek.map(v => v.volume), 1);

  // Exercise breakdown by muscle group
  const muscleBreakdown = useMemo(() => {
    const map: Record<string, { count: number; volume: number }> = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        const exDef = exercises.find(e => e.id === ex.exerciseId);
        const muscle = exDef?.muscle || 'Other';
        if (!map[muscle]) map[muscle] = { count: 0, volume: 0 };
        map[muscle].count += ex.sets.filter(s => s.completed).length;
        map[muscle].volume += ex.sets.filter(s => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0);
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 6);
  }, [workouts, exercises]);

  // Personal Records
  const latestPRs = useMemo(() => {
    const prMap: Record<string, typeof personalRecords[0]> = {};
    personalRecords.forEach(pr => {
      const existing = prMap[pr.exerciseId];
      if (!existing || new Date(pr.date) > new Date(existing.date)) {
        prMap[pr.exerciseId] = pr;
      }
    });
    return Object.values(prMap).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [personalRecords]);

  const muscleColors: Record<string, string> = {
    Chest: '#FF2D55', Back: '#0A84FF', Legs: '#30D158', Shoulders: '#FF9F0A',
    Arms: '#BF5AF2', Core: '#FFD60A', Other: '#636366',
  };

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={st.titlePrefix}>STATS</Text>
      <Text style={st.title}>PROGRESS</Text>

      {/* Stats Overview */}
      <View style={st.statsGrid}>
        <View style={st.statCard}>
          <Text style={st.statValue}>{profile.totalWorkouts}</Text>
          <Text style={st.statLabel}>WORKOUTS</Text>
        </View>
        <View style={st.statCard}>
          <Text style={st.statValue}>{formatNumber(profile.totalVolume)}</Text>
          <Text style={st.statLabel}>VOLUME (KG)</Text>
        </View>
        <View style={st.statCard}>
          <Text style={[st.statValue, { color: Colors.warning }]}>🔥 {profile.currentStreak}</Text>
          <Text style={st.statLabel}>STREAK</Text>
        </View>
        <View style={st.statCard}>
          <Text style={[st.statValue, { color: Colors.success }]}>{profile.longestStreak}</Text>
          <Text style={st.statLabel}>BEST STREAK</Text>
        </View>
      </View>

      {/* Volume Chart */}
      <Text style={st.sectionTitle}>WEEKLY VOLUME</Text>
      <View style={st.chartCard}>
        <View style={st.chart}>
          {volumeByWeek.map((item, i) => {
            const height = item.volume > 0 ? Math.max((item.volume / maxVolume) * 120, 4) : 4;
            return (
              <View key={i} style={st.barCol}>
                <Text style={st.barLabel}>
                  {item.volume > 0 ? `${(item.volume / 1000).toFixed(0)}k` : ''}
                </Text>
                <View style={st.barTrack}>
                  <View style={[st.barFill, { height }]} />
                </View>
                <Text style={st.barWeek}>W{i + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Personal Records */}
      <Text style={st.sectionTitle}>PERSONAL RECORDS</Text>
      {latestPRs.length === 0 ? (
        <View style={st.emptyCard}>
          <Text style={st.emptyIcon}>🏆</Text>
          <Text style={st.emptyTitle}>No PRs yet</Text>
          <Text style={st.emptySub}>Complete workouts to set records</Text>
        </View>
      ) : (
        latestPRs.map((pr, i) => {
          const exDef = exercises.find(e => e.id === pr.exerciseId);
          return (
            <View key={i} style={st.prCard}>
              <View style={st.prBadge}>
                <Text style={st.prBadgeTxt}>🏆</Text>
              </View>
              <View style={st.prInfo}>
                <Text style={st.prName}>{exDef?.name || pr.exerciseId}</Text>
                <Text style={st.prDetail}>
                  {pr.type === 'maxWeight' ? `${pr.weight}kg × ${pr.reps} reps` :
                   pr.type === '1rm' ? `Est. 1RM: ${Math.round(pr.value)}kg` :
                   pr.type === 'maxVolume' ? `Volume: ${Math.round(pr.value)}kg` :
                   `${pr.value} reps`}
                </Text>
              </View>
              <Text style={st.prDate}>{new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            </View>
          );
        })
      )}

      {/* Muscle Breakdown */}
      <Text style={st.sectionTitle}>MUSCLE BREAKDOWN</Text>
      {muscleBreakdown.length === 0 ? (
        <View style={st.emptyCard}>
          <Text style={st.emptyIcon}>📊</Text>
          <Text style={st.emptyTitle}>No data yet</Text>
          <Text style={st.emptySub}>Log workouts to see breakdown</Text>
        </View>
      ) : (
        muscleBreakdown.map(([muscle, data], i) => {
          const maxMuscVol = muscleBreakdown[0][1].volume || 1;
          const pct = Math.round((data.volume / maxMuscVol) * 100);
          const color = muscleColors[muscle] || Colors.textSecondary;
          return (
            <View key={i} style={st.muscleRow}>
              <View style={st.muscleInfo}>
                <View style={[st.muscleDot, { backgroundColor: color }]} />
                <Text style={st.muscleName}>{muscle}</Text>
              </View>
              <View style={st.muscleBarTrack}>
                <View style={[st.muscleBarFill, { width: `${pct}%`, backgroundColor: color }]} />
              </View>
              <Text style={st.muscleVol}>{(data.volume / 1000).toFixed(1)}k</Text>
            </View>
          );
        })
      )}

      {/* Recent Workouts */}
      <Text style={st.sectionTitle}>RECENT WORKOUTS</Text>
      {workouts.length === 0 ? (
        <View style={st.emptyCard}>
          <Text style={st.emptyIcon}>📋</Text>
          <Text style={st.emptyTitle}>No workouts yet</Text>
        </View>
      ) : (
        workouts.slice(0, 10).map(w => (
          <View key={w.id} style={st.workoutCard}>
            <View style={st.workoutLeft}>
              <Text style={st.workoutName}>{w.name}</Text>
              <Text style={st.workoutDate}>
                {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                {w.duration ? ` · ${Math.floor(w.duration / 60)}min` : ''}
              </Text>
            </View>
            <View style={st.workoutRight}>
              <Text style={st.workoutVolume}>{(w.totalVolume / 1000).toFixed(1)}k kg</Text>
              {w.xpGained ? <Text style={st.workoutXP}>+{w.xpGained} XP</Text> : null}
            </View>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  titlePrefix: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  title: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.lg },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: { flex: 1, minWidth: '47%', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary, marginBottom: Spacing.xs },
  statLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },

  // Chart
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md, marginTop: Spacing.sm },
  chartCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barCol: { flex: 1, alignItems: 'center' },
  barLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, marginBottom: 4 },
  barTrack: { width: 20, height: 120, justifyContent: 'flex-end', alignItems: 'center' },
  barFill: { width: 20, borderRadius: 4, backgroundColor: Colors.primary },
  barWeek: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, marginTop: 4 },

  // PRs
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  emptyIcon: { fontSize: 36, marginBottom: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  prCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  prBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accentSubtle, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  prBadgeTxt: { fontSize: 18 },
  prInfo: { flex: 1 },
  prName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  prDetail: { fontSize: FontSize.xs, color: Colors.accent, marginTop: 2, fontWeight: '600' },
  prDate: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },

  // Muscle Breakdown
  muscleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  muscleInfo: { flexDirection: 'row', alignItems: 'center', width: 90 },
  muscleDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.sm },
  muscleName: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  muscleBarTrack: { flex: 1, height: 8, backgroundColor: Colors.surfaceLight, borderRadius: 4, overflow: 'hidden', marginHorizontal: Spacing.sm },
  muscleBarFill: { height: '100%', borderRadius: 4 },
  muscleVol: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted, width: 40, textAlign: 'right' },

  // Recent Workouts
  workoutCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  workoutLeft: { flex: 1 },
  workoutName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  workoutDate: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  workoutRight: { alignItems: 'flex-end' },
  workoutVolume: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  workoutXP: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary, marginTop: 2 },
});
