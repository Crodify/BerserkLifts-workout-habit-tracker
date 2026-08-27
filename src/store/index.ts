import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '@/types';
import { defaultProfile, defaultExercises, defaultFriends, defaultSettings } from './defaults';
import { workoutSessionActions } from './workoutSessionActions';
import { workoutSetActions } from './workoutSetActions';
import { workoutCompletionActions } from './workoutCompletionActions';
import { routineActions } from './routineActions';
import { exerciseActions } from './exerciseActions';
import { folderActions } from './folderActions';
import { habitActions } from './habitActions';
import { measurementActions } from './measurementActions';
import { settingsActions } from './settingsActions';
import { utilityActions } from './utilityActions';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      workouts: [],
      activeWorkout: null,
      routines: [],
      folders: [],
      habits: [],
      exercises: defaultExercises,
      personalRecords: [],
      bodyMeasurements: [],
      friends: defaultFriends,
      settings: defaultSettings,

      ...workoutSessionActions(set, get),
      ...workoutSetActions(set, get),
      ...workoutCompletionActions(set, get),
      ...routineActions(set, get),
      ...exerciseActions(set, get),
      ...folderActions(set, get),
      ...habitActions(set, get),
      ...measurementActions(set, get),
      ...settingsActions(set, get),
      ...utilityActions(set, get),
    }),
    {
      name: 'arise-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        workouts: state.workouts,
        routines: state.routines,
        folders: state.folders,
        habits: state.habits,
        exercises: state.exercises,
        personalRecords: state.personalRecords,
        bodyMeasurements: state.bodyMeasurements,
        settings: state.settings,
      }),
    }
  )
);
