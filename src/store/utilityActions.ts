import { ExerciseHistory } from '@/types';
import { calculateLevel, calculateRank } from '@/constants/rpg';

export const utilityActions = (set: any, get: any) => ({
  addXP: (amount: number) => {
    const { profile } = get();
    const newXP = profile.xp + amount;
    const newLevel = calculateLevel(newXP);
    const newRank = calculateRank(newLevel);

    set({
      profile: {
        ...profile,
        xp: newXP,
        level: newLevel,
        rank: newRank,
      },
    });
  },

  getExerciseHistory: (exerciseId: string): ExerciseHistory | null => {
    const { workouts } = get();
    const exerciseWorkouts = workouts
      .filter((w: any) => w.exercises.some((e: any) => e.exerciseId === exerciseId))
      .map((w: any) => {
        const exercise = w.exercises.find((e: any) => e.exerciseId === exerciseId)!;
        return {
          workoutId: w.id,
          date: w.date,
          sets: exercise.sets
            .filter((s: any) => s.completed)
            .map((s: any) => ({ weight: s.weight, reps: s.reps })),
          totalVolume: exercise.sets
            .filter((s: any) => s.completed)
            .reduce((sum: number, s: any) => sum + s.weight * s.reps, 0),
        };
      })
      .filter((w: any) => w.sets.length > 0);

    if (exerciseWorkouts.length === 0) return null;

    return {
      exerciseId,
      workouts: exerciseWorkouts,
    };
  },

  getPersonalRecords: (exerciseId: string) => {
    const { personalRecords } = get();
    return personalRecords.filter((pr: any) => pr.exerciseId === exerciseId);
  },
});
