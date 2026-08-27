import { Workout, PersonalRecord } from '@/types';
import { calculateWorkoutVolume, generateWorkoutName, calculateWorkoutStreak } from '@/utils/workoutHelpers';
import { findBest1RM, findMaxWeight } from '@/utils/prCalculations';

// Part 3: Complete workout
export const workoutCompletionActions = (set: any, get: any) => ({
  completeWorkout: () => {
    const { activeWorkout, profile, workouts, personalRecords } = get();
    if (!activeWorkout) return;

    const endTime = new Date().toISOString();
    const startTime = new Date(activeWorkout.startTime).getTime();
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const totalVolume = calculateWorkoutVolume(activeWorkout.exercises);
    const workoutName = activeWorkout.name || generateWorkoutName(activeWorkout.exercises);

    const prsHit: string[] = [];
    const newPRs: PersonalRecord[] = [];

    activeWorkout.exercises.forEach((exercise: any) => {
      const completedSets = exercise.sets
        .filter((s: any) => s.completed)
        .map((s: any) => ({ weight: s.weight, reps: s.reps }));

      if (completedSets.length === 0) return;

      const new1RM = findBest1RM(completedSets);
      const existing1RM = personalRecords.find(
        (pr: any) => pr.exerciseId === exercise.exerciseId && pr.type === '1rm'
      );
      if (!existing1RM || new1RM > existing1RM.value) {
        prsHit.push(exercise.exerciseId);
        newPRs.push({
          exerciseId: exercise.exerciseId,
          type: '1rm',
          value: new1RM,
          date: endTime,
          workoutId: activeWorkout.id,
        });
      }

      const maxWeightSet = findMaxWeight(completedSets);
      if (maxWeightSet) {
        const existingMaxWeight = personalRecords.find(
          (pr: any) => pr.exerciseId === exercise.exerciseId && pr.type === 'maxWeight'
        );
        if (!existingMaxWeight || maxWeightSet.weight > existingMaxWeight.value) {
          if (!prsHit.includes(exercise.exerciseId)) prsHit.push(exercise.exerciseId);
          newPRs.push({
            exerciseId: exercise.exerciseId,
            type: 'maxWeight',
            value: maxWeightSet.weight,
            reps: maxWeightSet.reps,
            date: endTime,
            workoutId: activeWorkout.id,
          });
        }
      }
    });

    const completedWorkout: Workout = {
      id: activeWorkout.id,
      name: workoutName,
      exercises: activeWorkout.exercises,
      date: endTime,
      startTime: activeWorkout.startTime,
      endTime,
      duration,
      totalVolume,
      prsHit: prsHit.length > 0 ? prsHit : undefined,
    };

    const updatedWorkouts = [completedWorkout, ...workouts];
    const streaks = calculateWorkoutStreak(updatedWorkouts);

    set({
      workouts: updatedWorkouts,
      personalRecords: [...personalRecords, ...newPRs],
      profile: {
        ...profile,
        totalWorkouts: profile.totalWorkouts + 1,
        totalVolume: profile.totalVolume + totalVolume,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        totalPRs: profile.totalPRs + newPRs.length,
      },
      activeWorkout: null,
    });
  },
});
