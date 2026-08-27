import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatNumber } from '@/utils';
import { getRankColor } from '@/constants/rpg';

export default function ProfileScreen() {
  const { profile, workouts } = useStore();
  const rankColor = getRankColor(profile.rank);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.avatar}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={[styles.rank, { color: rankColor }]}>
          {profile.rank} Rank • Level {profile.level}
        </Text>
        <Text style={styles.joinDate}>Member since {formatDate(profile.joinDate)}</Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}kg</Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.currentStreak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🎯</Text>
          <Text style={styles.settingsText}>Workout Goals</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>⚖️</Text>
          <Text style={styles.settingsText}>Body Weight Goal</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>📐</Text>
          <Text style={styles.settingsText}>Units (kg/lbs)</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>🎨</Text>
          <Text style={styles.settingsText}>Appearance</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Friends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        
        <TouchableOpacity style={styles.friendsButton}>
          <Text style={styles.friendsButtonText}>View Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {workouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts yet</Text>
        ) : (
          workouts.slice(0, 5).map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
              </View>
              <Text style={styles.workoutVolume}>{formatNumber(workout.totalVolume)}kg</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  rank: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  joinDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
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
  settingsItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  settingsText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  settingsArrow: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
  },
  friendsButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  friendsButtonText: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  workoutItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  workoutDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  workoutVolume: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
