import { Rank } from '@/constants/rpg';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  date: string;
  duration: number;
  totalVolume: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: { exerciseId: string; targetSets: number; targetReps: number }[];
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
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
  weight: number;
  reps: number;
  date: string;
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
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: Rank;
  totalVolume: number;
}

export interface AppState {
  profile: UserProfile;
  workouts: Workout[];
  routines: Routine[];
  folders: Folder[];
  habits: Habit[];
  exercises: Exercise[];
  personalRecords: PersonalRecord[];
  bodyMeasurements: BodyMeasurement[];
  friends: Friend[];
  
  // Actions
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => void;
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  deleteRoutine: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  toggleHabit: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  addXP: (amount: number) => void;
}
