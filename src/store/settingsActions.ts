import { WeightUnit } from '@/types';

export const settingsActions = (set: any, get: any) => ({
  setWeightUnit: (unit: WeightUnit) => {
    set((state: any) => ({
      settings: { ...state.settings, weightUnit: unit },
      profile: { ...state.profile, preferredUnit: unit },
    }));
  },

  setDefaultRestTimer: (seconds: number) => {
    set((state: any) => ({
      settings: { ...state.settings, defaultRestTimer: seconds },
    }));
  },

  setAutoStartRestTimer: (enabled: boolean) => {
    set((state: any) => ({
      settings: { ...state.settings, autoStartRestTimer: enabled },
    }));
  },
});
