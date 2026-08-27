import { create } from 'zustand';
import { AppState, Workout, Routine, Habit, BodyMeasurement, Friend } from '@/types';
import { calculateLevel, calculateRank } from '@/constants/rpg';
import { generateId } from '@/utils';

const defaultProfile = {
  id: '1',
  name: 'Hunter',
  avatar: '⚔️',
  xp: 0,
  level: 1,
  rank: 'E' as const,
  totalWorkouts: 0,
  totalVolume: 0,
  currentStreak: 0,
  longestStreak: 0,
  joinDate: new Date().toISOString(),
};

const defaultExercises = [
  { id: '1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Squat', muscle: 'Legs', equipment: 'Barbell' },
  { id: '3', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell' },
  { id: '5', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell' },
  { id: '6', name: 'Pull Up', muscle: 'Back', equipment: 'Bodyweight' },
  { id: '7', name: 'Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: '8', name: 'Tricep Pushdown', muscle: 'Arms', equipment: 'Cable' },
  { id: '9', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine' },
  { id: '10', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable' },
];

const defaultFriends: Friend[] = [
  { id: '1', name: 'Guts', avatar: '⚔️', xp: 8500, rank: 'B', totalVolume: 125000 },
  { id: '2', name: 'Griffith', avatar: '🦅', xp: 12000, rank: 'A', totalVolume: 180000 },
  { id: '3', name: 'Casca', avatar: '🛡️', xp: 5200, rank: 'C', totalVolume: 78000 },
];

// XP Calculation: sets * reps * (weight / 10 + 5)
const calculateWorkoutXP = (sets: number, reps: number, weight: number): number => {
  const baseXP = sets * reps * Math.max(1, weight / 10 + 5);
  return Math.round(baseXP);
};

export const useStore = create<AppState>((set, get) => ({
  profile: defaultProfile,
  workouts: [],
  routines: [],
  habits: [],
  exercises: defaultExercises,
  friends: defaultFriends,
  bodyMeasurements: [],

  logWorkout: (exercise: { exerciseName: string; sets: number; reps: number; weight: number }) => {
    const { profile } = get();
    const xpGained = calculateWorkoutXP(exercise.sets, exercise.reps, exercise.weight);
    const newXP = profile.xp + xpGained;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > profile.level;
    const newRank = calculateRank(newLevel);

    const newWorkout: Workout = {
      id: generateId(),
      exerciseName: exercise.exerciseName,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      date: new Date().toISOString(),
      xpGained,
    };

    set((state) => ({
      profile: {
        ...state.profile,
        xp: newXP,
        level: newLevel,
        rank: newRank,
        totalWorkouts: state.profile.totalWorkouts + 1,
        totalVolume: state.profile.totalVolume + exercise.weight * exercise.sets * exercise.reps,
      },
      workouts: [newWorkout, ...state.workouts],
    }));

    return { xpGained, leveledUp, newLevel };
  },

  addHabit: (name: string) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      icon: '✓',
      completed: false,
      completedDates: [],
    };
    set((state) => ({ habits: [newHabit, ...state.habits] }));
  },

  toggleHabit: (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completed: !h.completed,
              completedDates: h.completed
                ? h.completedDates.filter((d) => d !== today)
                : [...h.completedDates, today],
            }
          : h
      ),
    }));
  },

  completeHabit: (habitId: string) => {
    const { profile } = get();
    const xpReward = 50;
    const newXP = profile.xp + xpReward;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > profile.level;
    const newRank = calculateRank(newLevel);

    set((state) => ({
      profile: {
        ...state.profile,
        xp: newXP,
        level: newLevel,
        rank: newRank,
      },
    }));

    get().toggleHabit(habitId);
    return { xpGained: xpReward, leveledUp, newLevel };
  },
}));
