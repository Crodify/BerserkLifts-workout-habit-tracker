import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

interface Props {
  visible: boolean;
  exerciseId: string;
  onClose: () => void;
}

export function ExerciseDetailScreen({ visible, exerciseId, onClose }: Props) {
  const { exercises, workouts, personalRecords } = useStore();
  const exercise = exercises.find(e => e.id === exerciseId);

  // Get all history for this exercise across workouts
  const history = useMemo(() => {
    const entries: { date: string; workoutName: string; sets: { weight: number; reps: number; type?: string }[]; volume: number }[] = [];
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.exerciseId === exerciseId) {
          entries.push({
            date: w.date,
            workoutName: w.name,
            sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps, type: s.type })),
            volume: ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
          });
        }
      });
    });
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [workouts, exerciseId]);

  // PRs for this exercise
  const exercisePRs = useMemo(() => {
    return personalRecords.filter(pr => pr.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [personalRecords, exerciseId]);

  // Max volume per week for chart
  const weeklyVolumes = useMemo(() => {
    const map: Record<string, number> = {};
    history.forEach(h => {
      const d = new Date(h.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      map[key] = (map[key] || 0) + h.volume;
    });
    return Object.entries(map).slice(-8).map(([week, vol]) => ({ week, volume: vol }));
  }, [history]);

  const maxVol = Math.max(...weeklyVolumes.map(w => w.volume), 1);

  const muscleColor: Record<string, string> = {
    Chest: '#FF2D55', Back: '#0A84FF', Legs: '#30D158', Shoulders: '#FF9F0A',
    Arms: '#BF5AF2', Core: '#FFD60A',
  };

  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.headerRow}>
            <Text style={s.title}>{exercise.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Exercise Info */}
          <View style={s.infoRow}>
            <View style={[s.muscleBadge, { backgroundColor: (muscleColor[exercise.muscle] || '#636366') + '20' }]}>
              <View style={[s.muscleDot, { backgroundColor: muscleColor[exercise.muscle] || '#636366' }]} />
              <Text style={[s.muscleTxt, { color: muscleColor[exercise.muscle] || '#636366' }]}>{exercise.muscle}</Text>
            </View>
            <View style={s.equipBadge}>
              <Text style={s.equipTxt}>{exercise.equipment}</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Personal Records */}
            {exercisePRs.length > 0 && (
              <>
                <Text style={s.sectionTitle}>PERSONAL RECORDS</Text>
                <View style={s.prGrid}>
                  {exercisePRs.slice(0, 3).map((pr, i) => (
                    <View key={i} style={s.prCard}>
                      <Text style={s.prIcon}>🏆</Text>
                      <Text style={s.prLabel}>
                        {pr.type === 'maxWeight' ? 'BEST WEIGHT' :
                         pr.type === '1rm' ? 'EST. 1RM' :
                         pr.type === 'maxReps' ? 'BEST REPS' : 'BEST VOLUME'}
                      </Text>
                      <Text style={s.prValue}>
                        {pr.type === 'maxWeight' ? `${pr.weight}kg × ${pr.reps}` :
                         pr.type === '1rm' ? `${Math.round(pr.value)}kg` :
                         pr.type === 'maxReps' ? `${pr.value} reps` :
                         `${Math.round(pr.value)}kg`}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Volume Chart */}
            {weeklyVolumes.length > 0 && (
              <>
                <Text style={s.sectionTitle}>VOLUME TREND</Text>
                <View style={s.chartCard}>
                  <View style={s.chart}>
                    {weeklyVolumes.map((item, i) => {
                      const height = item.volume > 0 ? Math.max((item.volume / maxVol) * 80, 4) : 4;
                      return (
                        <View key={i} style={s.barCol}>
                          <Text style={s.barLabel}>{item.volume > 0 ? `${(item.volume / 1000).toFixed(1)}k` : ''}</Text>
                          <View style={s.barTrack}>
                            <View style={[s.barFill, { height }]} />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* History */}
            {history.length > 0 && (
              <>
                <Text style={s.sectionTitle}>HISTORY</Text>
                {history.map((entry, i) => (
                  <View key={i} style={s.historyCard}>
                    <View style={s.historyTop}>
                      <Text style={s.historyDate}>
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Text>
                      <Text style={s.historyVol}>{(entry.volume / 1000).toFixed(1)}k kg</Text>
                    </View>
                    {entry.sets.map((set, j) => (
                      <View key={j} style={s.historySet}>
                        {set.type && set.type !== 'normal' && (
                          <View style={[s.setTypeBadge, set.type === 'warmup' && s.warmupBadge, set.type === 'drop' && s.dropBadge, set.type === 'failure' && s.failureBadge]}>
                            <Text style={[s.setTypeTxt, set.type === 'warmup' && s.warmupTxt, set.type === 'drop' && s.dropTxt, set.type === 'failure' && s.failureTxt]}>
                              {set.type === 'warmup' ? 'W' : set.type === 'drop' ? 'D' : 'F'}
                            </Text>
                          </View>
                        )}
                        <Text style={s.historySetTxt}>{set.weight}kg × {set.reps}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </>
            )}

            {history.length === 0 && (
              <View style={s.emptyCard}>
                <Text style={s.emptyIcon}>📊</Text>
                <Text style={s.emptyTitle}>No history yet</Text>
                <Text style={s.emptySub}>Complete workouts to see exercise history</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.lg, paddingBottom: 40, maxHeight: '85%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, flex: 1 },
  closeBtn: { fontSize: 20, color: Colors.textSecondary, fontWeight: '800', paddingLeft: Spacing.md },

  // Info Row
  infoRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  muscleBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  muscleDot: { width: 6, height: 6, borderRadius: 3, marginRight: Spacing.xs },
  muscleTxt: { fontSize: FontSize.xs, fontWeight: '700' },
  equipBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceLight },
  equipTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },

  // PRs
  sectionTitle: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.sm, marginTop: Spacing.md },
  prGrid: { flexDirection: 'row', gap: Spacing.sm },
  prCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.accent + '30' },
  prIcon: { fontSize: 20, marginBottom: Spacing.xs },
  prLabel: { fontSize: 8, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  prValue: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.accent },

  // Chart
  chartCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110 },
  barCol: { flex: 1, alignItems: 'center' },
  barLabel: { fontSize: 8, fontWeight: '700', color: Colors.textMuted, marginBottom: 4 },
  barTrack: { width: 16, height: 80, justifyContent: 'flex-end', alignItems: 'center' },
  barFill: { width: 16, borderRadius: 4, backgroundColor: Colors.primary },

  // History
  historyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  historyDate: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  historyVol: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  historySet: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  setTypeBadge: { width: 20, height: 20, borderRadius: 4, backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.sm },
  warmupBadge: { backgroundColor: Colors.infoSubtle },
  dropBadge: { backgroundColor: Colors.warningSubtle },
  failureBadge: { backgroundColor: Colors.errorSubtle },
  setTypeTxt: { fontSize: 10, fontWeight: '900', color: Colors.textSecondary },
  warmupTxt: { color: Colors.info },
  dropTxt: { color: Colors.warning },
  failureTxt: { color: Colors.error },
  historySetTxt: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },

  // Empty
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyIcon: { fontSize: 36, marginBottom: Spacing.sm },
  emptyTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
});
