import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export type StatusType = 'stronger' | 'plateauing' | 'dipping' | 'new';

interface ExerciseStatusProps {
  status: StatusType;
  trend?: string; // e.g., "+12% vs last month"
  sessions?: number; // Number of sessions analyzed
}

const STATUS_CONFIG: Record<StatusType, { icon: string; label: string; color: string }> = {
  stronger: { icon: '🟢', label: 'GETTING STRONGER', color: '#22C55E' },
  plateauing: { icon: '🟡', label: 'PLATEAUING', color: '#F59E0B' },
  dipping: { icon: '🔴', label: 'TAKING A DIP', color: '#EF4444' },
  new: { icon: '⚪', label: 'NEW EXERCISE', color: Colors.textMuted },
};

export function ExerciseStatus({ status, trend, sessions }: ExerciseStatusProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <View style={[styles.container, { backgroundColor: `${config.color}15` }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
      </View>
      {trend && <Text style={styles.trend}>{trend}</Text>}
      {sessions && sessions > 0 && (
        <Text style={styles.sessions}>Based on {sessions} sessions</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  trend: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  sessions: {
    fontSize: 9,
    color: Colors.textMuted,
  },
});
