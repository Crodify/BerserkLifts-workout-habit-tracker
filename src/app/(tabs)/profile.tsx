import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatNumber } from '@/utils';
import { getRankColor } from '@/constants/rpg';
import { SettingsScreen } from '@/components/SettingsScreen';

export default function ProfileScreen() {
  const { profile, workouts } = useStore();
  const rankColor = getRankColor(profile.rank);
  const [showSettings, setShowSettings] = useState(false);

  const recentWorkouts = workouts.slice(0, 5);

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={st.header}>
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

      {/* Settings */}
      <Text style={st.sectionTitle}>SETTINGS</Text>

      <TouchableOpacity style={st.settingItem} onPress={() => setShowSettings(true)}>
        <Text style={st.settingIcon}>⚖️</Text>
        <Text style={st.settingText}>Weight Unit</Text>
        <Text style={st.settingValue}>{profile.preferredUnit.toUpperCase()}</Text>
        <Text style={st.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={st.settingItem} onPress={() => setShowSettings(true)}>
        <Text style={st.settingIcon}>⏱️</Text>
        <Text style={st.settingText}>Rest Timer</Text>
        <Text style={st.settingValue}>Default</Text>
        <Text style={st.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={st.settingItem} onPress={() => setShowSettings(true)}>
        <Text style={st.settingIcon}>🎯</Text>
        <Text style={st.settingText}>Workout Goals</Text>
        <Text style={st.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={st.settingItem} onPress={() => setShowSettings(true)}>
        <Text style={st.settingIcon}>🎨</Text>
        <Text style={st.settingText}>Appearance</Text>
        <Text style={st.settingValue}>Dark</Text>
        <Text style={st.arrow}>›</Text>
      </TouchableOpacity>

      {/* Recent Workouts */}
      <Text style={st.sectionTitle}>RECENT WORKOUTS</Text>
      {recentWorkouts.length === 0 ? (
        <View style={st.emptyCard}>
          <Text style={st.emptyIcon}>📋</Text>
          <Text style={st.emptyText}>No workouts yet</Text>
        </View>
      ) : (
        recentWorkouts.map(w => (
          <View key={w.id} style={st.workoutRow}>
            <View style={st.workoutLeft}>
              <Text style={st.workoutName}>{w.name}</Text>
              <Text style={st.workoutDate}>{formatDate(w.date)}</Text>
            </View>
            <View style={st.workoutRight}>
              <Text style={st.workoutVol}>{formatNumber(w.totalVolume)}kg</Text>
              {w.xpGained ? <Text style={st.workoutXP}>+{w.xpGained} XP</Text> : null}
            </View>
          </View>
        ))
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

  // Settings
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md, marginTop: Spacing.sm },
  settingItem: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  settingIcon: { fontSize: 20, marginRight: Spacing.md },
  settingText: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  settingValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginRight: Spacing.sm },
  arrow: { fontSize: 22, color: Colors.textMuted },

  // Workouts
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  emptyIcon: { fontSize: 36, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  workoutRow: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  workoutLeft: { flex: 1 },
  workoutName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  workoutDate: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  workoutRight: { alignItems: 'flex-end' },
  workoutVol: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  workoutXP: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary, marginTop: 2 },
});
