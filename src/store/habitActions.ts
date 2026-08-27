import { Habit } from '@/types';
import { generateId } from '@/utils';

export const habitActions = (set: any, get: any) => ({
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    set((state: any) => ({
      habits: [{ ...habit, id: generateId(), completedDates: [], streak: 0 }, ...state.habits],
    }));
  },

  toggleHabit: (habitId: string, date: string) => {
    set((state: any) => ({
      habits: state.habits.map((h: any) =>
        h.id === habitId
          ? {
              ...h,
              completedDates: h.completedDates.includes(date)
                ? h.completedDates.filter((d: string) => d !== date)
                : [...h.completedDates, date],
            }
          : h
      ),
    }));
  },

  deleteHabit: (id: string) => {
    set((state: any) => ({
      habits: state.habits.filter((h: any) => h.id !== id),
    }));
  },
});
