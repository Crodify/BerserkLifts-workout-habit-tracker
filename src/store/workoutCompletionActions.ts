import { Workout, PersonalRecord } from '@/types';
import { calculateWorkoutVolume, generateWorkoutName, calculateWorkoutStreak } from '@/utils/workoutHelpers';
import { findBest1RM, findMaxWeight } from '@/utils/prCalculations';
import { calculateLevel, calculateRank } from '@/constants/rpg';

// XP Award System
const XP_BASE = 50; // Base XP for completing a workout
const XP_PER_EXERCISE = 15; // XP per exercise completed
const XP_PER_SET = 5; // XP per set completed
const XP_VOLUME_BONUS_PER_1000 = 10; // XP per 1000kg volume
const XP_PR_BONUS = 100; // XP per personal record
const XP_STREAK_BONUS = 25; // XP per day of current streak
const XP_HABIT_BONUS = 10; // XP per habit completed

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

    // ── Calculate XP ──
    const completedExercises = activeWorkout.exercises.filter(
      (e: any) => e.sets.some((s: any) => s.completed)
    );
    const completedSetCount = activeWorkout.exercises.reduce(
      (sum: number, e: any) => sum + e.sets.filter((s: any) => s.completed).length, 0
    );

    let xpGained = XP_BASE;
    xpGained += completedExercises.length * XP_PER_EXERCISE;
    xpGained += completedSetCount * XP_PER_SET;
    xpGained += Math.floor(totalVolume / 1000) * XP_VOLUME_BONUS_PER_1000;
    xpGained += newPRs.length * XP_PR_BONUS;
    xpGained += Math.min(streaks.current, 30) * XP_STREAK_BONUS; // Cap at 30 days

    // ── Apply XP and check level up ──
    const oldLevel = calculateLevel(profile.xp);
    const oldRank = calculateRank(oldLevel);
    const newXP = profile.xp + xpGained;
    const newLevel = calculateLevel(newXP);
    const newRank = calculateRank(newLevel);
    const leveledUp = newLevel > oldLevel;
    const rankUp = newRank !== oldRank;

    set({
      workouts: updatedWorkouts,
      personalRecords: [...personalRecords, ...newPRs],
      profile: {
        ...profile,
        xp: newXP,
        level: newLevel,
        rank: newRank,
        totalWorkouts: profile.totalWorkouts + 1,
        totalVolume: profile.totalVolume + totalVolume,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        totalPRs: profile.totalPRs + newPRs.length,
      },
      activeWorkout: null,
      // Store level-up info for popup
      _lastWorkoutXP: {
        xpGained,
        breakdown: {
          base: XP_BASE,
          exercises: completedExercises.length * XP_PER_EXERCISE,
          sets: completedSetCount * XP_PER_SET,
          volume: Math.floor(totalVolume / 1000) * XP_VOLUME_BONUS_PER_1000,
          prs: newPRs.length * XP_PR_BONUS,
          streak: Math.min(streaks.current, 30) * XP_STREAK_BONUS,
        },
        leveledUp,
        rankUp,
        newLevel,
        newRank,
      },
    });
  },
});
