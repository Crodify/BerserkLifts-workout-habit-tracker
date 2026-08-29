import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatNumber } from '@/utils';
import { SetType } from '@/types';

const SET_TYPE_COLORS: Record<string, string> = {
  normal: Colors.textSecondary,
  warmup: Colors.info,
  drop: Colors.warning,
  failure: Colors.error,
};

const SET_TYPE_LABELS: Record<string, string> = {
  normal: '',
  warmup: 'W',
  drop: 'D',
  failure: 'F',
};

interface Props {
  workoutId: string;
  visible: boolean;
  onClose: () => void;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function WorkoutDetailScreen({ workoutId, visible, onClose }: Props) {
  const { workouts, exercises } = useStore();
  const workout = workouts.find(w => w.id === workoutId);

  if (!visible || !workout) return null;

  const muscleSet = new Set<string>();
  workout.exercises.forEach(we => {
    const exDef = exercises.find(e => e.id === we.exerciseId);
    if (exDef) muscleSet.add(exDef.muscle);
  });

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

  return (
    <View style={s.overlay}>
      <View style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={onClose}>
            <Text style={s.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>{workout.name}</Text>
            <Text style={s.headerDate}>{formatDate(workout.date)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Row */}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{formatDuration(workout.duration)}</Text>
              <Text style={s.statLabel}>Duration</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>{(workout.totalVolume / 1000).toFixed(1)}k</Text>
              <Text style={s.statLabel}>Volume (kg)</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>{completedSets}/{totalSets}</Text>
              <Text style={s.statLabel}>Sets</Text>
            </View>
          </View>

          {/* Muscle Groups */}
          <View style={s.muscleRow}>
            {[...muscleSet].map(m => (
              <View key={m} style={s.muscleChip}>
                <Text style={s.muscleChipTxt}>{m}</Text>
              </View>
            ))}
          </View>

          {/* XP Gained */}
          {workout.xpGained ? (
            <View style={s.xpBanner}>
              <Text style={s.xpBannerTxt}>⚡ +{workout.xpGained} XP</Text>
            </View>
          ) : null}

          {/* PRs Hit */}
          {workout.prsHit && workout.prsHit.length > 0 ? (
            <View style={s.prBanner}>
              <Text style={s.prBannerTxt}>🏆 {workout.prsHit.length} Personal Record{workout.prsHit.length > 1 ? 's' : ''}!</Text>
            </View>
          ) : null}

          {/* Exercises */}
          {workout.exercises.map(we => {
            const exDef = exercises.find(e => e.id === we.exerciseId);
            const exerciseVolume = we.sets.filter(s => s.completed).reduce((sum, s) => sum + s.weight * s.reps, 0);
            const completedExSets = we.sets.filter(s => s.completed).length;
            const bestSet = we.sets.filter(s => s.completed).sort((a, b) => (b.weight * b.reps) - (a.weight * a.reps))[0];

            return (
              <View key={we.id} style={s.exCard}>
                {/* Exercise Header */}
                <View style={s.exHeader}>
                  <View style={s.exHeaderLeft}>
                    <Text style={s.exName}>{we.exerciseName}</Text>
                    <Text style={s.exMeta}>{exDef?.muscle} · {exDef?.equipment}</Text>
                  </View>
                  <View style={s.exStats}>
                    <Text style={s.exVolume}>{(exerciseVolume / 1000).toFixed(1)}k kg</Text>
                    <Text style={s.exSets}>{completedExSets} sets</Text>
                  </View>
                </View>

                {/* Notes */}
                {we.notes ? (
                  <Text style={s.exNotes}>📝 {we.notes}</Text>
                ) : null}

                {/* Superset badge */}
                {we.supersetId ? (
                  <View style={s.supersetBadge}>
                    <Text style={s.supersetTxt}>SUPERSET {we.supersetLabel || ''}</Text>
                  </View>
                ) : null}

                {/* Set Table Header */}
                <View style={s.setTableHeader}>
                  <View style={s.setColNum}><Text style={s.colHdr}>SET</Text></View>
                  <View style={s.setColType}><Text style={s.colHdr}>TYPE</Text></View>
                  <View style={s.setColWeight}><Text style={s.colHdr}>KG</Text></View>
                  <View style={s.setColReps}><Text style={s.colHdr}>REPS</Text></View>
                  <View style={s.setColVol}><Text style={s.colHdr}>VOL</Text></View>
                </View>

                {/* Set Rows */}
                {we.sets.map((set, i) => {
                  const setType = (set.type || 'normal') as SetType;
                  const typeColor = SET_TYPE_COLORS[setType];
                  const typeLabel = SET_TYPE_LABELS[setType];
                  const vol = set.weight * set.reps;

                  return (
                    <View key={set.id} style={[s.setRow, set.completed && s.setRowDone]}>
                      <View style={s.setColNum}>
                        <Text style={[s.setNum, set.completed && { color: Colors.success }]}>{i + 1}</Text>
                      </View>
                      <View style={s.setColType}>
                        {typeLabel ? (
                          <View style={[s.typeBadge, { backgroundColor: typeColor + '20' }]}>
                            <Text style={[s.typeBadgeTxt, { color: typeColor }]}>{typeLabel}</Text>
                          </View>
                        ) : (
                          <Text style={s.typeNormal}>—</Text>
                        )}
                      </View>
                      <View style={s.setColWeight}>
                        <Text style={[s.setValue, !set.completed && s.setValueDim]}>
                          {set.weight > 0 ? set.weight : '—'}
                        </Text>
                      </View>
                      <View style={s.setColReps}>
                        <Text style={[s.setValue, !set.completed && s.setValueDim]}>
                          {set.reps > 0 ? set.reps : '—'}
                        </Text>
                      </View>
                      <View style={s.setColVol}>
                        <Text style={[s.volValue, !set.completed && s.setValueDim]}>
                          {set.completed && vol > 0 ? `${vol}` : '—'}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {/* Best Set */}
                {bestSet && (
                  <View style={s.bestSetRow}>
                    <Text style={s.bestSetLabel}>🏆 Best: {bestSet.weight}kg × {bestSet.reps}</Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 28, color: Colors.primary, fontWeight: '600' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  headerDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, marginTop: Spacing.xs },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },

  // Muscle chips
  muscleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
  muscleChip: { backgroundColor: Colors.primary + '15', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  muscleChipTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },

  // XP & PR banners
  xpBanner: { backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, alignItems: 'center' },
  xpBannerTxt: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  prBanner: { backgroundColor: '#FFD700' + '15', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, alignItems: 'center' },
  prBannerTxt: { fontSize: FontSize.md, fontWeight: '800', color: '#FFD700' },

  // Exercise Card
  exCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  exHeaderLeft: { flex: 1 },
  exName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  exMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  exStats: { alignItems: 'flex-end' },
  exVolume: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  exSets: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  exNotes: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic', marginBottom: Spacing.sm },

  supersetBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: Spacing.sm },
  supersetTxt: { fontSize: 9, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },

  // Set table
  setTableHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 2 },
  colHdr: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  setColNum: { width: 32, alignItems: 'center' },
  setColType: { width: 36, alignItems: 'center' },
  setColWeight: { flex: 1, alignItems: 'center' },
  setColReps: { flex: 1, alignItems: 'center' },
  setColVol: { flex: 1, alignItems: 'center' },

  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  setRowDone: { opacity: 0.7 },
  setNum: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  typeBadge: { width: 24, height: 20, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  typeBadgeTxt: { fontSize: 10, fontWeight: '900' },
  typeNormal: { fontSize: 10, color: Colors.textMuted },
  setValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  setValueDim: { color: Colors.textMuted },
  volValue: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },

  bestSetRow: { marginTop: Spacing.xs, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  bestSetLabel: { fontSize: FontSize.xs, fontWeight: '700', color: '#FFD700' },
});
