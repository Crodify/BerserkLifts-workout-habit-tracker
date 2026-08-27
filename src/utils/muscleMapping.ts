// Maps exercise names/muscles to standardized muscle groups for heatmap

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quadriceps' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'core' 
  | 'forearms';

// Exercise name patterns → muscle group mapping
const EXERCISE_PATTERNS: Record<string, MuscleGroup[]> = {
  // Chest
  'bench press': ['chest', 'triceps', 'shoulders'],
  'incline bench': ['chest', 'shoulders', 'triceps'],
  'decline bench': ['chest', 'triceps'],
  'chest fly': ['chest'],
  'push up': ['chest', 'triceps', 'shoulders'],
  'dumbbell press': ['chest', 'shoulders', 'triceps'],
  
  // Back
  'deadlift': ['back', 'hamstrings', 'glutes', 'forearms'],
  'barbell row': ['back', 'biceps'],
  'pull up': ['back', 'biceps'],
  'lat pulldown': ['back', 'biceps'],
  'seated row': ['back', 'biceps'],
  'cable row': ['back', 'biceps'],
  't bar row': ['back', 'biceps'],
  
  // Shoulders
  'overhead press': ['shoulders', 'triceps'],
  'military press': ['shoulders', 'triceps'],
  'lateral raise': ['shoulders'],
  'front raise': ['shoulders'],
  'reverse fly': ['shoulders', 'back'],
  'face pull': ['shoulders', 'back'],
  
  // Arms
  'bicep curl': ['biceps'],
  'hammer curl': ['biceps', 'forearms'],
  'tricep extension': ['triceps'],
  'tricep pushdown': ['triceps'],
  'dips': ['triceps', 'chest', 'shoulders'],
  
  // Legs
  'squat': ['quadriceps', 'glutes', 'hamstrings'],
  'leg press': ['quadriceps', 'glutes'],
  'leg extension': ['quadriceps'],
  'leg curl': ['hamstrings'],
  'romanian deadlift': ['hamstrings', 'glutes'],
  'hip thrust': ['glutes', 'hamstrings'],
  'calf raise': ['calves'],
  
  // Core
  'plank': ['core'],
  'crunch': ['core'],
  'russian twist': ['core'],
  'hanging leg raise': ['core'],
  'ab rollout': ['core'],
};

// Muscle group keywords for matching
const MUSCLE_KEYWORDS: Record<MuscleGroup, string[]> = {
  chest: ['chest', 'pec', 'pectoral'],
  back: ['back', 'lats', 'lat', 'traps', 'rhomboid'],
  shoulders: ['shoulder', 'delt', 'delts'],
  biceps: ['bicep', 'biceps'],
  triceps: ['tricep', 'triceps'],
  quadriceps: ['quad', 'quads', 'quadriceps'],
  hamstrings: ['hamstring', 'hamstrings', 'hams'],
  glutes: ['glute', 'glutes', 'butt'],
  calves: ['calf', 'calves'],
  core: ['core', 'abs', 'abdominal', 'oblique'],
  forearms: ['forearm', 'forearms', 'grip'],
};

/**
 * Maps an exercise to its target muscle groups
 */
export function getMuscleGroupsForExercise(
  exerciseName: string,
  exerciseMuscle: string
): MuscleGroup[] {
  const nameLower = exerciseName.toLowerCase();
  const muscleLower = exerciseMuscle.toLowerCase();
  
  // Try pattern matching first (more specific)
  for (const [pattern, muscles] of Object.entries(EXERCISE_PATTERNS)) {
    if (nameLower.includes(pattern)) {
      return muscles;
    }
  }
  
  // Fall back to keyword matching on exercise muscle
  for (const [muscle, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
    if (keywords.some(kw => muscleLower.includes(kw))) {
      return [muscle as MuscleGroup];
    }
  }
  
  // Default to core if no match
  return ['core'];
}

/**
 * Get display name for muscle group
 */
export function getMuscleDisplayName(muscle: MuscleGroup): string {
  const names: Record<MuscleGroup, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    quadriceps: 'Quads',
    hamstrings: 'Hamstrings',
    glutes: 'Glutes',
    calves: 'Calves',
    core: 'Core',
    forearms: 'Forearms',
  };
  return names[muscle];
}

/**
 * Get all muscle groups
 */
export function getAllMuscleGroups(): MuscleGroup[] {
  return Object.keys(MUSCLE_KEYWORDS) as MuscleGroup[];
}
