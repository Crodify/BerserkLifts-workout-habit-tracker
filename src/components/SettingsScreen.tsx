import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { exportData, importData, clearAllData, getBackupInfo } from '@/utils/dataUtils';

const REST_TIMER_OPTIONS = [30, 60, 90, 120, 180, 300];
const GOAL_OPTIONS = [3, 4, 5, 6, 7]; // workouts per week

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsScreen({ visible, onClose }: Props) {
  const { settings, setWeightUnit, setDefaultRestTimer, setAutoStartRestTimer, setWeeklyWorkoutGoal, setBodyWeightGoal } = useStore();
  const [showRestPicker, setShowRestPicker] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showWeightGoal, setShowWeightGoal] = useState(false);
  const [weightGoalInput, setWeightGoalInput] = useState(String(settings.bodyWeightGoal || ''));
  const [backupInfo, setBackupInfo] = useState({ hasData: false, size: '0 KB' });
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (visible) getBackupInfo().then(setBackupInfo);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.headerRow}>
            <Text style={s.title}>SETTINGS</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Units */}
            <Text style={s.sectionLabel}>WEIGHT UNIT</Text>
            <View style={s.segmentRow}>
              <TouchableOpacity
                style={[s.segBtn, settings.weightUnit === 'kg' && s.segBtnActive]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[s.segTxt, settings.weightUnit === 'kg' && s.segTxtActive]}>KG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.segBtn, settings.weightUnit === 'lbs' && s.segBtnActive]}
                onPress={() => setWeightUnit('lbs')}
              >
                <Text style={[s.segTxt, settings.weightUnit === 'lbs' && s.segTxtActive]}>LBS</Text>
              </TouchableOpacity>
            </View>

            {/* Rest Timer */}
            <Text style={s.sectionLabel}>DEFAULT REST TIMER</Text>
            <TouchableOpacity style={s.settingRow} onPress={() => setShowRestPicker(true)}>
              <Text style={s.settingIcon}>⏱️</Text>
              <Text style={s.settingText}>Rest Duration</Text>
              <Text style={s.settingValue}>{Math.floor(settings.defaultRestTimer / 60)}:{String(settings.defaultRestTimer % 60).padStart(2, '0')}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            <View style={s.settingRow}>
              <Text style={s.settingIcon}>🔔</Text>
              <Text style={s.settingText}>Auto-Start Rest Timer</Text>
              <TouchableOpacity
                style={[s.toggle, settings.autoStartRestTimer && s.toggleOn]}
                onPress={() => setAutoStartRestTimer(!settings.autoStartRestTimer)}
              >
                <View style={[s.toggleDot, settings.autoStartRestTimer && s.toggleDotOn]} />
              </TouchableOpacity>
            </View>

            {/* Workout Goals */}
            <Text style={s.sectionLabel}>WORKOUT GOALS</Text>
            <TouchableOpacity style={s.settingRow} onPress={() => setShowGoalPicker(true)}>
              <Text style={s.settingIcon}>🎯</Text>
              <Text style={s.settingText}>Weekly Workout Goal</Text>
              <Text style={s.settingValue}>{settings.weeklyWorkoutGoal || 5}x / week</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.settingRow} onPress={() => { setWeightGoalInput(String(settings.bodyWeightGoal || '')); setShowWeightGoal(true); }}>
              <Text style={s.settingIcon}>⚖️</Text>
              <Text style={s.settingText}>Body Weight Goal</Text>
              <Text style={s.settingValue}>{settings.bodyWeightGoal ? `${settings.bodyWeightGoal} kg` : '—'}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            {/* Appearance */}
            <Text style={s.sectionLabel}>APPEARANCE</Text>
            <View style={s.settingRow}>
              <Text style={s.settingIcon}>🎨</Text>
              <Text style={s.settingText}>Theme</Text>
              <Text style={s.settingValue}>Dark</Text>
            </View>

            <View style={s.settingRow}>
              <Text style={s.settingIcon}>📐</Text>
              <Text style={s.settingText}>Distance Unit</Text>
              <Text style={s.settingValue}>km</Text>
            </View>

            {/* Data */}
            <Text style={s.sectionLabel}>DATA MANAGEMENT</Text>
            <View style={s.settingRow}>
              <Text style={s.settingIcon}>💾</Text>
              <Text style={s.settingText}>Backup Size</Text>
              <Text style={s.settingValue}>{backupInfo.size}</Text>
            </View>

            <TouchableOpacity
              style={[s.settingRow, exporting && { opacity: 0.5 }]}
              onPress={async () => {
                setExporting(true);
                const success = await exportData();
                setExporting(false);
                if (success) Alert.alert('Export Complete', 'Your data has been shared.');
                else Alert.alert('Export Failed', 'Could not export data.');
              }}
              disabled={exporting}
            >
              <Text style={s.settingIcon}>📤</Text>
              <Text style={s.settingText}>{exporting ? 'Exporting...' : 'Export Backup'}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.settingRow, importing && { opacity: 0.5 }]}
              onPress={async () => {
                Alert.alert(
                  'Import Data',
                  'This will replace all current data with the backup. This cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Import',
                      onPress: async () => {
                        setImporting(true);
                        const result = await importData();
                        setImporting(false);
                        if (result.success) {
                          Alert.alert('Import Complete', result.message + '\n\nRestart the app to see changes.', [{ text: 'OK' }]);
                        } else if (result.message !== 'Import cancelled') {
                          Alert.alert('Import Failed', result.message);
                        }
                      },
                    },
                  ]
                );
              }}
              disabled={importing}
            >
              <Text style={s.settingIcon}>📥</Text>
              <Text style={s.settingText}>{importing ? 'Importing...' : 'Import Backup'}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingRow}
              onPress={() => {
                Alert.alert(
                  'Factory Reset',
                  'This will delete ALL your workouts, habits, routines, and settings. This cannot be undone!',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete Everything',
                      style: 'destructive',
                      onPress: async () => {
                        const success = await clearAllData();
                        if (success) {
                          Alert.alert('Reset Complete', 'All data has been deleted. Restart the app.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={s.settingIcon}>🗑️</Text>
              <Text style={[s.settingText, { color: Colors.error }]}>Factory Reset</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>

        {/* Rest Timer Picker */}
        <Modal visible={showRestPicker} transparent animationType="fade" onRequestClose={() => setShowRestPicker(false)}>
          <TouchableOpacity style={s.pickerOverlay} activeOpacity={1} onPress={() => setShowRestPicker(false)}>
            <View style={s.pickerBox}>
              <Text style={s.pickerTitle}>REST DURATION</Text>
              {REST_TIMER_OPTIONS.map((sec) => (
                <TouchableOpacity
                  key={sec}
                  style={[s.pickerOpt, settings.defaultRestTimer === sec && s.pickerOptActive]}
                  onPress={() => { setDefaultRestTimer(sec); setShowRestPicker(false); }}
                >
                  <Text style={[s.pickerOptTxt, settings.defaultRestTimer === sec && s.pickerOptTxtActive]}>
                    {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Goal Picker */}
        <Modal visible={showGoalPicker} transparent animationType="fade" onRequestClose={() => setShowGoalPicker(false)}>
          <TouchableOpacity style={s.pickerOverlay} activeOpacity={1} onPress={() => setShowGoalPicker(false)}>
            <View style={s.pickerBox}>
              <Text style={s.pickerTitle}>WEEKLY GOAL</Text>
              {GOAL_OPTIONS.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[s.pickerOpt, settings.weeklyWorkoutGoal === num && s.pickerOptActive]}
                  onPress={() => { setWeeklyWorkoutGoal(num); setShowGoalPicker(false); }}
                >
                  <Text style={[s.pickerOptTxt, settings.weeklyWorkoutGoal === num && s.pickerOptTxtActive]}>{num} workouts / week</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Body Weight Goal Picker */}
        <Modal visible={showWeightGoal} transparent animationType="fade" onRequestClose={() => setShowWeightGoal(false)}>
          <TouchableOpacity style={s.pickerOverlay} activeOpacity={1} onPress={() => setShowWeightGoal(false)}>
            <View style={s.pickerBox}>
              <Text style={s.pickerTitle}>BODY WEIGHT GOAL</Text>
              <TextInput
                style={{ backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, color: Colors.text, fontSize: FontSize.lg, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.md }}
                keyboardType="decimal-pad"
                value={weightGoalInput}
                onChangeText={setWeightGoalInput}
                placeholder="Enter weight in kg"
                placeholderTextColor={Colors.textMuted}
                autoFocus
              />
              <TouchableOpacity
                style={[s.pickerOpt, s.pickerOptActive]}
                onPress={() => { setBodyWeightGoal(parseFloat(weightGoalInput) || 0); setShowWeightGoal(false); }}
              >
                <Text style={[s.pickerOptTxt, s.pickerOptTxtActive]}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.lg, paddingBottom: 40, maxHeight: '85%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  closeBtn: { fontSize: 20, color: Colors.textSecondary, fontWeight: '800' },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  segmentRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: 3, borderWidth: 1, borderColor: Colors.border },
  segBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  segBtnActive: { backgroundColor: Colors.primary },
  segTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.textSecondary },
  segTxtActive: { color: Colors.white },
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  settingIcon: { fontSize: 18, marginRight: Spacing.md },
  settingText: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  settingValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginRight: Spacing.sm },
  arrow: { fontSize: 22, color: Colors.textMuted },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: Colors.success, borderColor: Colors.success },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textSecondary },
  toggleDotOn: { alignSelf: 'flex-end', backgroundColor: Colors.white },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  pickerBox: { backgroundColor: Colors.backgroundElevated, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: 280, borderWidth: 1, borderColor: Colors.border },
  pickerTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md, textAlign: 'center' },
  pickerOpt: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.xs, alignItems: 'center' },
  pickerOptActive: { backgroundColor: Colors.primary },
  pickerOptTxt: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  pickerOptTxtActive: { color: Colors.white },
});
