import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SETTINGS_ITEMS = [
  {
    key: 'keepAwake',
    title: 'Keep Awake During Workout',
    description: "Enable this if you don't want your phone to sleep while you're in a workout",
  },
  {
    key: 'plateCalculator',
    title: 'Plate Calculator',
    description: 'A plate calculator calculates the plates needed on a bar to achieve a specific weight. When enabled, a Calculator button will appear when inputting weight for barbell exercises.',
  },
  {
    key: 'rpeTracking',
    title: 'RPE Tracking',
    description: 'RPE (Rated Perceived Exertion) is a measure of the intensity an exercise. Enabling RPE tracking will allow you to log it for each set in your workouts.',
  },
  {
    key: 'smartSupersetScrolling',
    title: 'Smart Superset Scrolling',
    description: "When you complete a set, it'll automatically scroll to the next exercise in the superset.",
  },
  {
    key: 'inlineTimer',
    title: 'Inline Timer',
    description: 'Duration exercises have a built-in stopwatch for tracking time for each set',
  },
  {
    key: 'livePRNotification',
    title: 'Live Personal Record Notification',
    description: "When enabled, it'll notify you when you achieve a Personal Record upon checking the set.",
  },
];

export function WorkoutSettingsScreen({ visible, onClose }: Props) {
  const { settings, setAutoStartRestTimer, setDefaultRestTimer } = useStore();

  const [localSettings, setLocalSettings] = useState({
    keepAwake: true,
    plateCalculator: true,
    rpeTracking: false,
    smartSupersetScrolling: true,
    inlineTimer: true,
    livePRNotification: true,
  });

  const toggleSetting = (key: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.headerRow}>
            <Text style={s.title}>Workout Settings</Text>
            <TouchableOpacity style={s.doneBtn} onPress={onClose}>
              <Text style={s.doneTxt}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {SETTINGS_ITEMS.map((item, i) => (
              <View key={item.key} style={[s.settingRow, i < SETTINGS_ITEMS.length - 1 && s.settingRowBorder]}>
                <View style={s.settingInfo}>
                  <Text style={s.settingTitle}>{item.title}</Text>
                  <Text style={s.settingDesc}>{item.description}</Text>
                </View>
                <Switch
                  value={(localSettings as any)[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '60' }}
                  thumbColor={(localSettings as any)[item.key] ? Colors.primary : Colors.textSecondary}
                />
              </View>
            ))}

            {/* Additional Settings */}
            <View style={[s.settingRow, s.settingRowBorder]}>
              <View style={s.settingInfo}>
                <Text style={s.settingTitle}>Auto-Start Rest Timer</Text>
                <Text style={s.settingDesc}>Automatically start rest timer after completing a set</Text>
              </View>
              <Switch
                value={settings.autoStartRestTimer}
                onValueChange={setAutoStartRestTimer}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primary + '60' }}
                thumbColor={settings.autoStartRestTimer ? Colors.primary : Colors.textSecondary}
              />
            </View>

            <View style={s.settingRow}>
              <View style={s.settingInfo}>
                <Text style={s.settingTitle}>Default Rest Timer</Text>
                <Text style={s.settingDesc}>Current: {Math.floor(settings.defaultRestTimer / 60)}:{String(settings.defaultRestTimer % 60).padStart(2, '0')}</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  doneBtn: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  doneTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingInfo: { flex: 1, marginRight: Spacing.md },
  settingTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  settingDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
