import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Folder, Routine, Exercise } from '@/types';
import { RoutineCard } from './RoutineCard';

interface FolderCardProps {
  folder: Folder;
  routines: Routine[];
  exercises: Exercise[];
  onStartRoutine: (routineId: string) => void;
  onEditFolder?: () => void;
  onDeleteFolder?: () => void;
  onEditRoutine?: (routineId: string) => void;
  onDeleteRoutine?: (routineId: string) => void;
}

export function FolderCard({
  folder,
  routines,
  exercises,
  onStartRoutine,
  onEditFolder,
  onDeleteFolder,
  onEditRoutine,
  onDeleteRoutine,
}: FolderCardProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const folderColor = folder.color || Colors.primary;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={[styles.colorDot, { backgroundColor: folderColor }]} />
        <Text style={styles.folderName}>{folder.name.toUpperCase()}</Text>
        <Text style={styles.count}>{routines.length}</Text>
        <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>
          {expanded ? '▾' : '▸'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.routinesList}>
          {routines.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              exercises={exercises}
              onStart={() => onStartRoutine(routine.id)}
              onEdit={onEditRoutine ? () => onEditRoutine(routine.id) : undefined}
              onDelete={onDeleteRoutine ? () => onDeleteRoutine(routine.id) : undefined}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  folderName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  count: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  chevron: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  chevronExpanded: {
    transform: [{ rotate: '0deg' }],
  },
  routinesList: {
    paddingLeft: Spacing.md,
  },
});
