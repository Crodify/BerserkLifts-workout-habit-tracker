import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { CreateExerciseModal } from './CreateExerciseModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}

const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#FF453A',
  Back: '#0A84FF',
  Legs: '#30D158',
  Shoulders: '#FF9F0A',
  Arms: '#BF5AF2',
  Core: '#FFD60A',
  Glutes: '#FF6482',
  'Full Body': '#64D2FF',
};

export function ExercisePickerModal({ visible, onClose, onSelect }: Props) {
  const { exercises, deleteCustomExercise } = useStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const filtered = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscle.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = !selectedMuscle || e.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = [...new Set(exercises.map(e => e.muscle))];
  const customCount = exercises.filter(e => e.isCustom).length;

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Exercise',
      `Remove "${name}" from your exercises?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCustomExercise(id) },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.ov}>
        <View style={s.modal}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>SELECT EXERCISE</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowCreate(true)}>
              <Text style={s.addBtnTxt}>+ NEW</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <TextInput
            style={s.search}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />

          {/* Muscle Group Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipsWrap} contentContainerStyle={s.chipsContent}>
            <TouchableOpacity
              style={[s.chip, !selectedMuscle && s.chipActive]}
              onPress={() => setSelectedMuscle(null)}
            >
              <Text style={[s.chipTxt, !selectedMuscle && s.chipTxtActive]}>All ({exercises.length})</Text>
            </TouchableOpacity>
            {muscleGroups.map(m => (
              <TouchableOpacity
                key={m}
                style={[s.chip, selectedMuscle === m && { backgroundColor: (MUSCLE_COLORS[m] || Colors.primary) + '30', borderColor: MUSCLE_COLORS[m] || Colors.primary }]}
                onPress={() => setSelectedMuscle(selectedMuscle === m ? null : m)}
              >
                <View style={[s.chipDot, { backgroundColor: MUSCLE_COLORS[m] || Colors.textMuted }]} />
                <Text style={[s.chipTxt, selectedMuscle === m && { color: MUSCLE_COLORS[m] || Colors.primary }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Exercise List */}
          <ScrollView style={s.list}>
            {filtered.length === 0 ? (
              <View style={s.emptyState}>
                <Text style={s.emptyIcon}>🔍</Text>
                <Text style={s.emptyText}>No exercises found</Text>
                <TouchableOpacity style={s.emptyCreateBtn} onPress={() => setShowCreate(true)}>
                  <Text style={s.emptyCreateTxt}>+ Create Custom Exercise</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Custom exercises section */}
                {filtered.some(e => e.isCustom) && (
                  <>
                    <Text style={s.sectionHeader}>YOUR EXERCISES ({filtered.filter(e => e.isCustom).length})</Text>
                    {filtered.filter(e => e.isCustom).map(ex => (
                      <TouchableOpacity
                        key={ex.id}
                        style={s.item}
                        onPress={() => { onSelect(ex.id); setSearch(''); setSelectedMuscle(null); }}
                        onLongPress={() => handleDelete(ex.id, ex.name)}
                        activeOpacity={0.7}
                      >
                        <View style={[s.muscleBar, { backgroundColor: MUSCLE_COLORS[ex.muscle] || Colors.textMuted }]} />
                        <View style={s.itemContent}>
                          <Text style={s.name}>{ex.name}</Text>
                          <Text style={s.info}>{ex.muscle} · {ex.equipment}</Text>
                        </View>
                        <View style={s.customBadge}>
                          <Text style={s.customBadgeTxt}>CUSTOM</Text>
                        </View>
                        <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(ex.id, ex.name)}>
                          <Text style={s.deleteBtnTxt}>✕</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* Default exercises */}
                {filtered.some(e => !e.isCustom) && (
                  <>
                    <Text style={s.sectionHeader}>DEFAULT EXERCISES ({filtered.filter(e => !e.isCustom).length})</Text>
                    {filtered.filter(e => !e.isCustom).map(ex => (
                      <TouchableOpacity
                        key={ex.id}
                        style={s.item}
                        onPress={() => { onSelect(ex.id); setSearch(''); setSelectedMuscle(null); }}
                        activeOpacity={0.7}
                      >
                        <View style={[s.muscleBar, { backgroundColor: MUSCLE_COLORS[ex.muscle] || Colors.textMuted }]} />
                        <View style={s.itemContent}>
                          <Text style={s.name}>{ex.name}</Text>
                          <Text style={s.info}>{ex.muscle} · {ex.equipment}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={s.footer}>
            {customCount > 0 && (
              <Text style={s.footerTxt}>{customCount} custom exercise{customCount !== 1 ? 's' : ''}</Text>
            )}
            <TouchableOpacity style={s.cancelBtn} onPress={() => { setSearch(''); setSelectedMuscle(null); onClose(); }}>
              <Text style={s.cancelTxt}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Create Exercise Modal */}
      <CreateExerciseModal visible={showCreate} onClose={() => setShowCreate(false)} />
    </Modal>
  );
}

const s = StyleSheet.create({
  ov: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end', padding: Spacing.lg },
  modal: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, maxHeight: '85%', borderWidth: 1, borderColor: Colors.border },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  addBtnTxt: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.white, letterSpacing: 0.5 },

  search: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },

  chipsWrap: { marginBottom: Spacing.sm, maxHeight: 36 },
  chipsContent: { gap: Spacing.xs },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.border, gap: 4 },
  chipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipTxt: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  chipTxtActive: { color: Colors.primary },

  list: { maxHeight: 380 },

  sectionHeader: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, paddingTop: Spacing.sm, paddingBottom: Spacing.xs },

  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  muscleBar: { width: 3, height: 32, borderRadius: 2, marginRight: Spacing.sm },
  itemContent: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  info: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  customBadge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: Spacing.xs },
  customBadgeTxt: { fontSize: 8, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },

  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.error + '20', justifyContent: 'center', alignItems: 'center' },
  deleteBtnTxt: { fontSize: 12, color: Colors.error, fontWeight: '800' },

  emptyState: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyIcon: { fontSize: 32, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, marginBottom: Spacing.md },
  emptyCreateBtn: { backgroundColor: Colors.primary + '20', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  emptyCreateTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  footer: { marginTop: Spacing.md, alignItems: 'center' },
  footerTxt: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  cancelBtn: { padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center', width: '100%' },
  cancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
});
