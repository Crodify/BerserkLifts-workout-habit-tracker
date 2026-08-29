import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Glutes', 'Full Body',
];

const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Kettlebell', 'Band', 'Smith Machine', 'EZ Bar',
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CreateExerciseModal({ visible, onClose }: Props) {
  const { addCustomExercise } = useStore();
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [showMusclePicker, setShowMusclePicker] = useState(false);
  const [showEquipPicker, setShowEquipPicker] = useState(false);

  const canSave = name.trim().length > 0 && muscle.length > 0 && equipment.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addCustomExercise({
      name: name.trim(),
      muscle,
      equipment,
    });
    setName('');
    setMuscle('');
    setEquipment('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setMuscle('');
    setEquipment('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Handle */}
          <View style={s.handle} />

          <Text style={s.title}>NEW EXERCISE</Text>
          <Text style={s.subtitle}>Create a custom exercise</Text>

          {/* Exercise Name */}
          <Text style={s.label}>Exercise Name</Text>
          <TextInput
            style={s.input}
            placeholder="e.g. Cable Fly Low to High"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          {/* Muscle Group */}
          <Text style={s.label}>Muscle Group</Text>
          <TouchableOpacity style={s.pickerBtn} onPress={() => setShowMusclePicker(!showMusclePicker)}>
            <Text style={[s.pickerBtnTxt, !muscle && { color: Colors.textMuted }]}>
              {muscle || 'Select muscle group'}
            </Text>
            <Text style={s.pickerArrow}>{showMusclePicker ? '⌃' : '⌄'}</Text>
          </TouchableOpacity>
          {showMusclePicker && (
            <View style={s.optionsWrap}>
              {MUSCLE_GROUPS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[s.optionChip, muscle === m && s.optionChipActive]}
                  onPress={() => { setMuscle(m); setShowMusclePicker(false); }}
                >
                  <Text style={[s.optionChipTxt, muscle === m && s.optionChipTxtActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Equipment */}
          <Text style={s.label}>Equipment</Text>
          <TouchableOpacity style={s.pickerBtn} onPress={() => setShowEquipPicker(!showEquipPicker)}>
            <Text style={[s.pickerBtnTxt, !equipment && { color: Colors.textMuted }]}>
              {equipment || 'Select equipment'}
            </Text>
            <Text style={s.pickerArrow}>{showEquipPicker ? '⌃' : '⌄'}</Text>
          </TouchableOpacity>
          {showEquipPicker && (
            <View style={s.optionsWrap}>
              {EQUIPMENT_OPTIONS.map(eq => (
                <TouchableOpacity
                  key={eq}
                  style={[s.optionChip, equipment === eq && s.optionChipActive]}
                  onPress={() => { setEquipment(eq); setShowEquipPicker(false); }}
                >
                  <Text style={[s.optionChipTxt, equipment === eq && s.optionChipTxtActive]}>{eq}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Preview */}
          {canSave && (
            <View style={s.preview}>
              <Text style={s.previewName}>{name.trim()}</Text>
              <Text style={s.previewInfo}>{muscle} · {equipment}</Text>
            </View>
          )}

          {/* Buttons */}
          <View style={s.btns}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleClose}>
              <Text style={s.cancelTxt}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, !canSave && s.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={[s.saveTxt, !canSave && s.saveTxtDisabled]}>CREATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 40, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm,
    maxHeight: '85%',
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, textAlign: 'center', letterSpacing: 1 },
  subtitle: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },

  label: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md,
    fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },

  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  pickerBtnTxt: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  pickerArrow: { fontSize: 14, color: Colors.textMuted },

  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  optionChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  optionChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionChipTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  optionChipTxtActive: { color: Colors.white },

  preview: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md,
    marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.primary + '40',
  },
  previewName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  previewInfo: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  btns: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  cancelBtn: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center' },
  cancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
  saveBtn: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: Colors.surfaceLight },
  saveTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  saveTxtDisabled: { color: Colors.textMuted },
});
