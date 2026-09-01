# BerserkLifts — Multi-Agent Workflow & Token-Saving Guide

## 💡 The Token-Saving Protocol: Claude (Plan/Review) → Gemini (Build)

To achieve maximum code quality while saving significant token costs:

```
Step 1: 🧠 Claude (Architect)
  • You prompt: "/plan [Feature/Screen/Bugfix]"
  • Claude outputs a comprehensive Implementation Plan with files, logic, types, and edge cases.
  • Claude STOPS without generating massive code files.

Step 2: ⚡ Gemini (Builder)
  • You prompt: "Implement the plan created by Claude"
  • Gemini creates/edits all files, writes full components, applies animations, and verifies `npx tsc --noEmit`.

Step 3: 🔍 Claude (Reviewer - Optional)
  • You prompt: "/review"
  • Claude audits the changes for edge cases, performance, or regressions.
```

---

## Model Assignment Guide

### 🧠 1. When running Claude (Planning & Architecture)
```
Prompt:
"/plan I want to implement [Feature / Animation / Screen].
Write a detailed technical plan covering:
- Affected files
- Data models & Zustand actions
- Exact logic, math, and animations
- Edge cases
Do not generate the full code; just output the complete implementation plan for Gemini to execute."
```

### ⚡ 2. When running Gemini (Code Generation & Styling)
```
Prompt:
"Implement the plan created by Claude.
- Create/modify all specified files
- Use design tokens from src/constants/theme.ts
- Ensure dark theme (#0A0A0A) and pixel-perfect polish
- Run npx tsc --noEmit to verify zero TypeScript errors."
```

### 🔍 3. When running Code Review (Claude)
```
Prompt:
"/review Review the recent changes for:
1. Logic bugs or state race conditions
2. TypeScript correctness
3. Android / iOS visual clipping or layout bugs
4. Performance and memory leaks"
```

---

## Quick Reference Table

| Model | Primary Duty | Output Mode | Cost Profile |
|---|---|---|---|
| **Claude (Sonnet / Opus)** | Architecture, Planning, Review | High-density plans, blueprints, reviews | High reasoning / Higher cost |
| **Gemini (3.7 Flash / 2.5 Pro)** | Code Implementation, UI, Animations | Full working code, large multi-file edits | High speed / Very cost effective |
| **MIMO 2.5** | Quick targeted fixes, one-line patches | Single-file small edits | Free / Instant |

