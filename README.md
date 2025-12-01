# SoftUni Study Tracker

Configurable tracker for any SoftUni course (currently set to ReactJS – October 2025 via `src/config/course.ts`).

## Features

- Email/password login (local only, persisted in `localStorage`)
- Dashboard with:
  - list of topics from the course syllabus
  - per-topic progress (0–100%, completed exercises)
- Topic details page:
  - list of exercises with status: _Not started / In progress / Done_
  - personal notes per topic
- Exam prep page:
  - exam date countdown (default from course config)
  - checklist of prep tasks
- Resources catalog with public view and owner-only CRUD
- SoftUni-inspired layout (header, footer, responsive cards)

## Tech stack

- React + React Router
- Context + hooks for state (auth, study, resources, theme)
- Vitest + React Testing Library
- Bun as the runtime/package manager

## Scripts (Bun)

```bash
bun install
bun run dev      # start dev server
bun run build    # production build
bun run test     # run tests
```
