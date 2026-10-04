# Agent Instructions & Project Guidelines (UniTask)

This document establishes the guidelines, operational standards, and autonomous execution policies for AI assistants working in this repository.

---

## 1. Autonomous Execution & Permissions ("Always Allow")

- **Autonomous Tool Execution**: The user has designated this project for autonomous operation. Commands related to building, linting, inspecting, and testing should run proactively without requesting repetitive manual permission confirmations.
- **Documentation & Plan Integrity**: Maintain all documentation, comments, and project architecture unless explicitly asked to modify them.
- **Non-Destructive Verification**: Always verify changes using non-destructive commands (e.g. `npm run build`) before finalizing any modifications.

---

## 2. Planning & Development Workflow

- When planning feature expansions or structural changes:
  1. Clearly outline the proposed architecture and affected components.
  2. Implement cleanly in small, verifiable units.
  3. Validate using the build pipeline (`npm run build`).
- Preserve data integrity in `localStorage` keys (`unitask_academic_data_v1_*`).

---

## 3. Technology Stack & Conventions

- **Framework**: React 18 (Vite 4.5.x)
- **Styling**: Tailwind CSS 3.3.x with dark mode support (`dark:` classes and `class` strategy)
- **Icons**: `lucide-react`
- **Audio & Media**: Web Audio API (native browser synthesis without external audio files)
- **State Management**: React Context (`TaskContext.jsx`) with reactive localStorage sync
- **Code Style**:
  - Functional components with hooks.
  - Accessible, semantic HTML.
  - Responsive design supporting both mobile navigation and desktop sidebar.

---

## 4. Key Project Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local Vite development server on port 3000 |
| `npm run build` | Compile and bundle production assets to `dist/` |
| `npm run preview` | Preview production build locally |
