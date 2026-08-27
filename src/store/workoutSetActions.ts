import { calculateWorkoutVolume } from '@/utils/workoutHelpers';

// Part 2: Set operations
export const workoutSetActions = (set: any, get: any) => ({
  updateSet: (exerciseId: string, setId: string, weight: number, reps: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exerciseIndex = activeWorkout.exercises.findIndex((e: any) => e.id === exerciseId);
    if (exerciseIndex === -1) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const updatedSets = exercise.sets.map((s: any) =>
      s.id === setId ? { ...s, weight, reps } : s
    );

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets,
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: updatedExercises,
        totalVolume: calculateWorkoutVolume(updatedExercises),
      },
    });
  },

  toggleSetComplete: (exerciseId: string, setId: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exerciseIndex = activeWorkout.exercises.findIndex((e: any) => e.id === exerciseId);
    if (exerciseIndex === -1) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const updatedSets = exercise.sets.map((s: any) =>
      s.id === setId ? { ...s, completed: !s.completed } : s
    );

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets,
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: updatedExercises,
        totalVolume: calculateWorkoutVolume(updatedExercises),
      },
    });
  },

  deleteSet: (exerciseId: string, setId: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exerciseIndex = activeWorkout.exercises.findIndex((e: any) => e.id === exerciseId);
    if (exerciseIndex === -1) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const updatedSets = exercise.sets.filter((s: any) => s.id !== setId);

    if (updatedSets.length === 0) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets,
    };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: updatedExercises,
        totalVolume: calculateWorkoutVolume(updatedExercises),
      },
    });
  },

  updateExerciseNotes: (exerciseId: string, notes: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedExercises = activeWorkout.exercises.map((e: any) =>
      e.id === exerciseId ? { ...e, notes } : e
    );

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises: updatedExercises,
      },
    });
  },
});
