import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const ICONS = [
  '💪', '🏃', '🧘', '📖', '💧', '🥗', '😴', '🧠',
  '💊', '🚶', '🏋️', '🚴', '🎯', '✍️', '🎵', '🧹',
  '🌅', '📱', '🚭', '☕', '🍎', '🦷', '🫁', '🧊',
];

const CATEGORIES = [
  { id: 'fitness', label: 'Fitness', icon: '🏋️' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
  { id: 'mindset', label: 'Mindset', icon: '🧠' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { id: 'productivity', label: 'Productivity', icon: '🎯' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, icon: string, category?: string) => void;
}

export function AddHabitModal({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💪');
  const [category, setCategory] = useState('fitness');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), icon, category);
    setName('');
    setIcon('💪');
    setCategory('fitness');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <Text style={s.title}>NEW HABIT</Text>

          {/* Name Input */}
          <Text style={s.label}>NAME</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Push-ups"
            placeholderTextColor={Colors.textMuted}
            maxLength={40}
            autoFocus
          />

          {/* Icon Grid */}
          <Text style={s.label}>ICON</Text>
          <View style={s.iconGrid}>
            {ICONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={[s.iconBtn, icon === ic && s.iconBtnActive]}
                onPress={() => setIcon(ic)}
              >
                <Text style={s.iconText}>{ic}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={s.label}>CATEGORY</Text>
          <View style={s.catRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catBtn, category === cat.id && s.catBtnActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={s.catIcon}>{cat.icon}</Text>
                <Text style={[s.catLabel, category === cat.id && s.catLabelActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={s.btnRow}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelTxt}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.createBtn, !name.trim() && s.createBtnDisabled]}
              onPress={handleCreate}
              disabled={!name.trim()}
            >
              <Text style={s.createTxt}>CREATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.lg, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.lg },
  label: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  iconBtn: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  iconBtnActive: { backgroundColor: Colors.primarySubtle, borderColor: Colors.primary },
  iconText: { fontSize: 20 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  catBtnActive: { backgroundColor: Colors.primarySubtle, borderColor: Colors.primary },
  catIcon: { fontSize: 14, marginRight: Spacing.xs },
  catLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  catLabelActive: { color: Colors.primary },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  cancelBtn: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, alignItems: 'center' },
  cancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  createBtn: { flex: 2, padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  createBtnDisabled: { opacity: 0.4 },
  createTxt: { fontSize: FontSize.sm, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
});
