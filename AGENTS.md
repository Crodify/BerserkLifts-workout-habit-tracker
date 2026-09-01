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

## 2. Agent Roles & Token-Saving Protocol

### 💡 Core Workflow: Claude Plans → Gemini Builds
To minimize token costs and maximize execution speed:

```
┌────────────────────────────────────────────────────────┐
│ 🧠 Claude (Architect & Reviewer)                       │
│ • Deep reasoning, system architecture, edge cases      │
│ • Produces concise, exact Implementation Plans         │
│ • Performs thorough pre-commit code reviews            │
│ • STOPS after planning — does NOT dump full code       │
└────────────────────────┬───────────────────────────────┘
                         │ (User passes plan)
                         ▼
┌────────────────────────────────────────────────────────┐
│ ⚡ Gemini (Builder & Implementer)                      │
│ • Fast, high-capacity, cost-effective execution       │
│ • Writes full components, styles, & store slices       │
│ • Delivers pixel-perfect UI & animations               │
│ • Runs `npx tsc --noEmit` & verifies zero errors      │
└────────────────────────────────────────────────────────┘
```

| Role | Best Model | Primary Duty | Output Mode |
|------|-----------|--------------|-------------|
| **Claude (Architect / Reviewer)** | Claude Sonnet / Opus | Architecture, planning, edge-case analysis, review | **Plan & Blueprint only** (no heavy code dumping) |
| **Gemini (Builder / Coder)** | Gemini 2.5 Pro / 3.7 Flash | Full code implementation, file edits, UI design, animations | **Full working code & edits** |
| **MIMO / Fast Model** | MIMO 2.5 | Quick bug fixes, single-line edits, syntax fixes | Fast targeted patches |

---

## 3. How to Use in Cline / Chat

1. **When using Claude**:
   - Ask: `"/plan [feature description]"`.
   - Claude investigates the codebase, defines the exact file structure, logic flow, math/formulas, and writes `implementation_plan.md`.
   - Claude stops and hands off to you.

2. **When using Gemini**:
   - Switch model to Gemini.
   - Say: `"Implement the plan created by Claude"`.
   - Gemini writes/edits all files, creates components, updates stores, and runs `npx tsc --noEmit`.

3. **When doing Code Review**:
   - Switch to Claude or review agent.
   - Say: `"/review [feature or files]"`.
   - Claude reviews for bugs, edge cases, type errors, and performance.

---

## 4. GStack Skills

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

## 5. Multi-Agent Workflow

See `MULTI-AGENT-GUIDE.md` for detailed task splitting examples and prompt templates.


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
