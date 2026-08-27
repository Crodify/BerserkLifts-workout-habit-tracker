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

export const useStore = create<AppState>((set, get) => ({
  profile: defaultProfile,
  workouts: [],
  routines: [
    {
      id: '1',
      name: 'Push Day',
      exercises: [
        { exerciseId: '1', targetSets: 4, targetReps: 8 },
        { exerciseId: '4', targetSets: 4, targetReps: 10 },
        { exerciseId: '8', targetSets: 3, targetReps: 12 },
      ],
      folderId: null,
    },
    {
      id: '2',
      name: 'Pull Day',
      exercises: [
        { exerciseId: '3', targetSets: 4, targetReps: 6 },
        { exerciseId: '5', targetSets: 4, targetReps: 8 },
        { exerciseId: '6', targetSets: 3, targetReps: 10 },
      ],
      folderId: null,
    },
    {
      id: '3',
      name: 'Leg Day',
      exercises: [
        { exerciseId: '2', targetSets: 4, targetReps: 8 },
        { exerciseId: '9', targetSets: 4, targetReps: 12 },
        { exerciseId: '10', targetSets: 3, targetReps: 12 },
      ],
      folderId: null,
    },
  ],
  folders: [],
  habits: [
    { id: '1', name: 'Drink Water', icon: '💧', completedDates: [], streak: 0 },
    { id: '2', name: 'Sleep 8 Hours', icon: '😴', completedDates: [], streak: 0 },
    { id: '3', name: 'Stretch', icon: '🧘', completedDates: [], streak: 0 },
  ],
  exercises: defaultExercises,
  personalRecords: [],
  bodyMeasurements: [],
  friends: defaultFriends,

  addWorkout: (workout) => {
    const newWorkout: Workout = {
      ...workout,
      id: generateId(),
      date: new Date().toISOString(),
    };
    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
      profile: {
        ...state.profile,
        totalWorkouts: state.profile.totalWorkouts + 1,
        totalVolume: state.profile.totalVolume + newWorkout.totalVolume,
      },
    }));
    get().addXP(Math.floor(newWorkout.totalVolume / 1000) * 10);
  },

  addRoutine: (routine) => {
    const newRoutine: Routine = {
      ...routine,
      id: generateId(),
    };
    set((state) => ({
      routines: [...state.routines, newRoutine],
    }));
  },

  deleteRoutine: (id) => {
    set((state) => ({
      routines: state.routines.filter((r) => r.id !== id),
    }));
  },

  addHabit: (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      completedDates: [],
      streak: 0,
    };
    set((state) => ({
      habits: [...state.habits, newHabit],
    }));
  },

  toggleHabit: (habitId, date) => {
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h.id !== habitId) return h;
        const completed = h.completedDates.includes(date);
        const newDates = completed
          ? h.completedDates.filter((d) => d !== date)
          : [...h.completedDates, date];
        return { ...h, completedDates: newDates };
      }),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }));
  },

  addBodyMeasurement: (measurement) => {
    set((state) => ({
      bodyMeasurements: [...state.bodyMeasurements, measurement],
    }));
  },

  addXP: (amount) => {
    set((state) => {
      const newXP = state.profile.xp + amount;
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newLevel);
      return {
        profile: {
          ...state.profile,
          xp: newXP,
          level: newLevel,
          rank: newRank,
        },
      };
    });
  },
}));
