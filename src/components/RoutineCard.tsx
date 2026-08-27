import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Routine, Exercise } from '@/types';

interface RoutineCardProps {
  routine: Routine;
  exercises: Exercise[];
  onStart: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function getRelativeDate(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function RoutineCard({ routine, exercises, onStart, onEdit, onDelete }: RoutineCardProps) {
  const exerciseNames = routine.exercises
    .map(re => exercises.find(e => e.id === re.exerciseId)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  const totalCount = routine.exercises.length;
  const extraCount = totalCount > 3 ? totalCount - 3 : 0;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onStart}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{routine.name}</Text>
          <Text style={styles.exercises} numberOfLines={1}>
            {exerciseNames}{extraCount > 0 ? ` +${extraCount} more` : ''}
          </Text>
          <Text style={styles.lastUsed}>Last: {getRelativeDate(routine.lastUsed)}</Text>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.7}>
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  exercises: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  lastUsed: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  startText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  },
});
