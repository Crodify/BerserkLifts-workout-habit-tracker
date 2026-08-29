import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}

export function ExercisePickerModal({ visible, onClose, onSelect }: Props) {
  const { exercises } = useStore();
  const [search, setSearch] = useState('');

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.muscle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.ov}>
        <View style={s.modal}>
          <Text style={s.title}>SELECT EXERCISE</Text>
          <TextInput
            style={s.search}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          <ScrollView style={s.list}>
            {filtered.map(ex => (
              <TouchableOpacity key={ex.id} style={s.item} onPress={() => { onSelect(ex.id); setSearch(''); }} activeOpacity={0.7}>
                <Text style={s.name}>{ex.name}</Text>
                <Text style={s.info}>{ex.muscle} · {ex.equipment}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setSearch(''); onClose(); }}>
            <Text style={s.cancelTxt}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  ov: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end', padding: Spacing.lg },
  modal: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, maxHeight: '75%', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md },
  search: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  list: { maxHeight: 400 },
  item: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  info: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  cancelBtn: { padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center', marginTop: Spacing.md },
  cancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
});
