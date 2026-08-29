import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { FolderCard } from '@/components/FolderCard';
import { RoutineCardUnfiled } from '@/components/RoutineCardUnfiled';
import { MoveToFolderModal } from '@/components/MoveToFolderModal';
import { CreateFolderModal } from '@/components/CreateFolderModal';
import { CreateRoutineModal } from '@/components/CreateRoutineModal';

export default function WorkoutsScreen() {
  const { routines, folders, exercises, activeWorkout, startWorkout, addRoutine, addFolder, deleteRoutine, deleteFolder, moveRoutineToFolder } = useStore();
  const [showCF, setShowCF] = useState(false);
  const [showCR, setShowCR] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [moveModalRoutine, setMoveModalRoutine] = useState<{ id: string; name: string; folderId: string | null } | null>(null);

  const inFolders = folders.map(f => ({ folder: f, routines: routines.filter(r => r.folderId === f.id) }));
  const unfiled = routines.filter(r => !r.folderId);

  const handleMoveToFolder = useCallback((routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (routine) {
      setMoveModalRoutine({ id: routine.id, name: routine.name, folderId: routine.folderId });
    }
  }, [routines]);

  const handleMoveConfirm = useCallback((folderId: string) => {
    if (moveModalRoutine && moveRoutineToFolder) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      moveRoutineToFolder(moveModalRoutine.id, folderId);
    }
  }, [moveModalRoutine, moveRoutineToFolder]);

  const handleRemoveFromFolder = useCallback(() => {
    if (moveModalRoutine && moveRoutineToFolder) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      moveRoutineToFolder(moveModalRoutine.id, null);
    }
  }, [moveModalRoutine, moveRoutineToFolder]);

  return (
    <View style={st.m}>
      <ScrollView style={st.s} contentContainerStyle={st.c}>
        <View style={st.h}>
          <Text style={st.p}>TRAINING</Text>
          <Text style={st.t}>WORKOUTS</Text>
        </View>
        <TouchableOpacity style={st.eb} onPress={() => startWorkout('Quick Workout')} activeOpacity={0.7}>
          <Text style={st.ei}>⚡</Text>
          <View style={st.ebf}>
            <Text style={st.ebt}>START EMPTY WORKOUT</Text>
            <Text style={st.ebs}>Begin training without a template</Text>
          </View>
          <Text style={st.ar}>→</Text>
        </TouchableOpacity>
        {activeWorkout && (
          <TouchableOpacity style={st.ab}>
            <View style={st.ad} />
            <Text style={st.at}>ACTIVE: {activeWorkout.name}</Text>
          </TouchableOpacity>
        )}
        {inFolders.map(({ folder, routines: fr }) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            routines={fr}
            exercises={exercises}
            onStartRoutine={(rid) => startWorkout(undefined, rid)}
            onMoveRoutine={handleMoveToFolder}
            onDeleteFolder={() => deleteFolder(folder.id)}
            onDeleteRoutine={(id) => deleteRoutine(id)}
          />
        ))}
        {unfiled.length > 0 && (
          <View style={st.savedSection}>
            <View style={st.savedHeader}>
              <Text style={st.savedTitle}>MY SAVED ROUTINES</Text>
              <Text style={st.savedCount}>{unfiled.length}</Text>
            </View>
            <Text style={st.savedHint}>Tap ⋯ to move to a folder</Text>
            {unfiled.map(r => (
              <RoutineCardUnfiled
                key={r.id}
                routine={r}
                exercises={exercises}
                onStart={() => startWorkout(undefined, r.id)}
                onMoveToFolder={() => handleMoveToFolder(r.id)}
                onDelete={() => deleteRoutine(r.id)}
              />
            ))}
          </View>
        )}
        {routines.length === 0 && (
          <View style={st.em}>
            <Text style={st.emI}>📋</Text>
            <Text style={st.emT}>NO ROUTINES YET</Text>
            <Text style={st.emX}>Create your first routine to quickly start workouts.</Text>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
      <View style={st.fw}>
        <TouchableOpacity style={st.fb} onPress={() => setShowMenu(!showMenu)} activeOpacity={0.8}>
          <Text style={st.fi}>+</Text>
        </TouchableOpacity>
        {showMenu && (
          <View style={st.fm}>
            <TouchableOpacity style={st.fmi} onPress={() => { setShowMenu(false); setShowCR(true); }}>
              <Text style={st.fmt}>New Routine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.fmi} onPress={() => { setShowMenu(false); setShowCF(true); }}>
              <Text style={st.fmt}>New Folder</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <CreateFolderModal visible={showCF} onClose={() => setShowCF(false)} onCreate={(n, c) => addFolder(n, c)} />
      <CreateRoutineModal visible={showCR} onClose={() => setShowCR(false)} onCreate={(n, el, fid) => addRoutine({ name: n, exercises: el, folderId: fid })} exercises={exercises} folders={folders} />
      {moveModalRoutine && (
        <MoveToFolderModal
          visible={!!moveModalRoutine}
          routineName={moveModalRoutine.name}
          folders={folders}
          currentFolderId={moveModalRoutine.folderId}
          onClose={() => setMoveModalRoutine(null)}
          onMove={handleMoveConfirm}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  m: { flex: 1, backgroundColor: Colors.background },
  s: { flex: 1 },
  c: { padding: Spacing.lg, paddingTop: 60 },
  h: { marginBottom: Spacing.lg },
  p: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  t: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  eb: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  ei: { fontSize: 28, marginRight: Spacing.md },
  ebf: { flex: 1 },
  ebt: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  ebs: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  ar: { fontSize: 18, color: Colors.primary, fontWeight: '800' },
  ab: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34, 197, 94, 0.15)', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: '#22C55E' },
  ad: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: Spacing.sm },
  at: { flex: 1, fontSize: FontSize.xs, fontWeight: '800', color: '#22C55E', letterSpacing: 0.5 },
  savedSection: { marginBottom: Spacing.lg },
  savedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  savedTitle: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  savedCount: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted, backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  savedHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md, fontStyle: 'italic' },
  em: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emI: { fontSize: 48, marginBottom: Spacing.md },
  emT: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.sm },
  emX: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  fw: { position: 'absolute', bottom: 30, right: 30, alignItems: 'flex-end' },
  fb: { backgroundColor: Colors.primary, borderRadius: 35, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fi: { fontSize: 28, color: Colors.white, fontWeight: '300', marginTop: -2 },
  fm: { position: 'absolute', bottom: 70, right: 0, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, minWidth: 180 },
  fmi: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md },
  fmt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
});
