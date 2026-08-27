import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress, getRankColor } from '@/constants/rpg';
import { formatNumber } from '@/utils';

export default function DashboardScreen() {
  const { profile, friends } = useStore();
  const levelProgress = calculateLevelProgress(profile.xp);

  const allFriends = [
    { ...profile, name: 'You', isUser: true },
    ...friends,
  ].sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Dashboard</Text>

      <View style={styles.rankCard}>
        <View style={styles.rankLeft}>
          <Text style={[styles.rankLetter, { color: Colors.primary }]}>{profile.rank}</Text>
          <Text style={styles.levelText}>Level {profile.level}</Text>
        </View>
        <View style={styles.rankRight}>
          <Text style={styles.xpText}>{formatNumber(profile.xp)} XP</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(levelProgress)}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}kg</Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profile.currentStreak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionSubtitle}>Top performers by volume</Text>
        
        {allFriends.map((friend, index) => (
          <View key={friend.id} style={styles.leaderboardItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.friendAvatar}>{friend.avatar}</Text>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={[styles.friendRank, { color: Colors.accent }]}>
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
    paddingTop: Spacing.xxl * 1.5,
  },
  greeting: {
    fontSize: FontSize.hero,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  rankCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankLeft: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  rankLetter: {
    fontSize: 36,
    fontWeight: '900',
  },
  levelText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    height: 6,
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: Colors.border,
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
    textTransform: 'uppercase',
  },
  friendVolume: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
