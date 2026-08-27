export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export const RANKS: { rank: Rank; minLevel: number; color: string }[] = [
  { rank: 'E', minLevel: 1, color: '#6B7280' },
  { rank: 'D', minLevel: 5, color: '#22C55E' },
  { rank: 'C', minLevel: 10, color: '#DC2626' },
  { rank: 'B', minLevel: 20, color: '#FFFFFF' },
  { rank: 'A', minLevel: 35, color: '#FFFFFF' },
  { rank: 'S', minLevel: 50, color: '#DC2626' },
];

export const XP_PER_LEVEL = 1000;

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const calculateRank = (level: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i].rank;
    }
  }
  return 'E';
};

export const getRankColor = (rank: Rank): string => {
  const found = RANKS.find(r => r.rank === rank);
  return found?.color || '#6B7280';
};

export const calculateXPForNextLevel = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const xpForNextLevel = currentLevel * XP_PER_LEVEL;
  return xpForNextLevel - xp;
};

export const calculateLevelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = (currentLevel - 1) * XP_PER_LEVEL;
  const xpForNextLevel = currentLevel * XP_PER_LEVEL;
  return ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
};
