import { Exercise } from '@/types';
import { generateId } from '@/utils';

export const exerciseActions = (set: any, get: any) => ({
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => {
    set((state: any) => ({
      exercises: [{ ...exercise, id: generateId(), isCustom: true }, ...state.exercises],
    }));
  },

  deleteCustomExercise: (id: string) => {
    set((state: any) => ({
      exercises: state.exercises.filter((e: any) => e.id !== id),
    }));
  },
});
