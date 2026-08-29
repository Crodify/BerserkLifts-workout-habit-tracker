import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress, getRankColor, calculateXPForNextLevel } from '@/constants/rpg';
import { formatNumber } from '@/utils';
import { EmptyState } from '@/components/EmptyState';
import { ChallengesScreen } from '@/components/ChallengesScreen';
import { LevelUpPopup } from '@/components/LevelUpPopup';

const FadeInView = ({ delay, children }: { delay: number; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
};

type LeaderboardTab = 'volume' | 'workouts' | 'streak';

export default function DashboardScreen() {
  const { profile, friends, challenges, updateChallengeScores } = useStore();
  const levelProgress = calculateLevelProgress(profile.xp);
  const xpToNext = calculateXPForNextLevel(profile.xp);
  const [showChallenges, setShowChallenges] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('volume');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);

  const activeChallenges = challenges.filter((c: any) => c.status === 'active');

  // Check for level up after workout
  useEffect(() => {
    const store = useStore.getState() as any;
    if (store._lastWorkoutXP) {
      setLevelUpData(store._lastWorkoutXP);
      setShowLevelUp(true);
      // Clear the flag
      useStore.setState({ _lastWorkoutXP: undefined } as any);
    }
  }, [profile.xp]);

  // Build leaderboard based on tab
  const allFriends = [
    { ...profile, name: 'You', isUser: true },
    ...friends,
  ];

  const sortedFriends = [...allFriends].sort((a, b) => {
    if (leaderboardTab === 'volume') return b.totalVolume - a.totalVolume;
    if (leaderboardTab === 'workouts') return (b as any).totalWorkouts - (a as any).totalWorkouts;
    // streak
    return (b as any).currentStreak - (a as any).currentStreak;
  });

  const hasData = profile.xp > 0 || profile.totalWorkouts > 0;

  // Streak calendar (last 7 days)
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
    const hasWorkout = useStore.getState().workouts.some((w: any) => w.date.split('T')[0] === dateStr);
    return { dayName, hasWorkout, isToday: i === 6 };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!hasData ? (
        <FadeInView delay={0}>
          <EmptyState
            icon='⚔️'
            title='Welcome to BerserkLifts'
            description='Complete your first workout to start your journey and begin leveling up your character.'
            actionLabel='Start Training'
          />
        </FadeInView>
      ) : (
        <>
          {/* Header */}
          <FadeInView delay={0}>
            <View style={styles.headerContainer}>
              <Text style={styles.titlePrefix}>COMMAND CENTER</Text>
              <Text style={styles.greeting}>DASHBOARD</Text>
            </View>
          </FadeInView>

          {/* Rank Card */}
          <FadeInView delay={100}>
            <TouchableOpacity style={styles.rankCard} activeOpacity={0.8}>
              <View style={styles.rankLeft}>
                <Text style={[styles.rankLetter, { color: getRankColor(profile.rank) }]}>{profile.rank}</Text>
                <Text style={styles.levelText}>LVL {profile.level}</Text>
              </View>
              <View style={styles.rankRight}>
                <View style={styles.xpRow}>
                  <Animated.Text style={styles.xpText}>{formatNumber(profile.xp)}</Animated.Text>
                  <Text style={styles.xpLabel}> / XP</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${levelProgress}%` as any }]} />
                </View>
                <Text style={styles.progressText}>{xpToNext} XP to LVL {profile.level + 1}</Text>
              </View>
            </TouchableOpacity>
          </FadeInView>

          {/* Streak Calendar */}
          <FadeInView delay={150}>
            <View style={styles.streakSection}>
              <View style={styles.streakHeader}>
                <Text style={styles.sectionTitle}>THIS WEEK</Text>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeTxt}>🔥 {profile.currentStreak} day streak</Text>
                </View>
              </View>
              <View style={styles.streakRow}>
                {streakDays.map((day, i) => (
                  <View key={i} style={styles.streakDay}>
                    <View style={[
                      styles.streakDot,
                      day.hasWorkout && styles.streakDotActive,
                      day.isToday && styles.streakDotToday,
                    ]}>
                      {day.hasWorkout && <Text style={styles.streakCheck}>✓</Text>}
                    </View>
                    <Text style={[styles.streakDayName, day.isToday && styles.streakDayNameToday]}>{day.dayName}</Text>
                  </View>
                ))}
              </View>
            </View>
          </FadeInView>

          {/* Stats Row */}
          <FadeInView delay={200}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
                <Text style={styles.statLabel}>WORKOUTS</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}<Text style={styles.unitText}>KG</Text></Text>
                <Text style={styles.statLabel}>VOLUME</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.totalPRs}</Text>
                <Text style={styles.statLabel}>PRs</Text>
              </View>
            </View>
          </FadeInView>

          {/* XP Breakdown */}
          <FadeInView delay={250}>
            <View style={styles.xpBreakdownCard}>
              <Text style={styles.sectionTitle}>XP BREAKDOWN</Text>
              <View style={styles.xpBreakdownRow}>
                <View style={styles.xpItem}>
                  <Text style={styles.xpItemIcon}>🏋️</Text>
                  <Text style={styles.xpItemVal}>{profile.totalWorkouts}</Text>
                  <Text style={styles.xpItemLbl}>Workouts</Text>
                  <Text style={styles.xpItemXp}>×{profile.totalWorkouts * 50} XP</Text>
                </View>
                <View style={styles.xpItem}>
                  <Text style={styles.xpItemIcon}>🏆</Text>
                  <Text style={styles.xpItemVal}>{profile.totalPRs}</Text>
                  <Text style={styles.xpItemLbl}>PRs</Text>
                  <Text style={styles.xpItemXp}>×{profile.totalPRs * 100} XP</Text>
                </View>
                <View style={styles.xpItem}>
                  <Text style={styles.xpItemIcon}>🔥</Text>
                  <Text style={styles.xpItemVal}>{profile.longestStreak}</Text>
                  <Text style={styles.xpItemLbl}>Best Streak</Text>
                  <Text style={styles.xpItemXp}>×{profile.longestStreak * 25} XP</Text>
                </View>
              </View>
            </View>
          </FadeInView>

          {/* Leaderboard with Tabs */}
          <FadeInView delay={300}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>LEADERBOARD</Text>
              </View>

              {/* Tab Switcher */}
              <View style={styles.tabRow}>
                {(['volume', 'workouts', 'streak'] as LeaderboardTab[]).map(tab => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, leaderboardTab === tab && styles.tabActive]}
                    onPress={() => setLeaderboardTab(tab)}
                  >
                    <Text style={[styles.tabTxt, leaderboardTab === tab && styles.tabTxtActive]}>
                      {tab === 'volume' ? '📊 VOLUME' : tab === 'workouts' ? '🏋️ WORKOUTS' : '🔥 STREAK'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {sortedFriends.length === 0 ? (
                <EmptyState
                  icon='👥'
                  title='No Competitors Yet'
                  description='Your leaderboard will appear as you and friends complete workouts.'
                />
              ) : (
                sortedFriends.map((friend, index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                  const isUser = 'isUser' in friend && (friend as any).isUser;
                  const value = leaderboardTab === 'volume'
                    ? `${formatNumber(friend.totalVolume)} KG`
                    : leaderboardTab === 'workouts'
                    ? `${(friend as any).totalWorkouts || 0} workouts`
                    : `${(friend as any).currentStreak || 0} days`;

                  return (
                    <View key={friend.id} style={[styles.leaderboardItem, isUser && styles.leaderboardItemYou]}>
                      <Text style={styles.rankPos}>{medal || `#${index + 1}`}</Text>
                      <Text style={styles.friendAvatar}>{friend.avatar}</Text>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name.toUpperCase()}</Text>
                        <Text style={[styles.friendRank, { color: getRankColor(friend.rank) }]}>
                          RANK {friend.rank} · LVL {(friend as any).level || '?'}
                        </Text>
                      </View>
                      <Text style={styles.friendValue}>{value}</Text>
                    </View>
                  );
                })
              )}
            </View>
          </FadeInView>

          {/* Challenges */}
          <FadeInView delay={400}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CHALLENGES</Text>
                <TouchableOpacity onPress={() => setShowChallenges(true)}>
                  <Text style={styles.sectionTag}>VIEW ALL</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.challengeCard} activeOpacity={0.8} onPress={() => setShowChallenges(true)}>
                <View style={styles.challengeLeft}>
                  <Text style={styles.challengeIcon}>🏆</Text>
                  <View>
                    <Text style={styles.challengeTitle}>{activeChallenges.length > 0 ? `${activeChallenges.length} Active Challenge${activeChallenges.length > 1 ? 's' : ''}` : 'Start a Challenge'}</Text>
                    <Text style={styles.challengeSub}>{activeChallenges.length > 0 ? 'Compete with friends' : 'Compete with friends on workout goals'}</Text>
                  </View>
                </View>
                <Text style={styles.challengeArrow}>›</Text>
              </TouchableOpacity>

              {activeChallenges.slice(0, 2).map((c: any) => (
                <TouchableOpacity key={c.id} style={styles.challengeMiniCard} activeOpacity={0.8} onPress={() => setShowChallenges(true)}>
                  <Text style={styles.challengeMiniIcon}>{c.mode === 'workouts' ? '🏋️' : c.mode === 'volume' ? '📊' : c.mode === 'streak' ? '🔥' : '✅'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.challengeMiniName}>{c.name}</Text>
                    <Text style={styles.challengeMiniMode}>{c.mode.charAt(0).toUpperCase() + c.mode.slice(1)}</Text>
                  </View>
                  <Text style={styles.challengeMiniParticipants}>{c.participants.length} joined</Text>
                </TouchableOpacity>
              ))}
            </View>
          </FadeInView>

          <View style={{ height: 40 }} />
        </>
      )}

      <ChallengesScreen visible={showChallenges} onClose={() => setShowChallenges(false)} />

      {/* Level Up Popup */}
      {levelUpData && (
        <LevelUpPopup
          visible={showLevelUp}
          onClose={() => { setShowLevelUp(false); setLevelUpData(null); }}
          xpGained={levelUpData.xpGained}
          breakdown={levelUpData.breakdown}
          leveledUp={levelUpData.leveledUp}
          rankUp={levelUpData.rankUp}
          newLevel={levelUpData.newLevel}
          newRank={levelUpData.newRank}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60, minHeight: '100%' },

  headerContainer: { marginBottom: Spacing.lg },
  titlePrefix: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  greeting: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1 },

  // Rank Card
  rankCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  rankLeft: { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, minWidth: 70 },
  rankLetter: { fontSize: 36, fontWeight: '900' },
  levelText: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, marginTop: 2, letterSpacing: 1 },
  rankRight: { flex: 1, marginLeft: Spacing.lg },
  xpRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.xs },
  xpText: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  xpLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  progressBar: { height: 10, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.xs },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: BorderRadius.full },
  progressText: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, textAlign: 'right', letterSpacing: 0.5 },

  // Streak Calendar
  streakSection: { marginBottom: Spacing.lg },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  streakBadge: { backgroundColor: Colors.warning + '20', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.full },
  streakBadgeTxt: { fontSize: 10, fontWeight: '800', color: Colors.warning },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  streakDay: { alignItems: 'center', gap: 4 },
  streakDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  streakDotActive: { backgroundColor: Colors.success + '30', borderColor: Colors.success },
  streakDotToday: { borderColor: Colors.primary, borderWidth: 2 },
  streakCheck: { fontSize: 14, color: Colors.success, fontWeight: '900' },
  streakDayName: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5 },
  streakDayNameToday: { color: Colors.primary },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  statBox: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, flex: 1, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  unitText: { fontSize: 10, color: Colors.primary, fontWeight: '800' },
  statLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, marginTop: 4, letterSpacing: 1 },

  // XP Breakdown
  xpBreakdownCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  xpBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  xpItem: { alignItems: 'center', flex: 1 },
  xpItemIcon: { fontSize: 20, marginBottom: Spacing.xs },
  xpItemVal: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  xpItemLbl: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, marginTop: 2 },
  xpItemXp: { fontSize: 9, fontWeight: '800', color: Colors.primary, marginTop: 2 },

  // Leaderboard
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  sectionTag: { fontSize: 9, fontWeight: '800', color: Colors.primary, backgroundColor: 'rgba(255, 26, 60, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm, letterSpacing: 1 },

  // Tabs
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: 3, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.primary },
  tabTxt: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5 },
  tabTxtActive: { color: Colors.white },

  leaderboardItem: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  leaderboardItemYou: { backgroundColor: 'rgba(255, 26, 60, 0.15)', borderLeftWidth: 3, borderLeftColor: Colors.primary },
  rankPos: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.primary, width: 32, textAlign: 'center' },
  friendAvatar: { fontSize: 20, marginRight: Spacing.md },
  friendInfo: { flex: 1 },
  friendName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text, letterSpacing: 0.5 },
  friendRank: { fontSize: 9, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  friendValue: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },

  // Challenges
  challengeCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  challengeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  challengeIcon: { fontSize: 28, marginRight: Spacing.md },
  challengeTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  challengeSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  challengeArrow: { fontSize: 22, color: Colors.textMuted },
  challengeMiniCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, padding: Spacing.sm, flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  challengeMiniIcon: { fontSize: 18, marginRight: Spacing.sm },
  challengeMiniName: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.text },
  challengeMiniMode: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, marginTop: 1 },
  challengeMiniParticipants: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
});
