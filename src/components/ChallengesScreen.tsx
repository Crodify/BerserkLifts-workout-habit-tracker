import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { challengeModeLabels } from '@/store/challengeActions';
import { ChallengeMode, Challenge, ChallengeStatus, ChallengeParticipant } from '@/types';
import { formatNumber } from '@/utils';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true);

const MODES: { mode: ChallengeMode; icon: string; desc: string }[] = [
  { mode: 'workouts', icon: '🏋️', desc: 'Most workouts completed' },
  { mode: 'volume', icon: '📊', desc: 'Highest total volume lifted' },
  { mode: 'streak', icon: '🔥', desc: 'Longest workout streak' },
  { mode: 'habitCompletion', icon: '✅', desc: 'Most habits checked off' },
];

const DURATIONS: { label: string; days: number }[] = [
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ChallengesScreen({ visible, onClose }: Props) {
  const { challenges, friends, profile, workouts, habits, createChallenge, joinChallenge, leaveChallenge, deleteChallenge, updateChallengeScores } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  // Challenge creation state
  const [challengeName, setChallengeName] = useState('');
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>('workouts');
  const [challengeDuration, setChallengeDuration] = useState(7);

  // Update scores on mount
  useEffect(() => {
    if (visible) updateChallengeScores();
  }, [visible]);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const displayChallenges = selectedTab === 'active' ? activeChallenges : completedChallenges;

  const handleCreate = () => {
    if (!challengeName.trim()) return;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challengeDuration);

    createChallenge({
      name: challengeName.trim(),
      mode: challengeMode,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdBy: 'user',
      description: MODES.find(m => m.mode === challengeMode)?.desc || '',
    } as any);

    setChallengeName('');
    setChallengeMode('workouts');
    setChallengeDuration(7);
    setShowCreate(false);
  };

  const getScoreDisplay = (mode: ChallengeMode, score: number) => {
    switch (mode) {
      case 'volume': return `${(score / 1000).toFixed(1)}k kg`;
      case 'streak': return `${score} days`;
      case 'workouts': return `${score}`;
      case 'habitCompletion': return `${score}`;
      default: return String(score);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getProgress = (challenge: Challenge) => {
    const start = new Date(challenge.startDate).getTime();
    const end = new Date(challenge.endDate).getTime();
    const now = Date.now();
    return Math.min(1, Math.max(0, (now - start) / (end - start)));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.headerRow}>
            <Text style={s.title}>CHALLENGES</Text>
            <View style={s.headerRight}>
              <TouchableOpacity style={s.createBtn} onPress={() => setShowCreate(true)}>
                <Text style={s.createBtnTxt}>+ NEW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={s.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={s.tabRow}>
            <TouchableOpacity
              style={[s.tab, selectedTab === 'active' && s.tabActive]}
              onPress={() => setSelectedTab('active')}
            >
              <Text style={[s.tabTxt, selectedTab === 'active' && s.tabTxtActive]}>ACTIVE ({activeChallenges.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, selectedTab === 'completed' && s.tabActive]}
              onPress={() => setSelectedTab('completed')}
            >
              <Text style={[s.tabTxt, selectedTab === 'completed' && s.tabTxtActive]}>COMPLETED ({completedChallenges.length})</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={s.list}>
            {displayChallenges.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={s.emptyIcon}>{selectedTab === 'active' ? '🏆' : '📋'}</Text>
                <Text style={s.emptyTitle}>{selectedTab === 'active' ? 'No active challenges' : 'No completed challenges'}</Text>
                <Text style={s.emptySub}>{selectedTab === 'active' ? 'Create a challenge to compete with friends!' : 'Complete challenges to see them here'}</Text>
              </View>
            ) : (
              displayChallenges.map(challenge => {
                const modeInfo = MODES.find(m => m.mode === challenge.mode);
                const isParticipant = challenge.participants.some(p => p.friendId === 'user');
                const sorted = [...challenge.participants].sort((a, b) => b.score - a.score);
                const userRank = sorted.findIndex(p => p.friendId === 'user') + 1;
                const daysLeft = getDaysRemaining(challenge.endDate);
                const progress = getProgress(challenge);

                return (
                  <View key={challenge.id} style={s.challengeCard}>
                    {/* Challenge Header */}
                    <View style={s.challengeHeader}>
                      <View style={s.challengeLeft}>
                        <Text style={s.challengeIcon}>{modeInfo?.icon}</Text>
                        <View>
                          <Text style={s.challengeName}>{challenge.name}</Text>
                          <Text style={s.challengeMode}>{challengeModeLabels[challenge.mode]}</Text>
                        </View>
                      </View>
                      {challenge.status === 'active' && (
                        <View style={s.daysBadge}>
                          <Text style={s.daysTxt}>{daysLeft}d left</Text>
                        </View>
                      )}
                      {challenge.status === 'completed' && (
                        <View style={s.completedBadge}>
                          <Text style={s.completedTxt}>DONE</Text>
                        </View>
                      )}
                    </View>

                    {/* Progress Bar */}
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
                    </View>

                    {/* Leaderboard */}
                    <View style={s.leaderboard}>
                      {sorted.slice(0, 5).map((p, idx) => {
                        const isUser = p.friendId === 'user';
                        const friend = friends.find(f => f.id === p.friendId);
                        const name = isUser ? 'You' : (friend?.name || 'Unknown');
                        const avatar = isUser ? profile.avatar : (friend?.avatar || '?');
                        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
                        return (
                          <View key={p.friendId} style={[s.lbRow, isUser && s.lbRowUser]}>
                            <Text style={s.lbPos}>{medal || `#${idx + 1}`}</Text>
                            <Text style={s.lbAvatar}>{avatar}</Text>
                            <Text style={[s.lbName, isUser && s.lbNameUser]}>{name}</Text>
                            <Text style={[s.lbScore, isUser && s.lbScoreUser]}>
                              {getScoreDisplay(challenge.mode, p.score)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>

                    {/* Actions */}
                    {challenge.status === 'active' && (
                      <View style={s.challengeActions}>
                        {!isParticipant ? (
                          <TouchableOpacity style={s.joinBtn} onPress={() => joinChallenge(challenge.id)}>
                            <Text style={s.joinBtnTxt}>JOIN CHALLENGE</Text>
                          </TouchableOpacity>
                        ) : (
                          <>
                            {userRank === 1 && challenge.participants.length > 1 && (
                              <View style={s.leadingBadge}>
                                <Text style={s.leadingTxt}>👑 LEADING</Text>
                              </View>
                            )}
                            <TouchableOpacity style={s.leaveBtn} onPress={() => leaveChallenge(challenge.id)}>
                              <Text style={s.leaveBtnTxt}>Leave</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>

        {/* Create Challenge Modal */}
        <Modal visible={showCreate} transparent animationType="fade" onRequestClose={() => setShowCreate(false)}>
          <TouchableOpacity style={s.createOverlay} activeOpacity={1} onPress={() => setShowCreate(false)}>
            <View style={s.createBox} onStartShouldSetResponder={() => true}>
              <Text style={s.createTitle}>NEW CHALLENGE</Text>

              <Text style={s.inputLabel}>NAME</Text>
              <TextInput
                style={s.input}
                value={challengeName}
                onChangeText={setChallengeName}
                placeholder="e.g. Week of Gains"
                placeholderTextColor={Colors.textMuted}
                maxLength={40}
                autoFocus
              />

              <Text style={s.inputLabel}>TYPE</Text>
              <View style={s.modeGrid}>
                {MODES.map(m => (
                  <TouchableOpacity
                    key={m.mode}
                    style={[s.modeBtn, challengeMode === m.mode && s.modeBtnActive]}
                    onPress={() => setChallengeMode(m.mode)}
                  >
                    <Text style={s.modeIcon}>{m.icon}</Text>
                    <Text style={[s.modeTxt, challengeMode === m.mode && s.modeTxtActive]}>{m.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.inputLabel}>DURATION</Text>
              <View style={s.durRow}>
                {DURATIONS.map(d => (
                  <TouchableOpacity
                    key={d.days}
                    style={[s.durBtn, challengeDuration === d.days && s.durBtnActive]}
                    onPress={() => setChallengeDuration(d.days)}
                  >
                    <Text style={[s.durTxt, challengeDuration === d.days && s.durTxtActive]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.createBtnRow}>
                <TouchableOpacity style={s.createCancelBtn} onPress={() => setShowCreate(false)}>
                  <Text style={s.createCancelTxt}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.createSubmitBtn, !challengeName.trim() && { opacity: 0.4 }]}
                  onPress={handleCreate}
                  disabled={!challengeName.trim()}
                >
                  <Text style={s.createSubmitTxt}>CREATE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.lg, paddingBottom: 20, maxHeight: '90%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  createBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  createBtnTxt: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  closeBtn: { fontSize: 20, color: Colors.textSecondary, fontWeight: '800' },

  // Tabs
  tabRow: { flexDirection: 'row', marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: 3 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.primary },
  tabTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
  tabTxtActive: { color: Colors.white },

  list: { flex: 1 },

  // Empty
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },

  // Challenge Card
  challengeCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  challengeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  challengeIcon: { fontSize: 28, marginRight: Spacing.md },
  challengeName: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text },
  challengeMode: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary, marginTop: 2 },
  daysBadge: { backgroundColor: Colors.warningSubtle, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  daysTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.warning },
  completedBadge: { backgroundColor: Colors.successSubtle, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  completedTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.success },

  // Progress
  progressTrack: { height: 4, backgroundColor: Colors.surfaceLight, borderRadius: 2, overflow: 'hidden', marginBottom: Spacing.md },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },

  // Leaderboard
  leaderboard: { marginBottom: Spacing.sm },
  lbRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.sm, marginBottom: 2 },
  lbRowUser: { backgroundColor: Colors.primarySubtle },
  lbPos: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.textMuted, width: 30 },
  lbAvatar: { fontSize: 16, marginRight: Spacing.sm },
  lbName: { flex: 1, fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  lbNameUser: { color: Colors.text, fontWeight: '800' },
  lbScore: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textMuted },
  lbScoreUser: { color: Colors.primary },

  // Actions
  challengeActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  joinBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm },
  joinBtnTxt: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  leadingBadge: { backgroundColor: Colors.accentSubtle, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  leadingTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.accent },
  leaveBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  leaveBtnTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },

  // Create Modal
  createOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  createBox: { backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: Colors.border },
  createTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.lg, textAlign: 'center' },
  inputLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  modeGrid: { gap: Spacing.sm },
  modeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  modeBtnActive: { backgroundColor: Colors.primarySubtle, borderColor: Colors.primary },
  modeIcon: { fontSize: 20, marginRight: Spacing.md },
  modeTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  modeTxtActive: { color: Colors.primary },
  durRow: { flexDirection: 'row', gap: Spacing.sm },
  durBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: BorderRadius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  durBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  durTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  durTxtActive: { color: Colors.white },
  createBtnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  createCancelBtn: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, alignItems: 'center' },
  createCancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  createSubmitBtn: { flex: 2, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  createSubmitTxt: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
});
