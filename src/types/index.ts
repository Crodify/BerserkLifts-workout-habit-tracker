import { Rank } from '@/constants/rpg';

export type WeightUnit = 'kg' | 'lbs';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  restTimer?: number; // seconds
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string; // Denormalized for history display
  sets: WorkoutSet[];
  notes: string;
  previousBest?: { weight: number; reps: number }; // Ghost data from last workout
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
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  
  // Routine Actions
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: string, routine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  
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
  
  // Utility Actions
  addXP: (amount: number) => void;
  getExerciseHistory: (exerciseId: string) => ExerciseHistory | null;
  getPersonalRecords: (exerciseId: string) => PersonalRecord[];
}
