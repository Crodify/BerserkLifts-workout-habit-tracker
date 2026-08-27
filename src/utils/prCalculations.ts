// Personal Record Calculations

export interface SetData {
  weight: number;
  reps: number;
}

/**
 * Calculate estimated 1RM using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps > 12) return weight; // Formula less accurate above 12 reps
  return Math.round(weight * (36 / (37 - reps)));
};

/**
 * Find the best estimated 1RM from a list of sets
 */
export const findBest1RM = (sets: SetData[]): number => {
  if (sets.length === 0) return 0;
  const estimates = sets.map(set => calculate1RM(set.weight, set.reps));
  return Math.max(...estimates);
};

/**
 * Find max weight lifted (regardless of reps)
 */
export const findMaxWeight = (sets: SetData[]): { weight: number; reps: number } | null => {
  if (sets.length === 0) return null;
  const maxSet = sets.reduce((prev, current) => 
    current.weight > prev.weight ? current : prev
  );
  return { weight: maxSet.weight, reps: maxSet.reps };
};

/**
 * Find max reps at any weight
 */
export const findMaxReps = (sets: SetData[]): { weight: number; reps: number } | null => {
  if (sets.length === 0) return null;
  const maxSet = sets.reduce((prev, current) => 
    current.reps > prev.reps ? current : prev
  );
  return { weight: maxSet.weight, reps: maxSet.reps };
};

/**
 * Calculate volume for a single set (weight × reps)
 */
export const calculateSetVolume = (weight: number, reps: number): number => {
  return weight * reps;
};

/**
 * Calculate total volume from multiple sets
 */
export const calculateTotalVolume = (sets: SetData[]): number => {
  return sets.reduce((total, set) => total + calculateSetVolume(set.weight, set.reps), 0);
};

/**
 * Find the single set with highest volume
 */
export const findMaxVolumeSet = (sets: SetData[]): { weight: number; reps: number; volume: number } | null => {
  if (sets.length === 0) return null;
  const setsWithVolume = sets.map(set => ({
    ...set,
    volume: calculateSetVolume(set.weight, set.reps),
  }));
  const maxSet = setsWithVolume.reduce((prev, current) => 
    current.volume > prev.volume ? current : prev
  );
  return maxSet;
};

/**
 * Check if a new set beats an existing PR
 */
export const checkPRBroken = (
  newSet: SetData,
  existingPR: { weight: number; reps: number } | null,
  type: '1rm' | 'maxWeight' | 'maxReps' | 'maxVolume'
): boolean => {
  if (!existingPR) return true; // First record always counts

  switch (type) {
    case '1rm':
      return calculate1RM(newSet.weight, newSet.reps) > calculate1RM(existingPR.weight, existingPR.reps);
    case 'maxWeight':
      return newSet.weight > existingPR.weight;
    case 'maxReps':
      return newSet.reps > existingPR.reps;
    case 'maxVolume':
      return calculateSetVolume(newSet.weight, newSet.reps) > calculateSetVolume(existingPR.weight, existingPR.reps);
    default:
      return false;
  }
};

/**
 * Convert weight between units
 */
export const convertWeight = (weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number => {
  if (from === to) return weight;
  if (from === 'kg' && to === 'lbs') return Math.round(weight * 2.20462 * 10) / 10;
  if (from === 'lbs' && to === 'kg') return Math.round(weight * 0.453592 * 10) / 10;
  return weight;
};
