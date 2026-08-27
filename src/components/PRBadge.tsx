import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export type PRType = '1rm' | 'volume' | 'reps' | 'streak';

interface PRBadgeProps {
  type: PRType;
  value: string;
  date?: string;
  compact?: boolean;
}

const PR_CONFIG: Record<PRType, { icon: string; label: string; color: string }> = {
  '1rm': { icon: '🥇', label: '1RM', color: '#FFD700' },
  volume: { icon: '🏆', label: 'VOL', color: '#C0C0C0' },
  reps: { icon: '🔥', label: 'REPS', color: '#CD7F32' },
  streak: { icon: '📈', label: 'STREAK', color: Colors.primary },
};

export function PRBadge({ type, value, date, compact = false }: PRBadgeProps) {
  const config = PR_CONFIG[type];
  
  if (compact) {
    return (
      <View style={[styles.compactBadge, { backgroundColor: `${config.color}20` }]}>
        <Text style={styles.compactIcon}>{config.icon}</Text>
        <Text style={[styles.compactValue, { color: config.color }]}>{value}</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.badge, { borderLeftColor: config.color }]}>
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{config.icon}</Text>
        <Text style={styles.badgeLabel}>{config.label}</Text>
      </View>
      <Text style={[styles.badgeValue, { color: config.color }]}>{value}</Text>
      {date && <Text style={styles.badgeDate}>{date}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  badgeValue: {
    fontSize: FontSize.lg,
    fontWeight: '900',
  },
  badgeDate: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  compactIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  compactValue: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
});
