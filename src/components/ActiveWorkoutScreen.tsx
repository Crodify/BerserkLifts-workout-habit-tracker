import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Animated, Platform } from 'react-native';
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
  const { activeWorkout, settings, toggleSetComplete, addSetToExercise, updateSet, updateSetType, updateExerciseNotes, addExerciseToWorkout, removeExerciseFromWorkout, toggleSuperset, completeWorkout, cancelWorkout } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [detailExerciseId, setDetailExerciseId] = useState<string | null>(null);
  const [setTypeModal, setSetTypeModal] = useState<{ exerciseId: string; setId: string; current: SetType } | null>(null);

  const [restRemaining, setRestRemaining] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!activeWorkout) return;
    const start = new Date(activeWorkout.startTime).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeWorkout?.startTime]);

  useEffect(() => () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); }, []);

  const dismissRestTimer = useCallback(() => {
    if (restIntervalRef.current) { clearInterval(restIntervalRef.current); restIntervalRef.current = null; }
    setRestActive(false); setRestRemaining(0); restProgress.setValue(0);
  }, [restProgress]);

  const startRestTimer = useCallback((seconds: number) => {
    dismissRestTimer();
    setRestRemaining(seconds); setRestActive(true); restProgress.setValue(1);
    Animated.timing(restProgress, { toValue: 0, duration: seconds * 1000, useNativeDriver: false }).start();
    let warned = false;
    restIntervalRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          if (restIntervalRef.current) clearInterval(restIntervalRef.current);
          restIntervalRef.current = null; setRestActive(false); playRestCompleteBeep(); return 0;
        }
        if (prev <= 11 && !warned) { warned = true; playRestWarningBeep(); }
        return prev - 1;
      });
    }, 1000);
  }, [dismissRestTimer, restProgress]);

  const adjustRest = useCallback((delta: number) => {
    setRestRemaining(prev => {
      const next = Math.max(0, prev + delta);
      if (next === 0) {
        if (restIntervalRef.current) clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
        setRestActive(false);
        playRestCompleteBeep();
      }
      // Restart animation with new duration
      restProgress.stopAnimation();
      restProgress.setValue(1);
      Animated.timing(restProgress, { toValue: 0, duration: next * 1000, useNativeDriver: false }).start();
      return next;
    });
  }, [restProgress]);

  const handleToggleSet = useCallback((exerciseId: string, setId: string) => {
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    const wasCompleted = set?.completed;
    toggleSetComplete(exerciseId, setId);
    if (!wasCompleted) {
      playSetCompleteBeep();
      if (settings.autoStartRestTimer && set?.type !== 'warmup' && set?.type !== 'drop') {
        startRestTimer(set?.restTimer || settings.defaultRestTimer);
      }
    } else { dismissRestTimer(); }
  }, [activeWorkout, settings, toggleSetComplete, startRestTimer, dismissRestTimer]);

  if (!activeWorkout) return null;

  const totalVolume = activeWorkout.exercises.reduce((sum, ex) =>
    sum + ex.sets.filter(s => s.completed).reduce((s, set) => s + set.weight * set.reps, 0), 0);
  const completedSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  const handleFinish = () => { dismissRestTimer(); completeWorkout(); setShowFinish(false); onFinish(); };
  const handleDiscard = () => { dismissRestTimer(); cancelWorkout(); setShowFinish(false); onFinish(); };

  // Get unique muscle groups for the stats bar
  const muscleGroups = [...new Set(activeWorkout.exercises.map(ex => {
    const exDef = useStore.getState().exercises.find(e => e.id === ex.exerciseId);
    return exDef?.muscle;
  }).filter(Boolean))];

  return (
    <View style={s.container}>
      {/* ── HEADER ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.collapseBtn} onPress={() => setShowFinish(true)}>
          <Text style={s.collapseIcon}>⌄</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Log Workout</Text>
        <TouchableOpacity style={s.timerBtn}>
          <Text style={s.timerIcon}>⏱</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.finishBtn} onPress={() => setShowFinish(true)}>
          <Text style={s.finishBtnTxt}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* ── STATS BAR ── */}
      <View style={s.statsBar}>
        <View style={s.statItem}>
          <Text style={s.statLabel}>Duration</Text>
          <Text style={s.statValueBlue}>{formatTimer(elapsed)}</Text>
        </View>
        <View style={s.statItem}>
          <Text style={s.statLabel}>Volume</Text>
          <Text style={s.statValue}>{(totalVolume / 1000).toFixed(1)} kg</Text>
        </View>
        <View style={s.statItem}>
          <Text style={s.statLabel}>Sets</Text>
          <Text style={s.statValue}>{completedSets}</Text>
        </View>
        {muscleGroups.length > 0 && (
          <View style={s.statItem}>
            <Text style={s.statLabel}>&nbsp;</Text>
            <Text style={s.statValue}>💪</Text>
          </View>
        )}
      </View>

      {/* ── EXERCISES ── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {activeWorkout.exercises.map(ex => {
          const isSuperset = !!ex.supersetId;
          return (
            <View key={ex.id} style={[s.exBlock, isSuperset && s.exBlockSuperset]}>
              {/* Exercise Header Row */}
              <View style={s.exHeader}>
                <View style={s.exHeaderLeft}>
                  <View style={s.exAvatar}>
                    <Text style={s.exAvatarTxt}>🏋️</Text>
                  </View>
                  <TouchableOpacity onPress={() => setDetailExerciseId(ex.exerciseId)}>
                    <Text style={s.exName}>{ex.exerciseName}</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.exHeaderRight}>
                  {isSuperset && (
                    <View style={s.supersetBadge}>
                      <Text style={s.supersetTxt}>{ex.supersetLabel}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={s.moreBtn}
                    onPress={() => {
                      if (isSuperset) {
                        const pairId = Object.values(useStore.getState().activeWorkout?.exercises || []).find(e => e.supersetId === ex.supersetId && e.id !== ex.id);
                        if (pairId) toggleSuperset(ex.id, pairId.id);
                      } else {
                        const idx = activeWorkout.exercises.findIndex(e => e.id === ex.id);
                        const next = activeWorkout.exercises[idx + 1];
                        if (next && !next.supersetId) toggleSuperset(ex.id, next.id);
                      }
                    }}
                  >
                    <Text style={s.moreDots}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notes */}
              <TextInput
                style={s.notesInput}
                placeholder="Add notes here..."
                placeholderTextColor={Colors.textMuted}
                value={ex.notes || ''}
                onChangeText={(v) => updateExerciseNotes(ex.id, v)}
              />

              {/* Rest Timer Info */}
              {settings.autoStartRestTimer && (
                <TouchableOpacity style={s.restInfo}>
                  <Text style={s.restInfoIcon}>⏱</Text>
                  <Text style={s.restInfoText}>Rest Timer: {formatRest(settings.defaultRestTimer)}</Text>
                </TouchableOpacity>
              )}

              {/* Column Headers */}
              <View style={s.colRow}>
                <Text style={s.colLabel}>SET</Text>
                <Text style={s.colLabelPrevious}>PREVIOUS</Text>
                <Text style={s.colLabel}>KG</Text>
                <Text style={s.colLabel}>REPS</Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Set Rows */}
              {ex.sets.map((set, i) => {
                const setType = (set.type || 'normal') as SetType;
                const typeInfo = SET_TYPE_OPTIONS.find(t => t.type === setType);
                const isSpecial = setType !== 'normal';
                const prevBest = ex.previousBest;
                const prevText = prevBest && i === 0 ? `${prevBest.weight}kg × ${prevBest.reps}` : '';

                return (
                  <View key={set.id} style={[s.setRow, set.completed && s.setRowDone]}>
                    {/* Set Number */}
                    <TouchableOpacity
                      style={[s.setNum, isSpecial && { backgroundColor: typeInfo?.color + '20' }]}
                      onPress={() => setSetTypeModal({ exerciseId: ex.id, setId: set.id, current: setType })}
                    >
                      {isSpecial ? (
                        <Text style={[s.setNumTxt, { color: typeInfo?.color }]}>{typeInfo?.short}</Text>
                      ) : (
                        <Text style={[s.setNumTxt, set.completed && { color: Colors.success }]}>{i + 1}</Text>
                      )}
                    </TouchableOpacity>

                    {/* Previous */}
                    <Text style={s.prevText} numberOfLines={1}>{prevText}</Text>

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

              {/* Add Set */}
              <TouchableOpacity style={s.addSetBtn} onPress={() => addSetToExercise(ex.id)}>
                <Text style={s.addSetTxt}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Add Exercise */}
        <TouchableOpacity style={s.addExBtn} onPress={() => setShowPicker(true)}>
          <Text style={s.addExTxt}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* Bottom Actions */}
        <View style={s.bottomActions}>
          <TouchableOpacity style={s.settingsBtn}>
            <Text style={s.settingsBtnTxt}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.discardBtn} onPress={() => setShowFinish(true)}>
            <Text style={s.discardBtnTxt}>Discard Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: restActive ? 120 : 40 }} />
      </ScrollView>

      {/* ── REST TIMER BAR (bottom) ── */}
      {restActive && (
        <View style={s.restBar}>
          <View style={s.restProgressTrack}>
            <Animated.View style={[s.restProgressFill, { width: restProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
          <View style={s.restBarInner}>
            <TouchableOpacity style={s.restAdjustBtn} onPress={() => adjustRest(-15)}>
              <Text style={s.restAdjustTxt}>-15</Text>
            </TouchableOpacity>
            <Text style={s.restTimer}>{formatRest(restRemaining)}</Text>
            <TouchableOpacity style={s.restAdjustBtn} onPress={() => adjustRest(15)}>
              <Text style={s.restAdjustTxt}>+15</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.restSkipBtn} onPress={dismissRestTimer}>
              <Text style={s.restSkipTxt}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── MODALS ── */}
      <ExercisePickerModal visible={showPicker} onClose={() => setShowPicker(false)} onSelect={(eid) => { addExerciseToWorkout(eid); setShowPicker(false); }} />

      {detailExerciseId && (
        <ExerciseDetailScreen visible={!!detailExerciseId} exerciseId={detailExerciseId} onClose={() => setDetailExerciseId(null)} />
      )}

      {/* Set Type Picker */}
      <Modal visible={!!setTypeModal} transparent animationType="fade" onRequestClose={() => setSetTypeModal(null)}>
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => setSetTypeModal(null)}>
          <View style={s.pickerBox}>
            <Text style={s.pickerTitle}>SET TYPE</Text>
            {SET_TYPE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.type}
                style={[s.pickerOpt, setTypeModal?.current === opt.type && { backgroundColor: opt.color + '20' }]}
                onPress={() => { if (setTypeModal) updateSetType(setTypeModal.exerciseId, setTypeModal.setId, opt.type); setSetTypeModal(null); }}
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
        <View style={s.modalBg}>
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

  // ── HEADER (Hevy style) ──
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: Spacing.sm, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  collapseBtn: { padding: Spacing.sm },
  collapseIcon: { fontSize: 22, color: Colors.textSecondary, fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginLeft: Spacing.xs },
  timerBtn: { padding: Spacing.sm, marginRight: Spacing.sm },
  timerIcon: { fontSize: 18, color: Colors.textSecondary },
  finishBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  finishBtnTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },

  // ── STATS BAR ──
  statsBar: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, marginBottom: 2 },
  statValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  statValueBlue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // ── EXERCISE BLOCK (flat, no card wrapper — matches Hevy) ──
  exBlock: { marginBottom: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  exBlockSuperset: { borderLeftWidth: 3, borderLeftColor: Colors.primary, paddingLeft: Spacing.sm },
  exHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  exHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  exAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  exAvatarTxt: { fontSize: 16 },
  exName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  exHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  supersetBadge: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  supersetTxt: { fontSize: 11, fontWeight: '900', color: Colors.white },
  moreBtn: { padding: Spacing.xs },
  moreDots: { fontSize: 20, color: Colors.textMuted, fontWeight: '800' },

  // Notes
  notesInput: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm, paddingVertical: Spacing.xs },

  // Rest Timer Info
  restInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  restInfoIcon: { fontSize: 12, color: Colors.primary, marginRight: Spacing.xs },
  restInfoText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },

  // ── COLUMN HEADERS ──
  colRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs, paddingHorizontal: 2 },
  colLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, width: 40, textAlign: 'center' },
  colLabelPrevious: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, flex: 1, textAlign: 'left', paddingLeft: Spacing.xs },

  // ── SET ROW (Hevy style) ──
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs },
  setRowDone: { backgroundColor: 'rgba(48, 209, 88, 0.12)' },
  setNum: { width: 36, height: 36, borderRadius: BorderRadius.sm, backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.xs },
  setNumTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  prevText: { flex: 1, fontSize: FontSize.xs, color: Colors.textTertiary, textAlign: 'left', fontStyle: 'italic', paddingLeft: Spacing.xs },
  setInput: { width: 60, height: 36, backgroundColor: Colors.background, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.xs, color: Colors.text, fontSize: FontSize.md, fontWeight: '700', textAlign: 'center', marginHorizontal: 2 },
  setInputDone: { borderColor: Colors.success, backgroundColor: 'rgba(48, 209, 88, 0.06)' },
  checkBtn: { width: 40, height: 36, borderRadius: BorderRadius.sm, borderWidth: 1.5, borderColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceLight, marginLeft: Spacing.xs },
  checkDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkTxt: { fontSize: 16, color: Colors.white, fontWeight: '900' },

  // ── ADD SET ──
  addSetBtn: { alignItems: 'center', paddingVertical: Spacing.md, marginTop: Spacing.xs },
  addSetTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },

  // ── ADD EXERCISE (blue pill — Hevy style) ──
  addExBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg },
  addExTxt: { fontSize: FontSize.md, fontWeight: '800', color: Colors.white },

  // ── BOTTOM ACTIONS ──
  bottomActions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  settingsBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  settingsBtnTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  discardBtn: { flex: 1, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  discardBtnTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.error },

  // ── REST TIMER BAR (bottom, Hevy style) ──
  restBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.backgroundElevated, borderTopWidth: 1, borderTopColor: Colors.border },
  restProgressTrack: { height: 3, backgroundColor: Colors.surfaceLight },
  restProgressFill: { height: '100%', backgroundColor: Colors.primary },
  restBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, gap: Spacing.md },
  restAdjustBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  restAdjustTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  restTimer: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.text, fontVariant: ['tabular-nums'], minWidth: 80, textAlign: 'center' },
  restSkipBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  restSkipTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },

  // ── MODALS ──
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  pickerBox: { backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: 260, borderWidth: 1, borderColor: Colors.border },
  pickerTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md, textAlign: 'center' },
  pickerOpt: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.xs },
  pickerDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  pickerOptTxt: { fontSize: FontSize.md, fontWeight: '700', flex: 1 },
  pickerCheck: { fontSize: 16, color: Colors.success, fontWeight: '900' },

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
