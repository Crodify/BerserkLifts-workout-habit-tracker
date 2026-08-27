import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useStore } from '@/store';
import { MusclePickerScreen } from './MusclePickerScreen';
import { SetLoggingScreen } from './SetLoggingScreen';
import { LevelUpPopup } from './LevelUpPopup';

interface LogWorkoutFlowProps {
  visible: boolean;
  onClose: () => void;
}

export function LogWorkoutFlow({ visible, onClose }: LogWorkoutFlowProps) {
  const store = useStore();
  const [screen, setScreen] = useState<'muscles' | 'sets'>('muscles');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ newLevel: 0 });

  if (!visible) return null;

  const handleMusclePickerNext = (muscles: string[]) => {
    setSelectedMuscles(muscles);
    setScreen('sets');
  };

  const handleSetLoggingSubmit = (data: { exerciseName: string; sets: number; reps: number; weight: number }) => {
    store.addXP(50);
    resetAndClose();
  };

  const handleSetLoggingBack = () => {
    setScreen('muscles');
  };

  const resetAndClose = () => {
    setScreen('muscles');
    setSelectedMuscles([]);
    setShowLevelUp(false);
    onClose();
  };

  return (
    <View style={styles.container}>
      {screen === 'muscles' && (
        <MusclePickerScreen onNext={handleMusclePickerNext} />
      )}
      {screen === 'sets' && (
        <SetLoggingScreen
          selectedMuscles={selectedMuscles}
          onSubmit={handleSetLoggingSubmit}
          onBack={handleSetLoggingBack}
        />
      )}

      <LevelUpPopup
        visible={showLevelUp}
        newLevel={levelUpData.newLevel}
        onFinish={() => setShowLevelUp(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
