import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Exercise, Folder } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, exercises: { exerciseId: string; targetSets: number; targetReps: number; restTimer?: number }[], folderId: string | null) => void;
  exercises: Exercise[];
  folders: Folder[];
}

export function CreateRoutineModal({ visible, onClose, onCreate, exercises, folders }: Props) {
  const [name, setName] = useState('');
  const [selFolder, setSelFolder] = useState<string | null>(null);
  const [reList, setReList] = useState<{ exerciseId: string; targetSets: number; targetReps: number }[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const addEx = (ex: Exercise) => {
    setReList(p => [...p, { exerciseId: ex.id, targetSets: 3, targetReps: 10 }]);
    setShowPicker(false);
  };

  const removeEx = (i: number) => setReList(p => p.filter((_, j) => j !== i));

  const updateEx = (i: number, f: string, v: number) => {
    setReList(p => p.map((e, j) => j === i ? { ...e, [f]: v } : e));
  };

  const handleCreate = () => {
    if (name.trim() && reList.length > 0) {
      onCreate(name.trim(), reList, selFolder);
      setName(''); setReList([]); setSelFolder(null); onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.ov}>
        <View style={s.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={s.title}>NEW ROUTINE</Text>
            <TextInput style={s.input} placeholder="Routine name" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} autoFocus />
            <Text style={s.lbl}>FOLDER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.fRow}>
              <TouchableOpacity style={[s.fChip, !selFolder && s.fActive]} onPress={() => setSelFolder(null)}>
                <Text style={[s.fTxt, !selFolder && s.fTxtA]}>None</Text>
              </TouchableOpacity>
              {folders.map(f => (
                <TouchableOpacity key={f.id} style={[s.fChip, selFolder === f.id && s.fActive]} onPress={() => setSelFolder(f.id)}>
                  <View style={[s.fDot, { backgroundColor: f.color || Colors.primary }]} />
                  <Text style={[s.fTxt, selFolder === f.id && s.fTxtA]}>{f.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.lbl}>EXERCISES ({reList.length})</Text>
            {reList.map((re, i) => {
              const ex = exercises.find(e => e.id === re.exerciseId);
              return (
                <View key={i} style={s.eItem}>
                  <View style={s.eInfo}>
                    <Text style={s.eName}>{ex?.name || 'Unknown'}</Text>
                    <Text style={s.eMuscle}>{ex?.muscle}</Text>
                  </View>
                  <View style={s.eCtrl}>
                    <View style={s.cnt}>
                      <TouchableOpacity onPress={() => updateEx(i, 'targetSets', Math.max(1, re.targetSets - 1))}><Text style={s.cBtn}>-</Text></TouchableOpacity>
                      <Text style={s.cVal}>{re.targetSets}x</Text>
                      <TouchableOpacity onPress={() => updateEx(i, 'targetSets', re.targetSets + 1)}><Text style={s.cBtn}>+</Text></TouchableOpacity>
                    </View>
                    <View style={s.cnt}>
                      <TouchableOpacity onPress={() => updateEx(i, 'targetReps', Math.max(1, re.targetReps - 1))}><Text style={s.cBtn}>-</Text></TouchableOpacity>
                      <Text style={s.cVal}>{re.targetReps}</Text>
                      <TouchableOpacity onPress={() => updateEx(i, 'targetReps', re.targetReps + 1)}><Text style={s.cBtn}>+</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => removeEx(i)}><Text style={s.rm}>X</Text></TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity style={s.addBtn} onPress={() => setShowPicker(true)}>
              <Text style={s.addTxt}>+ ADD EXERCISE</Text>
            </TouchableOpacity>
            <View style={s.btns}>
              <TouchableOpacity style={s.cBtn2} onPress={onClose}><Text style={s.cTxt}>CANCEL</Text></TouchableOpacity>
              <TouchableOpacity style={[s.crBtn, (!reList.length || !name.trim()) && { opacity: 0.5 }]} onPress={handleCreate}><Text style={s.crTxt}>CREATE</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <View style={s.ov}>
          <View style={[s.modal, { maxHeight: '70%' }]}>
            <Text style={s.title}>SELECT EXERCISE</Text>
            <ScrollView>
              {exercises.map(ex => (
                <TouchableOpacity key={ex.id} style={s.eOpt} onPress={() => addEx(ex)}>
                  <Text style={s.eOptN}>{ex.name}</Text>
                  <Text style={s.eOptM}>{ex.muscle} | {ex.equipment}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.cBtn2} onPress={() => setShowPicker(false)}><Text style={s.cTxt}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const s = StyleSheet.create({
  ov: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  modal: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, width: '100%', maxWidth: 400, maxHeight: '85%', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.lg },
  input: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  lbl: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.sm },
  fRow: { marginBottom: Spacing.lg },
  fChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.surfaceLight, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  fActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  fDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  fTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  fTxtA: { color: Colors.white },
  eItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  eInfo: { flex: 1 },
  eName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  eMuscle: { fontSize: 10, color: Colors.textMuted },
  eCtrl: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cnt: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: BorderRadius.sm, paddingHorizontal: 6 },
  cBtn: { fontSize: 16, fontWeight: '800', color: Colors.primary, paddingHorizontal: 6, paddingVertical: 2 },
  cVal: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text, minWidth: 30, textAlign: 'center' },
  rm: { fontSize: 14, color: Colors.textMuted, paddingHorizontal: 6 },
  addBtn: { borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg },
  addTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  btns: { flexDirection: 'row', gap: Spacing.sm },
  cBtn2: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center' },
  cTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
  crBtn: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  crTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  eOpt: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  eOptN: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  eOptM: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
