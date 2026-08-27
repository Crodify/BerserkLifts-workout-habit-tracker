import { Workout, PersonalRecord, Exercise } from '@/types';

export interface PRDetectionResult {
  exerciseId: string;
  exerciseName: string;
  prType: '1rm' | 'volume' | 'reps';
  value: number;
  previousBest: number;
  isNew: boolean;
  date: string;
}

/**
 * Calculate estimated 1RM using Epley formula
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Detect PRs in a workout
 */
export function detectPRs(
  workout: Workout,
  exercises: Exercise[],
  existingPRs: PersonalRecord[]
): PRDetectionResult[] {
  const results: PRDetectionResult[] = [];
  
  workout.exercises.forEach(workoutExercise => {
    const exercise = exercises.find(e => e.id === workoutExercise.exerciseId);
    if (!exercise) return;
    
    // Get existing PRs for this exercise
    const exercisePRs = existingPRs.filter(pr => pr.exerciseId === exercise.id);
    
    // Calculate current workout stats
    let maxWeight = 0;
    let maxReps = 0;
    let totalVolume = 0;
    
    workoutExercise.sets.forEach(set => {
      if (set.completed) {
        totalVolume += set.weight * set.reps;
        if (set.weight > maxWeight) {
          maxWeight = set.weight;
          maxReps = set.reps;
        }
      }
    });
    
    const current1RM = calculate1RM(maxWeight, maxReps);
    
    // Check 1RM PR
    const best1RM = exercisePRs.find(pr => pr.type === '1rm');
    const isNew1RM = !best1RM || current1RM > best1RM.value;
    
    if (isNew1RM && current1RM > 0) {
      results.push({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        prType: '1rm',
        value: current1RM,
        previousBest: best1RM?.value || 0,
        isNew: true,
        date: workout.date,
      });
    }
    
    // Check Volume PR
    const bestVolume = exercisePRs.find(pr => pr.type === 'maxVolume');
    const isNewVolume = !bestVolume || totalVolume > bestVolume.value;
    
    if (isNewVolume && totalVolume > 0) {
      results.push({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        prType: 'volume',
        value: totalVolume,
        previousBest: bestVolume?.value || 0,
        isNew: true,
        date: workout.date,
      });
    }
    
    // Check Reps PR (at same or heavier weight)
    const bestReps = exercisePRs.find(pr => pr.type === 'maxReps' && pr.weight === maxWeight);
    const isNewReps = !bestReps || maxReps > (bestReps.reps || 0);
    
    if (isNewReps && maxReps > 0) {
      results.push({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        prType: 'reps',
        value: maxReps,
        previousBest: bestReps?.reps || 0,
        isNew: true,
        date: workout.date,
      });
    }
  });
  
  return results;
}

/**
 * Get exercise status based on performance trend
 */
export function getExerciseStatus(
  exerciseId: string,
  workouts: Workout[]
): { status: 'stronger' | 'plateauing' | 'dipping' | 'new'; trend: string; sessions: number } {
  // Get recent workouts for this exercise
  const exerciseWorkouts = workouts
    .filter(w => w.exercises.some(e => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4); // Last 4 sessions
  
  if (exerciseWorkouts.length < 2) {
    return { status: 'new', trend: 'Not enough data yet', sessions: exerciseWorkouts.length };
  }
  
  // Calculate volume trend
  const volumes = exerciseWorkouts.map(w => {
    const exercise = w.exercises.find(e => e.exerciseId === exerciseId);
    if (!exercise) return 0;
    return exercise.sets.reduce((sum, set) => sum + (set.completed ? set.weight * set.reps : 0), 0);
  });
  
  const recentAvg = volumes.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const olderAvg = volumes.slice(2).reduce((a, b) => a + b, 0) / Math.max(volumes.slice(2).length, 1);
  
  const changePercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
  
  if (changePercent > 10) {
    return { 
      status: 'stronger', 
      trend: `+${Math.round(changePercent)}% vs previous sessions`,
      sessions: exerciseWorkouts.length
    };
  } else if (changePercent < -10) {
    return { 
      status: 'dipping', 
      trend: `${Math.round(changePercent)}% vs previous sessions`,
      sessions: exerciseWorkouts.length
    };
  } else {
    return { 
      status: 'plateauing', 
      trend: 'No significant change',
      sessions: exerciseWorkouts.length
    };
  }
}
