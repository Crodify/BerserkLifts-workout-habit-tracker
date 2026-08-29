<div align="center">

# ⚔️ BerserkLifts

**A premium workout & habit tracker with RPG progression**

*Track workouts, build habits, compete with friends, and level up your character.*

---

![React Native](https://img.shields.io/badge/React_Native-0.86.0-61DAFB?style=flat&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-57.0.0-000020?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-443E38?style=flat&logo=zustand&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📱 Features

### 🏋️ Workout Tracking (Hevy-style)
- **Active Workout Screen** — Timer, volume tracking, set logging with weight & reps
- **Set Types** — Normal, Warmup (W), Drop Set (D), Failure (F) with color-coded badges
- **Supersets** — Link exercises together with A/B badges
- **Rest Timer** — Auto-start countdown with -15/+15 adjustment, sound effects, and haptic feedback
- **Exercise Detail** — Tap any exercise to see personal records, volume trend, and workout history
- **Ghost Data** — See your previous best performance while logging

### 📁 Routine Management
- **Folders** — Organize routines into folders (Push Day, Pull Day, etc.)
- **Create Routines** — Build reusable workout templates with exercise selection
- **Move Between Folders** — ⋯ menu to move routines or remove from folders
- **Delete Folders** — Auto-moves routines to unfiled before deleting

### ✅ Daily Habits
- **Add Habits** — 24 icon picker with 5 categories (Fitness, Wellness, Mindset, Nutrition, Productivity)
- **Weekly Overview** — 7-day circle chart with completion percentage
- **Streak Tracking** — 🔥 fire badges for consecutive days
- **Long-press Delete** — Quick habit removal

### 📊 Progress Analytics
- **Stats Grid** — Workouts, volume, streak, best streak
- **Volume Chart** — Bar chart showing last 8 weeks
- **Personal Records** — Gold 🏆 badges with exercise breakdown
- **Muscle Breakdown** — Color-coded horizontal bars by muscle group
- **Workout History** — Recent sessions with volume and XP

### 🏆 Challenges
- **4 Challenge Modes** — Workouts, Volume, Streak, Habit Completion
- **Create & Join** — Set duration (1wk/2wk/1mo) and compete with friends
- **Leaderboard** — Medal rankings (🥇🥈🥉) with real-time scores
- **Progress Bar** — Visual time remaining

### ⚙️ Settings
- **Weight Unit** — Toggle between KG and LBS
- **Rest Timer** — Configurable default (30s to 5min)
- **Auto-Start Rest** — Toggle automatic rest timer
- **Workout Goals** — Set weekly workout target
- **Body Weight Goal** — Track target weight

### 🎮 RPG Progression
- **Rank System** — E → D → C → B → A → S ranks with color coding
- **XP & Levels** — Earn XP from workouts, level up your character
- **Leaderboard** — Compete with friends by total volume

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native 0.86** | Cross-platform UI framework |
| **Expo 57** | Development toolchain & native modules |
| **TypeScript 5.8** | Type safety & better DX |
| **Zustand 5** | Lightweight state management |
| **AsyncStorage** | Local data persistence |
| **Expo Router** | File-based navigation |
| **expo-haptics** | Tactile feedback on mobile |
| **react-native-gesture-handler** | Touch interactions |
| **react-native-reanimated** | Smooth animations |
| **Ionicons** | Tab bar & UI icons |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Crodify/BerserkLifts-workout-habit-tracker.git

# Navigate to project
cd BerserkLifts-workout-habit-tracker

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running

```bash
# Web browser
npx expo start --web

# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android

# Scan QR code with Expo Go app
npx expo start
```

---

## 📂 Project Structure

```
src/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation (5 tabs)
│       ├── index.tsx        # Dashboard (rank, leaderboard, challenges)
│       ├── workouts.tsx     # Folders, routines, active workout
│       ├── habits.tsx       # Daily habit tracking
│       ├── progress.tsx     # Stats, charts, PRs
│       └── profile.tsx      # Profile, settings, recent workouts
├── components/
│   ├── ActiveWorkoutScreen.tsx   # Hevy-style workout logger
│   ├── ExerciseDetailScreen.tsx  # Exercise history & PRs
│   ├── ExercisePickerModal.tsx   # Searchable exercise picker
│   ├── AddHabitModal.tsx         # Create new habits
│   ├── ChallengesScreen.tsx      # Challenge management
│   ├── SettingsScreen.tsx        # App settings
│   ├── FolderCard.tsx            # Routine folder cards
│   ├── RoutineCardUnfiled.tsx    # Unfiled routine cards
│   ├── CreateRoutineModal.tsx    # Routine builder
│   ├── CreateFolderModal.tsx     # Folder creation
│   └── MoveToFolderModal.tsx     # Move routines between folders
├── store/
│   ├── index.ts                  # Zustand store setup
│   ├── defaults.ts               # Default data & exercises
│   ├── workoutSessionActions.ts  # Start/finish workout
│   ├── workoutSetActions.ts      # Log sets, types, supersets
│   ├── workoutCompletionActions.ts # Save completed workouts
│   ├── routineActions.ts         # CRUD for routines
│   ├── folderActions.ts          # CRUD for folders
│   ├── habitActions.ts           # CRUD for habits
│   ├── challengeActions.ts       # Challenge system
│   ├── settingsActions.ts        # Settings persistence
│   └── utilityActions.ts         # XP, history, PRs
├── types/
│   └── index.ts                  # TypeScript interfaces
├── constants/
│   ├── theme.ts                  # Design tokens (colors, spacing, etc.)
│   └── rpg.ts                    # Rank system & level calculations
└── utils/
    ├── index.ts                  # Formatting helpers
    ├── sounds.ts                 # Web Audio API beeps + haptics
    └── workoutHelpers.ts         # Volume calculations
```

---

## 🎨 Design System

The app uses a **premium dark theme** with crimson accent, inspired by iOS design patterns:

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#0A0A0A` | Deep black main background |
| **Surface** | `#16161A` | Card surfaces |
| **Primary** | `#FF2D55` | Crimson accent (buttons, links) |
| **Success** | `#30D158` | Completed sets, streaks |
| **Warning** | `#FF9F0A` | Drop sets, partial completion |
| **Error** | `#FF453A` | Failure sets, discard actions |
| **Info** | `#0A84FF` | Warmup sets, rest timer |

---

## 📊 App Stats

| Metric | Value |
|--------|-------|
| Source Files | 51 |
| Components | 17 |
| Store Actions | 10 modules |
| Tab Screens | 5 |
| Lines of Code | ~5,500+ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Hevy](https://hevyapp.com/) — Workout tracking UX inspiration
- [Expo](https://expo.dev/) — React Native toolchain
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Berserk](https://en.wikipedia.org/wiki/Berserk_(manga)) — Theme inspiration

---

<div align="center">

**Built with ⚔️ by Crodify**

*Track. Compete. Level Up.*

</div>
