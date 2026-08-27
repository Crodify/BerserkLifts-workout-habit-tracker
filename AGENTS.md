# Arise — AI Agent Operating Manual

> **Stack:** Expo 57 · React Native 0.86 · Expo Router 5 · Zustand 5 · TypeScript 5.8
> **Theme:** Solo Leveling / RPG gamified habit & fitness tracker (dark mode, dark purple/blue palette)
> **Agent tooling:** GStack (garrytan/gstack) · GBrain (garrytan/gbrain) — NO Claude Code required

---

## 1. Project Overview

Arise is a mobile app where users level up their real-world fitness and habits like an RPG character.
- Daily quests = habits (push-ups, water intake, journaling, etc.)
- EXP system, level thresholds, rank badges (E → S rank)
- Animated progress bars, level-up popups (react-native-reanimated + moti)
- Persistent state via Zustand + AsyncStorage
- Dark purple/midnight colour scheme

### Folder Map
```
src/
  app/           — Expo Router screens + layouts
    (tabs)/      — Main tab screens: index, habits, workouts, progress, profile
  components/    — Shared UI components
  constants/     — RPG config (levels, XP thresholds, rank titles) + theme colours
  data/          — Static data (quest templates, workout presets)
  store/         — Zustand global store
  types/         — TypeScript interfaces
  utils/         — Helper functions (XP calc, date utils, etc.)
assets/          — Images, fonts, icons
```

---

## 2. GStack Skills — How to Use

GStack skills live at: `C:\Users\Crodify\.gstack-repo\`
Linked into this project at: `.agents\skills\gstack\`

To invoke a skill, tell the agent to **"run the /skill-name skill"** or **"act as /skill-name"**.
The agent reads the corresponding `SKILL.md` and follows it step-by-step.

### Most Useful Skills for Arise

| Say this | What happens |
|---|---|
| `run /plan-ceo-review on [feature]` | CEO-level product thinking — finds the 10-star version |
| `run /plan-eng-review on [feature]` | Locks architecture, data flow, edge cases |
| `run /plan-design-review on [screen]` | Design quality rating 0-10 per dimension |
| `run /investigate [bug]` | Systematic root-cause debug |
| `run /review` | Pre-commit code review |
| `run /health` | Code quality dashboard |
| `run /cso` | OWASP + STRIDE security audit |
| `run /context-save` | Save current work context |
| `run /context-restore` | Pick up where you left off |
| `run /learn [fact]` | Teach agent something persistent |
| `run /diagram [description]` | Generate architecture/flow diagrams |
| `run /autoplan` | CEO → Design → Eng → DX review in one shot |

### Skill Files Location
All skill definitions are markdown files under:
`C:\Users\Crodify\.gstack-repo\<skill-name>\SKILL.md`

---

## 3. GBrain — Persistent Knowledge Brain

**Binary:** `C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe`
**Brain DB:** `C:\Users\Crodify\.gbrain\brain.pglite`
**Source:** `arise` → `C:\Users\Crodify\Desktop\Arise`

### GBrain Commands
```powershell
# Search the Arise codebase
C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe search "zustand store" --source arise

# Search for a code definition
C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe code-def "useAriseStore" --source arise

# Re-index after big changes
C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe sync --source arise --working-tree

# Check brain health
C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe doctor

# List all sources
C:\Users\Crodify\.gbrain-repo\bin\gbrain.exe sources list
```

**Tip:** After large changes, tell agent: "re-sync gbrain for the arise source"

---

## 4. Animation & UI Kit

### Packages installed
- **react-native-reanimated** ~3.17.0 — EXP bars, screen transitions
- **moti** ^0.30.0 — level-up popups, pulse/glow effects

### Babel plugin (required)
Add to `babel.config.js`:
```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['react-native-reanimated/plugin'],
};
```

### Animation Patterns
```tsx
// EXP bar fill
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

// Level-up popup
import { MotiView } from 'moti';
<MotiView
  from={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', damping: 10 }}
/>
```

---

## 5. Development Rules (Always Follow)

1. **TypeScript strict** — never use `any`
2. **Dark theme only** — use `src/constants/theme.ts` colours
3. **RPG tone** — "Quest Complete", "Level Up!", "Rank: E"
4. **Zustand for all global state** — no prop drilling or Context API
5. **Expo Router** — screens go in `src/app/`
6. **Test on web first** (`npm run web`) then mobile
7. **No breaking store changes** without migrating persisted data

---

## 6. GStack Workflow for New Features

```
1. run /plan-ceo-review on [feature]   → product clarity
2. run /plan-eng-review on [feature]   → lock architecture
3. Build the feature (Cline or MiMo 2.5)
4. run /review                         → catch bugs
5. run /context-save                   → save session memory
```

---

## 7. Upgrading Tools

```powershell
# Upgrade GBrain
cd C:\Users\Crodify\.gbrain-repo; git pull; bun install
bun build --compile --outfile bin/gbrain.exe src/cli.ts

# Upgrade GStack
cd C:\Users\Crodify\.gstack-repo; git pull; bun install; bun run gen:skill-docs
```
