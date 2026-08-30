import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// PUSH: Save local state to Supabase
// ============================================

export async function syncProfileToSupabase(userId: string, profile: any) {
  // Use UPDATE only — the trigger already creates the row on signup
  const { error } = await supabase
    .from('profiles')
    .update({
      name: profile.name,
      avatar: profile.avatar,
      xp: profile.xp,
      level: profile.level,
      rank: profile.rank,
      total_workouts: profile.totalWorkouts,
      total_volume: profile.totalVolume,
      current_streak: profile.currentStreak,
      longest_streak: profile.longestStreak,
      total_prs: profile.totalPRs,
      preferred_unit: profile.preferredUnit,
    })
    .eq('id', userId);
  if (error) console.error('Profile sync error:', error);
}

export async function syncWorkoutsToSupabase(userId: string, workouts: any[]) {
  // Delete existing workouts for this user, then re-insert
  await supabase.from('workouts').delete().eq('user_id', userId);
  if (workouts.length === 0) return;
  const { error } = await supabase
    .from('workouts')
    .insert(
      workouts.map(w => ({
        id: w.id,
        user_id: userId,
        name: w.name,
        exercises: JSON.stringify(w.exercises),
        date: w.date,
        start_time: w.startTime,
        end_time: w.endTime,
        duration: w.duration,
        total_volume: w.totalVolume,
        xp_gained: w.xpGained || 0,
        prs_hit: w.prsHit || [],
      }))
    );
  if (error) console.error('Workouts sync error:', error);
}

export async function syncHabitsToSupabase(userId: string, habits: any[]) {
  await supabase.from('habits').delete().eq('user_id', userId);
  if (habits.length === 0) return;
  const { error } = await supabase
    .from('habits')
    .insert(
      habits.map(h => ({
        id: h.id,
        user_id: userId,
        name: h.name,
        icon: h.icon,
        completed_dates: h.completedDates,
        streak: h.streak,
      }))
    );
  if (error) console.error('Habits sync error:', error);
}

export async function syncRoutinesToSupabase(userId: string, routines: any[]) {
  await supabase.from('routines').delete().eq('user_id', userId);
  if (routines.length === 0) return;
  const { error } = await supabase
    .from('routines')
    .insert(
      routines.map(r => ({
        id: r.id,
        user_id: userId,
        name: r.name,
        exercises: JSON.stringify(r.exercises),
        folder_id: r.folderId,
      }))
    );
  if (error) console.error('Routines sync error:', error);
}

export async function syncFoldersToSupabase(userId: string, folders: any[]) {
  await supabase.from('folders').delete().eq('user_id', userId);
  if (folders.length === 0) return;
  const { error } = await supabase
    .from('folders')
    .insert(
      folders.map(f => ({
        id: f.id,
        user_id: userId,
        name: f.name,
        color: f.color,
      }))
    );
  if (error) console.error('Folders sync error:', error);
}

export async function syncSettingsToSupabase(userId: string, settings: any) {
  const { error } = await supabase
    .from('settings')
    .upsert({
      user_id: userId,
      weight_unit: settings.weightUnit,
      default_rest_timer: settings.defaultRestTimer,
      auto_start_rest_timer: settings.autoStartRestTimer,
      weekly_workout_goal: settings.weeklyWorkoutGoal,
      body_weight_goal: settings.bodyWeightGoal,
    }, { onConflict: 'user_id' });
  if (error) console.error('Settings sync error:', error);
}

// ============================================
// PULL: Load data from Supabase to local
// ============================================

export async function loadProfileFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    xp: data.xp,
    level: data.level,
    rank: data.rank,
    totalWorkouts: data.total_workouts,
    totalVolume: data.total_volume,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    totalPRs: data.total_prs,
    joinDate: data.join_date,
    preferredUnit: data.preferred_unit,
  };
}

export async function loadWorkoutsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data.map(w => ({
    id: w.id,
    name: w.name,
    exercises: w.exercises,
    date: w.date,
    startTime: w.start_time,
    endTime: w.end_time,
    duration: w.duration,
    totalVolume: w.total_volume,
    xpGained: w.xp_gained,
    prsHit: w.prs_hit,
  }));
}

export async function loadHabitsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map(h => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    completedDates: h.completed_dates,
    streak: h.streak,
  }));
}

export async function loadRoutinesFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    name: r.name,
    exercises: r.exercises,
    folderId: r.folder_id,
    lastUsed: r.last_used,
  }));
}

export async function loadFoldersFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map(f => ({
    id: f.id,
    name: f.name,
    color: f.color,
  }));
}

export async function loadSettingsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return {
    weightUnit: data.weight_unit,
    defaultRestTimer: data.default_rest_timer,
    autoStartRestTimer: data.auto_start_rest_timer,
    theme: data.theme,
    weeklyWorkoutGoal: data.weekly_workout_goal,
    bodyWeightGoal: data.body_weight_goal,
  };
}

export async function loadExercisesFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map(e => ({
    id: e.id,
    name: e.name,
    muscle: e.muscle,
    equipment: e.equipment,
    isCustom: e.is_custom,
  }));
}

// ============================================
// FULL SYNC
// ============================================

export async function pullAllFromSupabase(userId: string) {
  const [profile, workouts, habits, routines, folders, settings, exercises] = await Promise.all([
    loadProfileFromSupabase(userId),
    loadWorkoutsFromSupabase(userId),
    loadHabitsFromSupabase(userId),
    loadRoutinesFromSupabase(userId),
    loadFoldersFromSupabase(userId),
    loadSettingsFromSupabase(userId),
    loadExercisesFromSupabase(userId),
  ]);

  return { profile, workouts, habits, routines, folders, settings, exercises };
}

export async function pushAllToSupabase(userId: string, state: any) {
  await Promise.all([
    syncProfileToSupabase(userId, state.profile),
    syncWorkoutsToSupabase(userId, state.workouts),
    syncHabitsToSupabase(userId, state.habits),
    syncRoutinesToSupabase(userId, state.routines),
    syncFoldersToSupabase(userId, state.folders),
    syncSettingsToSupabase(userId, state.settings),
  ]);
}
