# BerserkLifts — AI Agent Operating Manual

> **Stack:** Expo 57 · React Native 0.86 · Expo Router 5 · Zustand 5 · TypeScript 5.8
> **Theme:** Berserk-inspired dark workout tracker (black + crimson red)
> **Agent tooling:** Freebuff (Buffy) · Cline + OmniRoute · GStack · GBrain

---

## 1. Project Overview

BerserkLifts is a workout habit tracker with RPG gamification.
- Track workouts with sets, weight, reps
- Organize routines into folders
- Daily habit tracking with streaks
- XP system, rank badges, leaderboards
- Dark theme with crimson accent (#FF2D55)

### Folder Map
```
src/
  app/(tabs)/      — Tab screens: index, workouts, habits, progress, profile
  components/      — Shared UI components
  constants/       — Theme tokens (theme.ts) + RPG config (rpg.ts)
  data/            — Static data (exercises, etc.)
  store/           — Zustand global store (split into action files)
  types/           — TypeScript interfaces
  utils/           — Helper functions
```

---

## 2. Agent Roles & Model Recommendations

| Role | Best Model | Cost | Use For |
|------|-----------|------|---------|
| **Buffy (me)** | MIMO 2.5 | Free | Architecture, complex features, full context |
| **UI Designer** | Gemini 2.5 Pro | $1.25/M input | Visual polish, animations, pixel-perfect UI |
| **Frontend Dev** | Claude Opus | $15/M input | Multi-file refactors, complex components |
| **Quick Fixes** | MIMO 2.5 | Free | Bug fixes, simple changes, prototyping |
| **Code Review** | Gemini 3.6 Flash | $0.75/M input | Fast reviews, catching issues |

### How to Use in Cline:
1. Select the model in Cline's model picker (via OmniRoute)
2. Paste the relevant agent prompt from `.agents/specialized/`
3. Start with "Read CLAUDE.md for context, then..."
4. Give the specific task

---

## 3. GStack Skills

| Command | What It Does |
|---------|--------------|
| `/plan-ceo-review` | Product thinking, 10-star vision |
| `/plan-eng-review` | Architecture, data flow, edge cases |
| `/plan-design-review` | Design quality rating |
| `/investigate` | Debug root cause |
| `/review` | Pre-commit code review |
| `/health` | Code quality dashboard |
| `/cso` | Security audit |
| `/context-save` | Save session memory |
| `/context-restore` | Restore session |
| `/learn` | Teach agent something |
| `/autoplan` | Full review pipeline |

---

## 4. Multi-Agent Workflow

```
You (PM) → Assign tasks to the right agent
    │
    ├── Buffy: "Build the habits store actions"
    ├── Cline + Gemini: "Make the habits UI pixel-perfect"
    ├── Cline + Claude: "Review all changes for bugs"
    └── Buffy: "Wire everything together, test, commit"
```

See `MULTI-AGENT-GUIDE.md` for detailed task splitting examples.

---

## 5. Development Rules

1. **Never run `npm run reset-project`** — it deletes everything
2. **Never delete files** without asking
3. **Use `src/constants/theme.ts`** for all colors/spacing
4. **Zustand for all state** — no prop drilling
5. **TypeScript strict** — avoid `any`
6. **Dark theme only** — #0A0A0A background
7. **Test with `npx tsc --noEmit`** before committing
8. **Commit with descriptive messages** — what and why

---

## 6. Key Files to Read First

| File | Why |
|------|-----|
| `CLAUDE.md` | Project context for any AI agent |
| `MULTI-AGENT-GUIDE.md` | How to split tasks between agents |
| `src/constants/theme.ts` | All design tokens |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/store/index.ts` | Zustand store setup |
| `src/app/(tabs)/_layout.tsx` | Tab navigation |
