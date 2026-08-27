import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress, getRankColor } from '@/constants/rpg';
import { formatNumber } from '@/utils';

export default function DashboardScreen() {
  const { profile, friends } = useStore();
  const levelProgress = calculateLevelProgress(profile.xp);
  const rankColor = getRankColor(profile.rank);

  const allFriends = [
    { ...profile, name: 'You', isUser: true },
    ...friends,
  ].sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.greeting}>Dashboard</Text>

      {/* Rank Card */}
      <View style={styles.rankCard}>
        <View style={styles.rankLeft}>
          <Text style={[styles.rankLetter, { color: rankColor }]}>{profile.rank}</Text>
          <Text style={styles.levelText}>Level {profile.level}</Text>
        </View>
        <View style={styles.rankRight}>
          <Text style={styles.xpText}>{formatNumber(profile.xp)} XP</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(levelProgress)}%</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}kg</Text>
          <Text style={styles.statLabel}>Total Volume</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Leaderboard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionSubtitle}>Ranked by total weight volume</Text>
        
        {allFriends.map((friend, index) => (
          <View key={friend.id} style={styles.leaderboardItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.friendAvatar}>{friend.avatar}</Text>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={[styles.friendRank, { color: getRankColor(friend.rank) }]}>
                {friend.rank} Rank
              </Text>
            </View>
            <Text style={styles.friendVolume}>{formatNumber(friend.totalVolume)}kg</Text>
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
  greeting: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  rankCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  rankLeft: {
    alignItems: 'center',
  },
  rankLetter: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  rankRight: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  xpText: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flex: 1,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  leaderboardItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rank: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    width: 30,
  },
  friendAvatar: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  friendRank: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  friendVolume: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
