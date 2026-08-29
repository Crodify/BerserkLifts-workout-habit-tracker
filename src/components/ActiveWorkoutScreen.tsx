import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { ExercisePickerModal } from './ExercisePickerModal';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { playRestWarningBeep, playRestCompleteBeep, playSetCompleteBeep } from '@/utils/sounds';
import { SetType } from '@/types';

const SET_TYPE_OPTIONS: { type: SetType; label: string; color: string; short: string }[] = [
  { type: 'normal', label: 'Normal', color: Colors.textSecondary, short: '' },
  { type: 'warmup', label: 'Warmup', color: Colors.info, short: 'W' },
  { type: 'drop', label: 'Drop Set', color: Colors.warning, short: 'D' },
  { type: 'failure', label: 'Failure', color: Colors.error, short: 'F' },
];

function formatTimer(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

function formatRest(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ActiveWorkoutScreen({ onFinish }: { onFinish: () => void }) {
  const { activeWorkout, settings, toggleSetComplete, addSetToExercise, updateSet, updateSetType, addExerciseToWorkout, removeExerciseFromWorkout, toggleSuperset, completeWorkout, cancelWorkout } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [detailExerciseId, setDetailExerciseId] = useState<string | null>(null);
  const [setTypeModal, setSetTypeModal] = useState<{ exerciseId: string; setId: string; current: SetType } | null>(null);

  // Rest timer state
  const [restRemaining, setRestRemaining] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restProgress = useRef(new Animated.Value(0)).current;

  // Workout timer
  useEffect(() => {
    if (!activeWorkout) return;
    const start = new Date(activeWorkout.startTime).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeWorkout?.startTime]);

  useEffect(() => {
    return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); };
  }, []);

  const dismissRestTimer = useCallback(() => {
    if (restIntervalRef.current) { clearInterval(restIntervalRef.current); restIntervalRef.current = null; }
    setRestActive(false);
    setRestRemaining(0);
    restProgress.setValue(0);
  }, [restProgress]);

  const startRestTimer = useCallback((seconds: number) => {
    dismissRestTimer();
    setRestRemaining(seconds);
    setRestActive(true);
    restProgress.setValue(1);
    Animated.timing(restProgress, { toValue: 0, duration: seconds * 1000, useNativeDriver: false }).start();
    let warned = false;
    restIntervalRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          if (restIntervalRef.current) clearInterval(restIntervalRef.current);
          restIntervalRef.current = null;
          setRestActive(false);
          playRestCompleteBeep();
          return 0;
        }
        if (prev <= 11 && !warned) { warned = true; playRestWarningBeep(); }
        return prev - 1;
      });
    }, 1000);
  }, [dismissRestTimer, restProgress]);

  const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    const wasCompleted = set?.completed;
    toggleSetComplete(exerciseId, setId);
    if (!wasCompleted) {
      playSetCompleteBeep();
      // Skip rest timer for warmup/drop sets
      if (settings.autoStartRestTimer && set?.type !== 'warmup' && set?.type !== 'drop') {
        startRestTimer(set?.restTimer || settings.defaultRestTimer);
      }
    } else {
      dismissRestTimer();
    }
  }, [activeWorkout, settings, toggleSetComplete, startRestTimer, dismissRestTimer]);

  if (!activeWorkout) return null;

  const totalVolume = activeWorkout.exercises.reduce((sum, ex) =>
    sum + ex.sets.filter(s => s.completed).reduce((s, set) => s + set.weight * set.reps, 0), 0
  );
  const completedSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  const handleFinish = () => { dismissRestTimer(); completeWorkout(); setShowFinish(false); onFinish(); };
  const handleDiscard = () => { dismissRestTimer(); cancelWorkout(); setShowFinish(false); onFinish(); };
  const progressWidth = restProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // Find superset pairs
  const supersetGroups = activeWorkout.exercises.reduce<Record<string, string[]>>((acc, ex) => {
    if (ex.supersetId) {
      if (!acc[ex.supersetId]) acc[ex.supersetId] = [];
      acc[ex.supersetId].push(ex.id);
    }
    return acc;
  }, {});

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setShowFinish(true)}>
          <Text style={s.cancelBtn}>✕</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.timer}>{formatTimer(elapsed)}</Text>
          <Text style={s.vol}>{(totalVolume / 1000).toFixed(1)}k kg · {completedSets}/{totalSets} sets</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {activeWorkout.exercises.map(ex => {
          const isSuperset = !!ex.supersetId;
          return (
            <View key={ex.id} style={[s.exBlock, isSuperset && s.exBlockSuperset]}>
              {/* Exercise Header */}
              <View style={s.exHeader}>
                <View style={s.exHeaderLeft}>
                  {isSuperset && (
                    <View style={s.supersetBadge}>
                      <Text style={s.supersetTxt}>{ex.supersetLabel}</Text>
                    </View>
                  )}
                  <TouchableOpacity onPress={() => setDetailExerciseId(ex.exerciseId)}>
                    <Text style={s.exName}>{ex.exerciseName}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={s.moreBtn}
                  onPress={() => {
                    if (isSuperset) {
                      // Find other exercise in superset to unlink
                      const pairId = supersetGroups[ex.supersetId!].find(id => id !== ex.id);
                      if (pairId) toggleSuperset(ex.id, pairId);
                    } else {
                      // Find next exercise to superset with
                      const idx = activeWorkout.exercises.findIndex(e => e.id === ex.id);
                      const next = activeWorkout.exercises[idx + 1];
                      if (next && !next.supersetId) toggleSuperset(ex.id, next.id);
                    }
                  }}
                >
                  <Text style={s.moreTxt}>{isSuperset ? 'Unlink' : 'Link'}</Text>
                </TouchableOpacity>
              </View>

              {/* Ghost Data */}
              {ex.previousBest && (
                <Text style={s.ghost}>Last: {ex.previousBest.weight}kg × {ex.previousBest.reps}</Text>
              )}

              {/* Column Labels */}
              <View style={s.colRow}>
                <Text style={[s.colLabel, { width: 32 }]}>SET</Text>
                <Text style={[s.colLabel, { flex: 1, textAlign: 'center' }]}>KG</Text>
                <Text style={[s.colLabel, { flex: 1, textAlign: 'center' }]}>REPS</Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Sets */}
              {ex.sets.map((set, i) => {
                const setType = (set.type || 'normal') as SetType;
                const typeInfo = SET_TYPE_OPTIONS.find(t => t.type === setType);
                const isSpecial = setType !== 'normal';
                return (
                  <View key={set.id} style={[s.setRow, set.completed && s.setDone, isSpecial && { borderLeftWidth: 2, borderLeftColor: typeInfo?.color }]}>
                    {/* Set Number / Type Selector */}
                    <TouchableOpacity
                      style={[s.setNumWrap, isSpecial && { backgroundColor: typeInfo?.color + '15' }]}
                      onPress={() => setSetTypeModal({ exerciseId: ex.id, setId: set.id, current: setType })}
                    >
                      {isSpecial ? (
                        <Text style={[s.setTypeLabel, { color: typeInfo?.color }]}>{typeInfo?.short}</Text>
                      ) : (
                        <Text style={[s.setNum, set.completed && s.setDoneTxt]}>{i + 1}</Text>
                      )}
                    </TouchableOpacity>

                    {/* Weight Input */}
                    <TextInput
                      style={[s.setInput, set.completed && s.setInputDone]}
                      keyboardType="decimal-pad"
                      value={set.weight > 0 ? String(set.weight) : ''}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      onChangeText={v => updateSet(ex.id, set.id, parseFloat(v) || 0, set.reps)}
                    />

                    {/* Reps Input */}
                    <TextInput
                      style={[s.setInput, set.completed && s.setInputDone]}
                      keyboardType="number-pad"
                      value={set.reps > 0 ? String(set.reps) : ''}
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      onChangeText={v => updateSet(ex.id, set.id, set.weight, parseInt(v) || 0)}
                    />

                    {/* Checkmark */}
                    <TouchableOpacity
                      style={[s.checkBtn, set.completed && s.checkDone]}
                      onPress={() => handleToggleSet(ex.id, set.id)}
                    >
                      <Text style={s.checkTxt}>{set.completed ? '✓' : ''}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Actions */}
              <View style={s.exActions}>
                <TouchableOpacity style={s.addSetBtn} onPress={() => addSetToExercise(ex.id)}>
                  <Text style={s.addSetTxt}>+ ADD SET</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeExerciseFromWorkout(ex.id)}>
                  <Text style={s.removeTxt}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={s.addExBtn} onPress={() => setShowPicker(true)}>
          <Text style={s.addExTxt}>+ ADD EXERCISE</Text>
        </TouchableOpacity>
        <View style={{ height: restActive ? 160 : 100 }} />
      </ScrollView>

      {/* Finish Button */}
      <View style={s.footer}>
        <TouchableOpacity style={s.finishBtn} onPress={() => setShowFinish(true)}>
          <Text style={s.finishTxt}>FINISH WORKOUT</Text>
        </TouchableOpacity>
      </View>

      {/* Rest Timer Overlay */}
      {restActive && (
        <View style={s.restOverlay}>
          <View style={s.restCard}>
            <Text style={s.restLabel}>REST</Text>
            <Text style={s.restTime}>{formatRest(restRemaining)}</Text>
            <View style={s.restProgressTrack}>
              <Animated.View style={[s.restProgressFill, { width: progressWidth }]} />
            </View>
            <TouchableOpacity style={s.restSkipBtn} onPress={dismissRestTimer}>
              <Text style={s.restSkipTxt}>SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Exercise Picker */}
      <ExercisePickerModal visible={showPicker} onClose={() => setShowPicker(false)} onSelect={(eid) => { addExerciseToWorkout(eid); setShowPicker(false); }} />

      {/* Exercise Detail */}
      {detailExerciseId && (
        <ExerciseDetailScreen visible={!!detailExerciseId} exerciseId={detailExerciseId} onClose={() => setDetailExerciseId(null)} />
      )}

      {/* Set Type Picker */}
      <Modal visible={!!setTypeModal} transparent animationType="fade" onRequestClose={() => setSetTypeModal(null)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setSetTypeModal(null)}>
          <View style={s.pickerBox}>
            <Text style={s.pickerTitle}>SET TYPE</Text>
            {SET_TYPE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.type}
                style={[s.pickerOpt, setTypeModal?.current === opt.type && { backgroundColor: opt.color + '20' }]}
                onPress={() => {
                  if (setTypeModal) updateSetType(setTypeModal.exerciseId, setTypeModal.setId, opt.type);
                  setSetTypeModal(null);
                }}
              >
                <View style={[s.pickerDot, { backgroundColor: opt.color }]} />
                <Text style={[s.pickerOptTxt, { color: opt.color }]}>{opt.label}</Text>
                {setTypeModal?.current === opt.type && <Text style={s.pickerCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Finish Confirm */}
      <Modal visible={showFinish} transparent animationType="fade" onRequestClose={() => setShowFinish(false)}>
        <View style={s.modalOverlay2}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>FINISH WORKOUT?</Text>
            <Text style={s.modalSub}>{activeWorkout.name}</Text>
            <Text style={s.modalStats}>{completedSets} sets · {(totalVolume / 1000).toFixed(1)}k kg volume</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setShowFinish(false)}>
                <Text style={s.modalCancelTxt}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalDiscard} onPress={handleDiscard}>
                <Text style={s.modalDiscardTxt}>DISCARD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalSave} onPress={handleFinish}>
                <Text style={s.modalSaveTxt}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 50, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  cancelBtn: { fontSize: 18, color: Colors.error, fontWeight: '800', width: 40 },
  headerCenter: { alignItems: 'center' },
  timer: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.text },
  vol: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // Exercise Block
  exBlock: { marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  exBlockSuperset: { borderLeftWidth: 3, borderLeftColor: Colors.info },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  exHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  supersetBadge: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.info, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.sm },
  supersetTxt: { fontSize: 11, fontWeight: '900', color: Colors.white },
  exName: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, textDecorationLine: 'underline' },
  moreBtn: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  moreTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },
  ghost: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: Spacing.sm, fontStyle: 'italic' },

  // Column Labels
  colRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs, paddingHorizontal: 2 },
  colLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },

  // Set Row
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingVertical: 2, borderRadius: BorderRadius.sm },
  setDone: { opacity: 0.5 },
  setNumWrap: { width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.sm },
  setNum: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  setDoneTxt: { color: Colors.success },
  setTypeLabel: { fontSize: 12, fontWeight: '900' },
  setInput: { flex: 1, marginHorizontal: 3, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.sm, paddingVertical: 6, color: Colors.text, fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center' },
  setInputDone: { borderColor: Colors.success, opacity: 0.6 },
  checkBtn: { width: 36, height: 32, borderRadius: BorderRadius.sm, borderWidth: 1.5, borderColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceLight, marginLeft: Spacing.sm },
  checkDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkTxt: { fontSize: 14, color: Colors.white, fontWeight: '900' },

  // Actions
  exActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  addSetBtn: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  addSetTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  removeTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },

  addExBtn: { borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.md },
  addExTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, paddingBottom: 40, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  finishBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  finishTxt: { fontSize: FontSize.md, fontWeight: '900', color: Colors.white, letterSpacing: 1 },

  // Rest Timer
  restOverlay: { position: 'absolute', bottom: 80, left: 0, right: 0, paddingHorizontal: Spacing.lg, zIndex: 10 },
  restCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', borderWidth: 2, borderColor: Colors.info, shadowColor: Colors.info, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  restLabel: { fontSize: FontSize.xs, fontWeight: '900', color: Colors.info, letterSpacing: 3, marginBottom: Spacing.xs },
  restTime: { fontSize: 56, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], marginBottom: Spacing.md },
  restProgressTrack: { width: '100%', height: 6, backgroundColor: Colors.surfaceLight, borderRadius: 3, overflow: 'hidden', marginBottom: Spacing.md },
  restProgressFill: { height: '100%', backgroundColor: Colors.info, borderRadius: 3 },
  restSkipBtn: { backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border },
  restSkipTxt: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.text, letterSpacing: 1 },

  // Set Type Picker
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  pickerBox: { backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: 260, borderWidth: 1, borderColor: Colors.border },
  pickerTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md, textAlign: 'center' },
  pickerOpt: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.xs },
  pickerDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  pickerOptTxt: { fontSize: FontSize.md, fontWeight: '700', flex: 1 },
  pickerCheck: { fontSize: 16, color: Colors.success, fontWeight: '900' },

  // Modals
  modalOverlay2: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  modalBox: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: '100%', maxWidth: 360, borderWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: Spacing.xs },
  modalSub: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xs },
  modalStats: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
  modalBtns: { flexDirection: 'row', gap: Spacing.sm },
  modalCancel: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center' },
  modalCancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  modalDiscard: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.error, alignItems: 'center' },
  modalDiscardTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.error },
  modalSave: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  modalSaveTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },
});
