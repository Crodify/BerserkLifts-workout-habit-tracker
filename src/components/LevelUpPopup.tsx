import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getRankColor, Rank } from '@/constants/rpg';

interface XPBreakdown {
  base: number;
  exercises: number;
  sets: number;
  volume: number;
  prs: number;
  streak: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  xpGained: number;
  breakdown: XPBreakdown;
  leveledUp: boolean;
  rankUp: boolean;
  newLevel: number;
  newRank: Rank;
}

export function LevelUpPopup({ visible, onClose, xpGained, breakdown, leveledUp, rankUp, newLevel, newRank }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const xpBarAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.3);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      xpBarAnim.setValue(0);
      glowAnim.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(xpBarAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
          ])
        ),
      ]).start();
    }
  }, [visible]);

  const rankColor = getRankColor(newRank);

  const breakdownItems = [
    { label: 'Workout Complete', value: breakdown.base, icon: '🏋️' },
    { label: 'Exercises', value: breakdown.exercises, icon: '💪' },
    { label: 'Sets Completed', value: breakdown.sets, icon: '✅' },
    { label: 'Volume Bonus', value: breakdown.volume, icon: '📊' },
    { label: 'Personal Records', value: breakdown.prs, icon: '🏆' },
    { label: 'Streak Bonus', value: breakdown.streak, icon: '🔥' },
  ].filter(item => item.value > 0);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Animated.View style={[s.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Glow effect */}
          <Animated.View style={[s.glow, { opacity: glowAnim, backgroundColor: rankColor + '20' }]} />

          {/* Header */}
          <View style={s.header}>
            {rankUp ? (
              <>
                <Text style={s.rankUpLabel}>RANK UP!</Text>
                <Animated.View style={[s.rankBadge, { backgroundColor: rankColor, borderColor: rankColor, transform: [{ scale: scaleAnim }] }]}>
                  <Text style={s.rankLetter}>{newRank}</Text>
                </Animated.View>
              </>
            ) : leveledUp ? (
              <>
                <Text style={s.levelUpLabel}>LEVEL UP!</Text>
                <View style={s.levelBadge}>
                  <Text style={s.levelNumber}>{newLevel}</Text>
                </View>
              </>
            ) : (
              <Text style={s.workoutCompleteLabel}>WORKOUT COMPLETE!</Text>
            )}
          </View>

          {/* XP Gained */}
          <Animated.View style={[s.xpSection, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={s.xpLabel}>XP GAINED</Text>
            <Text style={s.xpValue}>+{xpGained}</Text>
          </Animated.View>

          {/* XP Breakdown */}
          <View style={s.breakdown}>
            {breakdownItems.map((item, i) => (
              <Animated.View
                key={item.label}
                style={[s.breakdownRow, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}
              >
                <Text style={s.breakdownIcon}>{item.icon}</Text>
                <Text style={s.breakdownLabel}>{item.label}</Text>
                <Text style={s.breakdownValue}>+{item.value}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Close Button */}
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeTxt}>CONTINUE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  container: { backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.xl, padding: Spacing.xl, width: '100%', maxWidth: 340, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  glow: { ...StyleSheet.absoluteFill, borderRadius: BorderRadius.xl } as any,

  header: { alignItems: 'center', marginBottom: Spacing.lg, zIndex: 1 },
  rankUpLabel: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.primary, letterSpacing: 3, marginBottom: Spacing.md },
  levelUpLabel: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.primary, letterSpacing: 3, marginBottom: Spacing.md },
  workoutCompleteLabel: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.success, letterSpacing: 2, marginBottom: Spacing.md },

  rankBadge: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  rankLetter: { fontSize: 36, fontWeight: '900', color: Colors.white },
  levelBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  levelNumber: { fontSize: 32, fontWeight: '900', color: Colors.white },

  xpSection: { alignItems: 'center', marginBottom: Spacing.lg, zIndex: 1 },
  xpLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.xs },
  xpValue: { fontSize: 48, fontWeight: '900', color: Colors.primary },

  breakdown: { marginBottom: Spacing.lg, zIndex: 1 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border + '40' },
  breakdownIcon: { fontSize: 16, marginRight: Spacing.sm, width: 24, textAlign: 'center' },
  breakdownLabel: { flex: 1, fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  breakdownValue: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },

  closeBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: Spacing.md, alignItems: 'center', zIndex: 1 },
  closeTxt: { fontSize: FontSize.md, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
});
