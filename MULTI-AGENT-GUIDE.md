# BerserkLifts — Multi-Agent Workflow Guide

## How Agents Work Together

```
You (Project Manager)
    │
    ├── Buffy (Freebuff) — Full codebase context, architecture, complex features
    ├── Cline + Claude Opus — Deep reasoning, multi-file refactors
    ├── Cline + Gemini 2.5 Pro — UI design, visual polish, animations
    └── Cline + MIMO 2.5 — Quick fixes, simple features, prototyping
```

## Model Assignment Guide

### 🎨 For UI/Visual Work → Gemini 2.5 Pro
```
Paste this into Cline:
"Read CLAUDE.md for context. Act as UI Designer. Make the [component] 
match this design: [paste screenshot/description]. Use exact colors 
from src/constants/theme.ts. Be pixel-perfect."
```

### 🧠 For Complex Logic → Claude Opus
```
Paste this into Cline:
"Read CLAUDE.md for context. Act as Backend Architect. Implement 
[feature] with full Zustand store actions, TypeScript types, and 
proper error handling. Follow existing store patterns in src/store/."
```

### ⚡ For Quick Fixes → MIMO 2.5 (Free)
```
Paste this into Cline:
"Read CLAUDE.md for context. Fix [bug] in [file]. Keep changes minimal. 
Run npx tsc --noEmit to verify."
```

### 🔍 For Code Review → Any Model
```
Paste this into Cline:
"Read CLAUDE.md for context. Review the changes in [files]. Check for:
1. TypeScript errors
2. Logic bugs
3. Performance issues
4. Style consistency with theme.ts"
```

## Task Splitting Examples

### Example 1: Build Habits Tab
| Agent | Task |
|-------|------|
| **Buffy** | Define Habit type, store actions, data structure |
| **Cline + Gemini** | Build the UI: habit cards, streak display, check animation |
| **Buffy** | Wire up to profile stats, add XP rewards |

### Example 2: Build Progress Tab
| Agent | Task |
|-------|------|
| **Cline + Claude** | Volume calculation utils, PR detection logic |
| **Cline + Gemini** | Charts, graphs, progress visualization UI |
| **Buffy** | Connect to store, test end-to-end |

### Example 3: Fix a Bug
| Agent | Task |
|-------|------|
| **Buffy** | Investigate root cause, identify affected files |
| **Cline + MIMO** | Apply the fix, run tsc --noEmit |
| **Buffy** | Verify fix works in preview |

## Agent Files (for Cline)
Copy content from `.agents/specialized/` files into Cline's system prompt:
- `frontend-developer.md` — React Native UI tasks
- `ui-designer.md` — Visual design tasks
- `code-reviewer.md` — Quality checks
- `backend-architect.md` — Store/API logic

## Workflow Commands

### In Freebuff (me):
```
"Switch to UI Designer role. Make the habits tab look premium and polished."
"Switch to Frontend Developer. Build the set logging component."
"Switch to Code Reviewer. Review workouts.tsx for bugs."
```

### In Cline (paste these):
```
1. Read CLAUDE.md first
2. Then read the specific files I need to work on
3. [Your specific task]
4. Run npx tsc --noEmit to verify
5. Don't commit — just make the changes
```
