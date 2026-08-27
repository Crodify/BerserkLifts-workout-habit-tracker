import { Routine } from '@/types';
import { generateId } from '@/utils';

export const routineActions = (set: any, get: any) => ({
  addRoutine: (routine: Omit<Routine, 'id'>) => {
    set((state: any) => ({
      routines: [{ ...routine, id: generateId() }, ...state.routines],
    }));
  },

  updateRoutine: (id: string, updates: Partial<Routine>) => {
    set((state: any) => ({
      routines: state.routines.map((r: any) => r.id === id ? { ...r, ...updates } : r),
    }));
  },

  deleteRoutine: (id: string) => {
    set((state: any) => ({
      routines: state.routines.filter((r: any) => r.id !== id),
    }));
  },
});
