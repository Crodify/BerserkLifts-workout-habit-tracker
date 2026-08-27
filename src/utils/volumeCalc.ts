import { Workout, Exercise } from '@/types';
import { MuscleGroup, getMuscleGroupsForExercise } from './muscleMapping';

export interface MuscleVolume {
  muscle: MuscleGroup;
  volume: number; // Total KG lifted
  workouts: number; // Number of workouts
  lastTrained?: string; // Date of last training
}

/**
 * Calculate volume per muscle group from workout history
 */
export function calculateMuscleVolumes(
  workouts: Workout[],
  exercises: Exercise[]
): MuscleVolume[] {
  const muscleMap = new Map<MuscleGroup, MuscleVolume>();
  
  // Initialize all muscles with 0 volume
  const allMuscles: MuscleGroup[] = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'forearms'
  ];
  
  allMuscles.forEach(muscle => {
    muscleMap.set(muscle, {
      muscle,
      volume: 0,
      workouts: 0,
    });
  });
  
  // Process each workout
  workouts.forEach(workout => {
    workout.exercises.forEach(workoutExercise => {
      // Find the exercise details
      const exercise = exercises.find(e => e.id === workoutExercise.exerciseId);
      if (!exercise) return;
      
      // Get muscle groups for this exercise
      const muscleGroups = getMuscleGroupsForExercise(exercise.name, exercise.muscle);
      
      // Calculate volume for this exercise (weight × reps × sets)
      let exerciseVolume = 0;
      workoutExercise.sets.forEach(set => {
        if (set.completed) {
          exerciseVolume += set.weight * set.reps;
        }
      });
      
      // Distribute volume across muscle groups
      const volumePerMuscle = exerciseVolume / muscleGroups.length;
      
      muscleGroups.forEach(muscle => {
        const current = muscleMap.get(muscle);
        if (current) {
          current.volume += volumePerMuscle;
          current.workouts += 1;
          if (!current.lastTrained || workout.date > current.lastTrained) {
            current.lastTrained = workout.date;
          }
        }
      });
    });
  });
  
  return Array.from(muscleMap.values());
}

/**
 * Get volume color based on amount
 * Returns a color from dark (low) to bright (high)
 */
export function getVolumeColor(volume: number, maxVolume: number): string {
  if (volume === 0) return '#1C1C21'; // Dark surface (not trained)
  
  const ratio = volume / maxVolume;
  
  // Color scale: dark green → green → yellow → orange → red
  if (ratio < 0.2) return '#10B981'; // Emerald (low)
  if (ratio < 0.4) return '#22C55E'; // Green
  if (ratio < 0.6) return '#F59E0B'; // Amber (medium)
  if (ratio < 0.8) return '#F97316'; // Orange (high)
  return '#EF4444'; // Red (very high)
}

/**
 * Get volume zone label
 */
export function getVolumeZone(volume: number): string {
  if (volume === 0) return 'Not Trained';
  if (volume < 500) return 'Low';
  if (volume < 2000) return 'Medium';
  if (volume < 5000) return 'High';
  return 'Very High';
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return Math.round(volume).toString();
}

/**
 * Get max volume across all muscles
 */
export function getMaxVolume(muscleVolumes: MuscleVolume[]): number {
  return Math.max(...muscleVolumes.map(mv => mv.volume), 1);
}
