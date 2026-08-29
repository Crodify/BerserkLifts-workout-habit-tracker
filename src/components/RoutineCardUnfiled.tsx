import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Routine, Exercise } from '@/types';

interface Props {
  routine: Routine;
  exercises: Exercise[];
  onStart: () => void;
  onMoveToFolder: () => void;
  onDelete: () => void;
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
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function RoutineCardUnfiled({ routine, exercises, onStart, onMoveToFolder, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  const exerciseNames = routine.exercises
    .map(re => exercises.find(e => e.id === re.exerciseId)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');
  const extraCount = routine.exercises.length > 3 ? routine.exercises.length - 3 : 0;

  return (
    <>
      <View style={s.card}>
        <TouchableOpacity style={s.content} activeOpacity={0.7} onPress={onStart}>
          <View style={s.info}>
            <Text style={s.name} numberOfLines={1}>{routine.name}</Text>
            <Text style={s.exercises} numberOfLines={1}>
              {exerciseNames}{extraCount > 0 ? ` +${extraCount} more` : ''}
            </Text>
            <Text style={s.lastUsed}>Last: {getRelativeDate(routine.lastUsed)}</Text>
          </View>
          <TouchableOpacity style={s.startBtn} onPress={onStart} activeOpacity={0.7}>
            <Text style={s.startTxt}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.moreBtn} onPress={() => setShowMenu(true)} activeOpacity={0.7}>
            <Text style={s.moreTxt}>⋯</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={s.popup}>
            <Text style={s.popupTitle}>{routine.name}</Text>
            <TouchableOpacity style={s.popupItem} onPress={() => { setShowMenu(false); onMoveToFolder(); }}>
              <Text style={s.popupIcon}>📁</Text>
              <Text style={s.popupText}>Move to folder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.popupItem, s.popupDanger]} onPress={() => { setShowMenu(false); onDelete(); }}>
              <Text style={s.popupIcon}>🗑</Text>
              <Text style={[s.popupText, s.popupDangerTxt]}>Delete routine</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
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
  },
  info: { flex: 1, marginRight: Spacing.sm },
  name: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  exercises: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4 },
  lastUsed: { fontSize: 10, color: Colors.textMuted },
  startBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  startTxt: { fontSize: 11, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moreTxt: { fontSize: 20, color: Colors.textSecondary, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  popup: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 220,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popupTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  popupItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.sm },
  popupIcon: { fontSize: 18, marginRight: Spacing.md },
  popupText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  popupDanger: { marginTop: Spacing.xs },
  popupDangerTxt: { color: Colors.error },
});
