import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
}

const FOLDER_COLORS = [
  '#FF1A3C', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

export function CreateFolderModal({ visible, onClose, onCreate, initialName, initialColor }: CreateFolderModalProps) {
  const [name, setName] = useState(initialName || '');
  const [color, setColor] = useState(initialColor || FOLDER_COLORS[0]);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), color);
      setName('');
      setColor(FOLDER_COLORS[0]);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>NEW FOLDER</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Folder name"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={styles.label}>COLOR</Text>
          <View style={styles.colorRow}>
            {FOLDER_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorOption, { backgroundColor: c }, color === c && styles.colorSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createText}>CREATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  createButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  createText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
});
