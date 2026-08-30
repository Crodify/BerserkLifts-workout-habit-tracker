import { supabase } from './supabase';
import { Friend } from '@/types';

/**
 * Load all real users from Supabase profiles table
 * Returns an array of Friend objects for the leaderboard
 */
export async function loadRealUsersFromSupabase(): Promise<Friend[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar, xp, level, rank, total_workouts, total_volume, current_streak, longest_streak')
      .order('xp', { ascending: false })
      .limit(50);

    if (error || !data) {
      console.log('Leaderboard fetch error:', error);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name || 'Unknown',
      avatar: p.avatar || '⚔️',
      xp: p.xp || 0,
      rank: p.rank || 'E',
      totalVolume: p.total_volume || 0,
      totalWorkouts: p.total_workouts || 0,
      currentStreak: p.current_streak || 0,
      longestStreak: p.longest_streak || 0,
      level: p.level || 1,
    }));
  } catch (e) {
    console.log('Leaderboard fetch failed:', e);
    return [];
  }
}
