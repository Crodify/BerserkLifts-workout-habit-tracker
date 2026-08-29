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

  updateSetType: (exerciseId: string, setId: string, type: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exerciseIndex = activeWorkout.exercises.findIndex((e: any) => e.id === exerciseId);
    if (exerciseIndex === -1) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const updatedSets = exercise.sets.map((s: any) =>
      s.id === setId ? { ...s, type } : s
    );

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = { ...exercise, sets: updatedSets };

    set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
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

  toggleSuperset: (exerciseId1: string, exerciseId2: string) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const ex1 = activeWorkout.exercises.find((e: any) => e.id === exerciseId1);
    const ex2 = activeWorkout.exercises.find((e: any) => e.id === exerciseId2);
    if (!ex1 || !ex2) return;

    // If either is already in a superset, remove both from it
    if (ex1.supersetId || ex2.supersetId) {
      const supersetId = ex1.supersetId || ex2.supersetId;
      const updatedExercises = activeWorkout.exercises.map((e: any) =>
        e.supersetId === supersetId ? { ...e, supersetId: undefined, supersetLabel: undefined } : e
      );
      set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
      return;
    }

    // Create new superset
    const supersetId = `ss-${Date.now()}`;
    const updatedExercises = activeWorkout.exercises.map((e: any) => {
      if (e.id === exerciseId1) return { ...e, supersetId, supersetLabel: 'A' };
      if (e.id === exerciseId2) return { ...e, supersetId, supersetLabel: 'B' };
      return e;
    });

    set({ activeWorkout: { ...activeWorkout, exercises: updatedExercises } });
  },
});
