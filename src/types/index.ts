import { Rank } from '@/constants/rpg';

export type WeightUnit = 'kg' | 'lbs';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  isCustom?: boolean;
}

export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  restTimer?: number; // seconds
  type?: SetType;
  supersetId?: string; // Groups exercises into supersets
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string; // Denormalized for history display
  sets: WorkoutSet[];
  notes: string;
  previousBest?: { weight: number; reps: number }; // Ghost data from last workout
  supersetId?: string; // Groups exercises into supersets
  supersetLabel?: string; // e.g. 'A', 'B' for superset display
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  date: string;
  startTime: string;
  endTime?: string;
  duration: number; // seconds
  totalVolume: number;
  xpGained?: number;
  prsHit?: string[]; // exercise IDs that hit PRs
}

export interface Routine {
  id: string;
  name: string;
  exercises: { exerciseId: string; targetSets: number; targetReps: number; restTimer?: number }[];
  folderId: string | null;
  lastUsed?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completedDates: string[];
  streak: number;
}

export interface PersonalRecord {
  exerciseId: string;
  type: '1rm' | 'maxWeight' | 'maxReps' | 'maxVolume';
  value: number;
  weight?: number; // For maxReps PR
  reps?: number; // For maxWeight PR
  date: string;
  workoutId: string;
}

export interface ExerciseHistory {
  exerciseId: string;
  workouts: {
    workoutId: string;
    date: string;
    sets: { weight: number; reps: number }[];
    totalVolume: number;
  }[];
}

export interface BodyMeasurement {
  date: string;
  weight: number;
  chest?: number;
  arms?: number;
  waist?: number;
  thighs?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: Rank;
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  preferredUnit: WeightUnit;
  totalPRs: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: Rank;
  totalVolume: number;
}

export type ChallengeMode = 'workouts' | 'volume' | 'streak' | 'habitCompletion';
export type ChallengeStatus = 'active' | 'upcoming' | 'completed';

export interface ChallengeParticipant {
  friendId: string; // 'user' for the current user
  score: number; // Current progress
  joinedAt: string;
}

export interface Challenge {
  id: string;
  name: string;
  mode: ChallengeMode;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  participants: ChallengeParticipant[];
  createdBy: string;
  description: string;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime: string;
  totalVolume: number;
}

export interface AppSettings {
  weightUnit: WeightUnit;
  defaultRestTimer: number; // seconds
  autoStartRestTimer: boolean;
  theme: 'dark'; // Only dark for now
  weeklyWorkoutGoal: number; // workouts per week
  bodyWeightGoal: number; // target weight in kg
}

export interface AppState {
  profile: UserProfile;
  workouts: Workout[];
  activeWorkout: ActiveWorkout | null;
  routines: Routine[];
  folders: Folder[];
  habits: Habit[];
  exercises: Exercise[];
  personalRecords: PersonalRecord[];
  bodyMeasurements: BodyMeasurement[];
  friends: Friend[];
  settings: AppSettings;
  
  // Workout Session Actions
  startWorkout: (name?: string, routineId?: string) => void;
  addExerciseToWorkout: (exerciseId: string) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  addSetToExercise: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, weight: number, reps: number) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  updateSetType: (exerciseId: string, setId: string, type: SetType) => void;
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  toggleSuperset: (exerciseId1: string, exerciseId2: string) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  
  // Routine Actions
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  moveRoutineToFolder: (routineId: string, folderId: string | null) => void;
  
  // Exercise Actions
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => void;
  deleteCustomExercise: (id: string) => void;
  
  // Folder Actions
  addFolder: (name: string, color?: string) => void;
  updateFolder: (id: string, name: string, color?: string) => void;
  deleteFolder: (id: string) => void;
  
  // Habit Actions
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  toggleHabit: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;
  
  // Measurement Actions
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  
  // Settings Actions
  setWeightUnit: (unit: WeightUnit) => void;
  setDefaultRestTimer: (seconds: number) => void;
  setAutoStartRestTimer: (enabled: boolean) => void;
  setWeeklyWorkoutGoal: (goal: number) => void;
  setBodyWeightGoal: (weight: number) => void;
  
  // Challenge Actions
  challenges: Challenge[];
  createChallenge: (challenge: Omit<Challenge, 'id' | 'participants' | 'status'>) => void;
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  deleteChallenge: (challengeId: string) => void;
  updateChallengeScores: () => void;

  // Utility Actions
  addXP: (amount: number) => void;
  getExerciseHistory: (exerciseId: string) => ExerciseHistory | null;
  getPersonalRecords: (exerciseId: string) => PersonalRecord[];
}
