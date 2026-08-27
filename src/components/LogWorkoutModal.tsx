import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface LogWorkoutProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (workout: { exerciseName: string; sets: number; reps: number; weight: number }) => void;
}

export function LogWorkoutModal({ visible, onClose, onSubmit }: LogWorkoutProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');

  const handleSubmit = () => {
    if (!exerciseName.trim()) return;
    onSubmit({
      exerciseName,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
    });
    setExerciseName('');
    setSets('3');
    setReps('10');
    setWeight('0');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>LOG WORKOUT</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>EXERCISE</Text>
            <TextInput style={styles.input} placeholder="e.g. Bench Press" placeholderTextColor={Colors.textMuted} value={exerciseName} onChangeText={setExerciseName} />
          </View>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.md }]}>
              <Text style={styles.label}>SETS</Text>
              <TextInput style={styles.input} placeholder="3" value={sets} onChangeText={setSets} keyboardType="number-pad" />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>REPS</Text>
              <TextInput style={styles.input} placeholder="10" value={reps} onChangeText={setReps} keyboardType="number-pad" />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>WEIGHT (KG)</Text>
            <TextInput style={styles.input} placeholder="0" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>LOG WORKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: '800' },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg },
  formGroup: { marginBottom: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.md },
  label: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  footer: { flexDirection: 'row', padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.md },
  cancelButton: { flex: 1, backgroundColor: Colors.surface, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  cancelButtonText: { color: Colors.textSecondary, fontWeight: '800', fontSize: FontSize.md },
  submitButton: { flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  submitButtonText: { color: Colors.white, fontWeight: '800', fontSize: FontSize.md },
});
