# BerserkLifts — Project Context for AI Agents

## What This Is
A **workout habit tracker** mobile app with RPG gamification. Users level up by completing real workouts and habits.

## Tech Stack
- **Framework:** Expo SDK 57 + React Native 0.86
- **Routing:** Expo Router 5 (file-based)
- **State:** Zustand 5 + AsyncStorage (persisted)
- **Styling:** StyleSheet (dark theme: #0A0A0A bg, #FF2D55 crimson accent)
- **Language:** TypeScript 5.8
- **Animations:** react-native-reanimated + moti

## Theme: Berserk (NOT Solo Leveling)
- Background: `#0A0A0A` (deep black)
- Surface: `#16161A` (card surface)
- Primary: `#FF2D55` (crimson red)
- Success: `#30D158` (iOS green)
- Text: `#FFFFFF` on dark backgrounds
- Design tokens in `src/constants/theme.ts`

## Folder Structure
```
src/
  app/(tabs)/     — Tab screens: index, workouts, habits, progress, profile
  components/     — Shared UI components
  constants/      — Theme tokens + RPG config
  data/           — Static data (exercises, etc.)
  store/          — Zustand store (split into action files)
  types/          — TypeScript interfaces
  utils/          — Helper functions
```

## Store Architecture (Zustand)
The store is split across multiple files merged in `src/store/index.ts`:
- `workoutSessionActions.ts` — start/add/cancel workout
- `workoutSetActions.ts` — update/toggle/delete sets
- `workoutCompletionActions.ts` — finish workout, detect PRs
- `routineActions.ts` — CRUD routines, move to folder
- `folderActions.ts` — CRUD folders
- `habitActions.ts` — CRUD habits, toggle completion
- `exerciseActions.ts` — custom exercises
- `settingsActions.ts` — weight unit, rest timer
- `measurementActions.ts` — body measurements
- `utilityActions.ts` — XP, history, PRs

## Key Types
- `Exercise` — name, muscle, equipment
- `Routine` — name, exercises[], folderId
- `Folder` — name, color
- `Workout` — completed workout with exercises, volume, duration, PRs
- `ActiveWorkout` — in-progress workout
- `WorkoutExercise` — exercise within a workout (sets, notes, previousBest)
- `WorkoutSet` — weight, reps, completed, restTimer

## What's Built
- ✅ Dashboard with rank card, XP bar, stats, leaderboard
- ✅ Workouts tab: folders, routines, ⋯ menu (move/delete), start empty workout
- ✅ ActiveWorkoutScreen: timer, set logging, weight/reps inputs, checkmark, add set/exercise, finish flow
- ✅ Habits tab (needs build-out)
- ✅ Progress tab (needs build-out)
- ✅ Profile tab (needs build-out)

## Rules for Agents
1. **Token-Saving Rule: Claude Plans → Gemini Builds**
   - **Claude's Duty:** When asked for `/plan` or architectural work, formulate the exact blueprint, file list, logic formulas, and edge cases in `implementation_plan.md` or concise markdown, then STOP. Do NOT dump massive whole-file code unless specifically commanded.
   - **Gemini's Duty:** Takes the plan, generates all files, handles large code output, applies styling/animations, and tests compilation.
2. **Never run `npm run reset-project`** — it deletes everything
3. **Never delete files** without asking — only create/modify
4. **Use `src/constants/theme.ts`** for all colors/spacing/borders
5. **Zustand for all state** — no prop drilling, no Context API
6. **TypeScript strict** — avoid `any` when possible
7. **Dark theme only** — no light mode
8. **Test with `npx tsc --noEmit`** before completing any task

## Model Recommendations
| Task | Best Model | Role |
|------|-----------|------|
| Architecture / Planning | Claude Sonnet / Opus | Produce concise, high-density implementation plan |
| Full Code Implementation | Gemini 2.5 Pro / 3.7 Flash | Write code, build UI, animations, multi-file edits |
| Code Review & Auditing | Claude Sonnet / Opus | Catch subtle bugs, race conditions, edge cases |
| Quick Fixes / Typos | MIMO 2.5 / Fast Model | Instant one-line corrections |

## Current Branch
`master` — all changes go here

