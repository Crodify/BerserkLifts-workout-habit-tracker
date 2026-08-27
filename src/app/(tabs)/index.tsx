import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress, getRankColor } from '@/constants/rpg';
import { formatNumber } from '@/utils';
import { EmptyState } from '@/components/EmptyState';

const FadeInView = ({ delay, children }: { delay: number; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
};

export default function DashboardScreen() {
  const { profile, friends } = useStore();
  const levelProgress = calculateLevelProgress(profile.xp);

  const allFriends = [
    { ...profile, name: 'You', isUser: true },
    ...friends,
  ].sort((a, b) => b.totalVolume - a.totalVolume);

  const hasData = profile.xp > 0 || profile.totalWorkouts > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!hasData ? (
        <FadeInView delay={0}>
          <EmptyState
            icon='?'
            title='Welcome to BerserkLifts'
            description='Complete your first workout to start your journey and begin leveling up your character.'
            actionLabel='Start Training'
          />
        </FadeInView>
      ) : (
        <>
          <FadeInView delay={0}>
            <View style={styles.headerContainer}>
              <Text style={styles.titlePrefix}>COMMAND CENTER</Text>
              <Text style={styles.greeting}>DASHBOARD</Text>
            </View>
          </FadeInView>

          <FadeInView delay={100}>
            <TouchableOpacity style={styles.rankCard} activeOpacity={0.8}>
              <View style={styles.rankLeft}>
                <Text style={[styles.rankLetter, { color: Colors.primary }]}>{profile.rank}</Text>
                <Text style={styles.levelText}>LVL {profile.level}</Text>
              </View>
              <View style={styles.rankRight}>
                <View style={styles.xpRow}>
                  <Animated.Text style={styles.xpText}>{formatNumber(profile.xp)}</Animated.Text>
                  <Text style={styles.xpLabel}> / XP</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: levelProgress + '%' }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(levelProgress)}% COMPLETED</Text>
              </View>
            </TouchableOpacity>
          </FadeInView>

          <FadeInView delay={200}>
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statBox} activeOpacity={0.8}>
                <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
                <Text style={styles.statLabel}>WORKOUTS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBox} activeOpacity={0.8}>
                <Text style={styles.statValue}>{formatNumber(profile.totalVolume)}<Text style={styles.unitText}>KG</Text></Text>
                <Text style={styles.statLabel}>VOLUME</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statBox} activeOpacity={0.8}>
                <Text style={styles.statValue}>{profile.currentStreak}</Text>
                <Text style={styles.statLabel}>STREAK</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>

          <FadeInView delay={300}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>LEADERBOARD</Text>
                <Text style={styles.sectionTag}>VOLUME</Text>
              </View>
              
              {allFriends.length === 0 ? (
                <EmptyState
                  icon='??'
                  title='No Competitors Yet'
                  description='Add friends to compete and climb the leaderboard together.'
                />
              ) : (
                allFriends.map((friend, index) => (
                  <TouchableOpacity key={friend.id} style={[styles.leaderboardItem, friend.isUser && styles.leaderboardItemYou]} activeOpacity={0.8}>
                    <Text style={styles.rank}>#{index + 1}</Text>
                    <Text style={styles.friendAvatar}>{friend.avatar}</Text>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{friend.name.toUpperCase()}</Text>
                      <Text style={[styles.friendRank, { color: getRankColor(friend.rank) }]}>
                        RANK {friend.rank}
                      </Text>
                    </View>
                    <Text style={styles.friendVolume}>{formatNumber(friend.totalVolume)} KG</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </FadeInView>
        </>
      )}
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
    minHeight: '100%',
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  titlePrefix: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  greeting: {
    fontSize: FontSize.title,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  rankCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  rankLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 70,
  },
  rankLetter: {
    fontSize: 36,
    fontWeight: '900',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: 1,
  },
  rankRight: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  xpText: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.text,
  },
  xpLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    textAlign: 'right',
    letterSpacing: 0.5,
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
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.text,
  },
  unitText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    marginTop: 4,
    letterSpacing: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  sectionTag: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: 'rgba(255, 26, 60, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    letterSpacing: 1,
  },
  leaderboardItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leaderboardItemYou: {
    backgroundColor: 'rgba(255, 26, 60, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  rank: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: Colors.primary,
    width: 28,
  },
  friendAvatar: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  friendRank: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  friendVolume: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
});
