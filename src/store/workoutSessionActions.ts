import { WorkoutExercise, WorkoutSet, ActiveWorkout } from '@/types';
import { generateId } from '@/utils';
import { calculateWorkoutVolume, getLastWorkoutForExercise } from '@/utils/workoutHelpers';

// Part 1: Session management and exercise operations
export const workoutSessionActions = (set: any, get: any) => ({
  startWorkout: (name?: string, routineId?: string) => {
    const { routines, exercises, workouts } = get();
    let workoutExercises: WorkoutExercise[] = [];
    let workoutName = name || 'Quick Workout';

    if (routineId) {
      const routine = routines.find((r: any) => r.id === routineId);
      if (routine) {
        workoutName = routine.name;
        workoutExercises = routine.exercises.map((re: any) => {
          const exercise = exercises.find((e: any) => e.id === re.exerciseId);
          const lastWorkout = getLastWorkoutForExercise(re.exerciseId, workouts);
          
          return {
            id: generateId(),
            exerciseId: re.exerciseId,
            exerciseName: exercise?.name || 'Unknown Exercise',
            sets: Array.from({ length: re.targetSets }, () => ({
              id: generateId(),
              weight: 0,
              reps: re.targetReps,
              completed: false,
              restTimer: re.restTimer,
            })),
            notes: '',
            previousBest: lastWorkout?.sets[0] || undefined,
          };
        });
      }
    }

    const newWorkout: ActiveWorkout = {
      id: generateId(),
      name: workoutName,
      exercises: workoutExercises,
      startTime: new Date().toISOString(),
      totalVolume: 0,
    };

    set({ activeWorkout: newWorkout });
  },

  addExerciseToWorkout: (exerciseId: string) => {
    const { activeWorkout, exercises, workouts } = get();
    if (!activeWorkout) return;

    const exercise = exercises.find((e: any) => e.id === exerciseId);
    if (!exercise) return;

    const lastWorkout = getLastWorkoutForExercise(exerciseId, workouts);
    const previousBest = lastWorkout?.sets[0];

    const newExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId,
      exerciseName: exercise.name,
      sets: [{
        id: generateId(),
        weight: previousBest?.weight || 0,
        reps: previousBest?.reps || 10,
        completed: false,
      }],
      notes: '',
      previousBest,
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: [...activeWorkout.exercises, newExercise],
      },
    });
  },

  removeExerciseFromWorkout: (exerciseId: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: activeWorkout.exercises.filter((e: any) => e.id !== exerciseId),
      },
    });
  },

  addSetToExercise: (exerciseId: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exerciseIndex = activeWorkout.exercises.findIndex((e: any) => e.id === exerciseId);
    if (exerciseIndex === -1) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];

    const newSet: WorkoutSet = {
      id: generateId(),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
      completed: false,
    };

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: updatedExercises,
      },
    });
  },

  cancelWorkout: () => {
    set({ activeWorkout: null });
  },
});
