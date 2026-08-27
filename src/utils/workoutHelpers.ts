// Workout Helper Functions

import { WorkoutExercise, Workout } from '@/types';

/**
 * Calculate elapsed time in seconds
 */
export const calculateElapsedTime = (startTime: string): number => {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  return Math.floor((now - start) / 1000);
};

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Format duration into human-readable text (e.g., "1h 23m")
 */
export const formatDurationText = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

/**
 * Calculate total volume for a workout exercise
 */
export const calculateExerciseVolume = (exercise: WorkoutExercise): number => {
  return exercise.sets
    .filter(set => set.completed)
    .reduce((total, set) => total + (set.weight * set.reps), 0);
};

/**
 * Calculate total volume for entire workout
 */
export const calculateWorkoutVolume = (exercises: WorkoutExercise[]): number => {
  return exercises.reduce((total, exercise) => total + calculateExerciseVolume(exercise), 0);
};

/**
 * Count completed sets in a workout
 */
export const countCompletedSets = (exercises: WorkoutExercise[]): number => {
  return exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed).length, 0
  );
};

/**
 * Check if workout has any completed sets
 */
export const hasCompletedSets = (exercises: WorkoutExercise[]): boolean => {
  return exercises.some(exercise => 
    exercise.sets.some(set => set.completed)
  );
};

/**
 * Generate workout name based on exercises
 */
export const generateWorkoutName = (exercises: WorkoutExercise[]): string => {
  if (exercises.length === 0) return 'Quick Workout';
  if (exercises.length === 1) return exercises[0].exerciseName;
  
  const muscles = new Set(exercises.map(e => {
    const name = e.exerciseName.toLowerCase();
    if (name.includes('chest') || name.includes('bench')) return 'Chest';
    if (name.includes('back') || name.includes('row') || name.includes('pull')) return 'Back';
    if (name.includes('leg') || name.includes('squat')) return 'Legs';
    if (name.includes('shoulder') || name.includes('press')) return 'Shoulders';
    if (name.includes('arm') || name.includes('curl') || name.includes('tricep')) return 'Arms';
    return null;
  }).filter(Boolean));
  
  if (muscles.size === 1) {
    const muscle = Array.from(muscles)[0];
    return `${muscle} Workout`;
  }
  
  return 'Full Body Workout';
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Format date for display
 */
export const formatWorkoutDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Calculate workout streak from workout dates
 */
export const calculateWorkoutStreak = (workouts: Workout[]): { current: number; longest: number } => {
  if (workouts.length === 0) return { current: 0, longest: 0 };
  
  const sortedDates = workouts
    .map(w => w.date.split('T')[0])
    .sort()
    .reverse();
  
  const uniqueDates = Array.from(new Set(sortedDates));
  
  const today = getTodayDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let current = 0;
  if (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr) {
    current = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        current++;
      } else {
        break;
      }
    }
  }
  
  let longest = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);
  
  return { current, longest };
};

/**
 * Get last workout for a specific exercise
 */
export const getLastWorkoutForExercise = (
  exerciseId: string,
  workouts: Workout[]
): { sets: { weight: number; reps: number }[]; date: string } | null => {
  const sorted = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const workout of sorted) {
    const exercise = workout.exercises.find(e => e.exerciseId === exerciseId);
    if (exercise && exercise.sets.length > 0) {
      return {
        sets: exercise.sets
          .filter(s => s.completed)
          .map(s => ({ weight: s.weight, reps: s.reps })),
        date: workout.date,
      };
    }
  }
  
  return null;
};
