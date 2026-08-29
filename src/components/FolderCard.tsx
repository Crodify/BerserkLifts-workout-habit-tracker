import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Modal } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Folder, Routine, Exercise } from '@/types';
import { RoutineCard } from './RoutineCard';

interface FolderCardProps {
  folder: Folder;
  routines: Routine[];
  exercises: Exercise[];
  onStartRoutine: (routineId: string) => void;
  onMoveRoutine?: (routineId: string) => void;
  onDeleteFolder?: () => void;
  onDeleteRoutine?: (routineId: string) => void;
}

export function FolderCard({
  folder,
  routines,
  exercises,
  onStartRoutine,
  onMoveRoutine,
  onDeleteFolder,
  onDeleteRoutine,
}: FolderCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

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
        <TouchableOpacity style={styles.moreBtn} onPress={() => setShowMenu(true)} activeOpacity={0.7}>
          <Text style={styles.moreTxt}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.routinesList}>
          {routines.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              exercises={exercises}
              onStart={() => onStartRoutine(routine.id)}
              onMoveToFolder={onMoveRoutine ? () => onMoveRoutine(routine.id) : undefined}
              onDelete={onDeleteRoutine ? () => onDeleteRoutine(routine.id) : undefined}
            />
          ))}
        </View>
      )}

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{folder.name}</Text>
            {onDeleteFolder && (
              <TouchableOpacity style={[styles.popupItem, styles.popupDanger]} onPress={() => { setShowMenu(false); onDeleteFolder(); }}>
                <Text style={styles.popupIcon}>🗑</Text>
                <Text style={[styles.popupText, styles.popupDangerTxt]}>Delete folder</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.sm },
  folderName: { flex: 1, fontSize: FontSize.sm, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  count: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted, marginRight: Spacing.sm },
  chevron: { fontSize: 14, color: Colors.textMuted },
  chevronExpanded: { transform: [{ rotate: '0deg' }] },
  moreBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.xs },
  moreTxt: { fontSize: 18, color: Colors.textMuted, fontWeight: '700' },
  routinesList: { paddingLeft: Spacing.md },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, minWidth: 200, borderWidth: 1, borderColor: Colors.border },
  popupTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  popupItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.sm },
  popupIcon: { fontSize: 18, marginRight: Spacing.md },
  popupText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  popupDanger: {},
  popupDangerTxt: { color: Colors.error },
});
