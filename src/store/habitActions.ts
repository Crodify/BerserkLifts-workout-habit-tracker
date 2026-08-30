import { Habit } from '@/types';
import { generateId } from '@/utils';
import { calculateLevel, calculateRank } from '@/constants/rpg';
import { pushAllToSupabase } from '@/lib/syncUtils';
import { supabase } from '@/lib/supabase';

const XP_HABIT_BONUS = 10; // XP per habit completed

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse(); // newest first
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must include today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diffDays = Math.floor((current.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const habitActions = (set: any, get: any) => ({
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    set((state: any) => ({
      habits: [{ ...habit, id: generateId(), completedDates: [], streak: 0 }, ...state.habits],
    }));
  },

  toggleHabit: (habitId: string, date: string) => {
    const state = get();
    const habit = state.habits.find((h: any) => h.id === habitId);
    if (!habit) return;

    const wasCompleted = habit.completedDates.includes(date);
    const newDates = wasCompleted
      ? habit.completedDates.filter((d: string) => d !== date)
      : [...habit.completedDates, date];
    const newStreak = calculateStreak(newDates);

    // Update habits
    set((state: any) => ({
      habits: state.habits.map((h: any) =>
        h.id === habitId
          ? { ...h, completedDates: newDates, streak: newStreak }
          : h
      ),
    }));

    // Award XP when completing (not uncompleting)
    if (!wasCompleted) {
      const { profile } = get();
      const oldLevel = calculateLevel(profile.xp);
      const newXP = profile.xp + XP_HABIT_BONUS;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);
      const leveledUp = newLevel > oldLevel;

      set({
        profile: {
          ...profile,
          xp: newXP,
          level: newLevel,
          rank: newRank,
        },
      });
    }

    // Auto-sync to Supabase after habit toggle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        pushAllToSupabase(session.user.id, get());
      }
    });
  },

  deleteHabit: (id: string) => {
    set((state: any) => ({
      habits: state.habits.filter((h: any) => h.id !== id),
    }));
  },
});
