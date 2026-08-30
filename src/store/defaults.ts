import { Exercise, Friend } from '@/types';

export const defaultProfile = {
  id: 'user',
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
  preferredUnit: 'kg' as const,
  totalPRs: 0,
};

export const defaultExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Incline Bench Press', muscle: 'Chest', equipment: 'Barbell' },
  { id: '3', name: 'Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell' },
  { id: '4', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell' },
  { id: '5', name: 'Chest Fly', muscle: 'Chest', equipment: 'Dumbbell' },
  { id: '6', name: 'Push Ups', muscle: 'Chest', equipment: 'Bodyweight' },
  { id: '7', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell' },
  { id: '8', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell' },
  { id: '9', name: 'Pull Up', muscle: 'Back', equipment: 'Bodyweight' },
  { id: '10', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable' },
  { id: '11', name: 'Dumbbell Row', muscle: 'Back', equipment: 'Dumbbell' },
  { id: '12', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable' },
  { id: '13', name: 'Squat', muscle: 'Legs', equipment: 'Barbell' },
  { id: '14', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine' },
  { id: '15', name: 'Romanian Deadlift', muscle: 'Legs', equipment: 'Barbell' },
  { id: '16', name: 'Leg Curl', muscle: 'Legs', equipment: 'Machine' },
  { id: '17', name: 'Leg Extension', muscle: 'Legs', equipment: 'Machine' },
  { id: '18', name: 'Lunges', muscle: 'Legs', equipment: 'Dumbbell' },
  { id: '19', name: 'Calf Raise', muscle: 'Legs', equipment: 'Machine' },
  { id: '20', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell' },
  { id: '21', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { id: '22', name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { id: '23', name: 'Front Raise', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { id: '24', name: 'Face Pull', muscle: 'Shoulders', equipment: 'Cable' },
  { id: '25', name: 'Barbell Curl', muscle: 'Arms', equipment: 'Barbell' },
  { id: '26', name: 'Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: '27', name: 'Hammer Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: '28', name: 'Tricep Pushdown', muscle: 'Arms', equipment: 'Cable' },
  { id: '29', name: 'Skull Crusher', muscle: 'Arms', equipment: 'Barbell' },
  { id: '30', name: 'Close Grip Bench Press', muscle: 'Arms', equipment: 'Barbell' },
];

export const defaultFriends: Friend[] = [];

export const defaultSettings = {
  weightUnit: 'kg' as const,
  defaultRestTimer: 90,
  autoStartRestTimer: true,
  theme: 'dark' as const,
  weeklyWorkoutGoal: 5,
  bodyWeightGoal: 0,
};
