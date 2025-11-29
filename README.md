# ReactJS Study Tracker

Small app for tracking my progress through the **SoftUni ReactJS – October 2025** course.

## Features

- Email/password login (local only, persisted in `localStorage`)
- Dashboard with:
  - list of topics from the course syllabus
  - per-topic progress (0–100%, completed exercises)
- Topic details page:
  - list of exercises with status: _Not started / In progress / Done_
  - personal notes per topic
- Exam prep page:
  - exam date countdown
  - checklist of prep tasks
- SoftUni-inspired layout (header, footer, responsive cards)

## Tech stack

- React + React Router
- Context + hooks for state
- Vitest + React Testing Library
- Bun as the runtime/package manager

## Scripts (Bun)

```bash
bun install
bun run dev      # start dev server
bun run build    # production build
bun run test     # run tests
```
