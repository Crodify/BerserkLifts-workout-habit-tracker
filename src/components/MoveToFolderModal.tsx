import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Folder } from '@/types';

interface Props {
  visible: boolean;
  routineName: string;
  folders: Folder[];
  currentFolderId: string | null;
  onClose: () => void;
  onMove: (folderId: string) => void;
  onRemoveFromFolder: () => void;
}

export function MoveToFolderModal({ visible, routineName, folders, currentFolderId, onClose, onMove, onRemoveFromFolder }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.ov}>
        <View style={s.modal}>
          <Text style={s.title}>MOVE ROUTINE</Text>
          <Text style={s.subtitle}>"{routineName}"</Text>
          <ScrollView style={s.list}>
            {folders.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[s.item, currentFolderId === f.id && s.itemActive]}
                onPress={() => { onMove(f.id); onClose(); }}
                activeOpacity={0.7}
              >
                <View style={[s.dot, { backgroundColor: f.color || Colors.primary }]} />
                <Text style={s.itemText}>{f.name}</Text>
                {currentFolderId === f.id && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            ))}
            {currentFolderId && (
              <TouchableOpacity style={s.removeBtn} onPress={() => { onRemoveFromFolder(); onClose(); }} activeOpacity={0.7}>
                <Text style={s.removeTxt}>Remove from folder</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
            <Text style={s.cancelTxt}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  ov: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end', padding: Spacing.lg },
  modal: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  list: { maxHeight: 300, marginBottom: Spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.xs, backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.border },
  itemActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySubtle },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.md },
  itemText: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  check: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '900' },
  removeBtn: { padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.error, marginTop: Spacing.sm, alignItems: 'center' },
  removeTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.error },
  cancelBtn: { padding: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, alignItems: 'center' },
  cancelTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1 },
});
