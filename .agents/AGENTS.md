# Arise - AI Agent Team & Token-Saving Protocol

## 💡 Token-Saving Protocol: Claude (Plan/Review) → Gemini (Build)

1. **When using Claude:** Ask for `/plan` or architecture. Claude produces the exact blueprint with files, logic, types, and edge cases, then stops without generating heavy code.
2. **When using Gemini:** Pass Claude's plan. Gemini writes the full code, creates components, updates styling, and verifies `npx tsc --noEmit`.
3. **When doing Code Review:** Claude audits the implementation for edge cases and correctness.

---

## Available Specialized Agents

### 🎨 Frontend Team
| Agent | File | Specialty |
|-------|------|-----------|
| **Frontend Developer** | `specialized/frontend-developer.md` | React Native UI, components, styling |
| **Mobile App Builder** | `specialized/mobile-app-builder.md` | React Native, Expo, mobile features |
| **UI Designer** | `specialized/ui-designer.md` | Visual design, color theory, layouts |
| **UX Architect** | `specialized/ux-architect.md` | User flow, navigation, experience |

### ⚙️ Backend Team
| Agent | File | Specialty |
|-------|------|-----------|
| **Backend Architect** | `specialized/backend-architect.md` | API design, database, architecture |

### 🔍 Quality Team
| Agent | File | Specialty |
|-------|------|-----------|
| **Code Reviewer** | `specialized/code-reviewer.md` | Code quality, best practices |
| **Test Automation** | `specialized/test-automation.md` | Automated testing |
| **Performance Tester** | `specialized/performance-tester.md` | Speed, optimization |

### 🚀 Development Team
| Agent | File | Specialty |
|-------|------|-----------|
| **Rapid Prototyper** | `specialized/rapid-prototyper.md` | Quick MVPs, fast iteration |

---

## Agent Roles for Arise

| Task | Best Agent & Model |
|------|--------------------|
| Create Implementation Plan | Claude Sonnet / Opus |
| Build UI & write components | Gemini 2.5 Pro / 3.7 Flash |
| Create new screens & actions | Gemini 2.5 Pro / 3.7 Flash |
| Deep code review & security audit | Claude Sonnet / Opus |
| Quick bug fixes & typos | MIMO 2.5 / Fast Model |


