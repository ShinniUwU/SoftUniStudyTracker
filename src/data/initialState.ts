import type { StudyState } from '../types'

export const initialState: StudyState = {
  examDate: '2025-10-28T09:00:00Z',
  checklist: [
    { id: 'chk-routing', text: 'Finish routing exercises', done: false },
    { id: 'chk-hooks', text: 'Revise hooks and lifecycle nuances', done: false },
    { id: 'chk-context', text: 'Review context patterns and testing', done: false },
    { id: 'chk-mock', text: 'Do one full mock exam under time', done: false },
  ],
  topics: [
    {
      id: 'kickoff',
      title: 'Course Kickoff & Tooling',
      description: 'Project structure, linting, debugging, and Vite/Bun workflow.',
      note: '',
      exercises: [
        { id: 'kickoff-env', title: 'Set up project and repo hygiene checklist', status: 'not_started' },
        { id: 'kickoff-devtools', title: 'Debug a component tree with React DevTools', status: 'not_started' },
        { id: 'kickoff-lint', title: 'Add ESLint rules and fix warnings', status: 'not_started' },
      ],
    },
    {
      id: 'components',
      title: 'Components & JSX',
      description: 'JSX syntax, props, composition, and layout building blocks.',
      note: '',
      exercises: [
        { id: 'components-card', title: 'Build a reusable card component', status: 'not_started' },
        { id: 'components-layout', title: 'Compose a dashboard from primitives', status: 'not_started' },
        { id: 'components-accessibility', title: 'Add accessibility props to UI', status: 'not_started' },
      ],
    },
    {
      id: 'state-events',
      title: 'State, Props & Events',
      description: 'State updates, lifting state, event handling, and derived data.',
      note: '',
      exercises: [
        { id: 'state-counter', title: 'Counter with derived badges', status: 'not_started' },
        { id: 'state-filtering', title: 'Filterable list with chips', status: 'not_started' },
        { id: 'state-forms', title: 'Controlled inputs with validation', status: 'not_started' },
      ],
    },
    {
      id: 'lists-forms',
      title: 'Lists, Keys & Forms',
      description: 'Lists, keys, conditional rendering, controlled forms, and validation.',
      note: '',
      exercises: [
        { id: 'lists-keys', title: 'Render a table with stable keys', status: 'not_started' },
        { id: 'forms-controlled', title: 'Build a controlled form with error states', status: 'not_started' },
        { id: 'forms-submit', title: 'Handle submit + reset flows', status: 'not_started' },
      ],
    },
    {
      id: 'routing',
      title: 'Routing & Navigation',
      description: 'React Router patterns, params, guards, and nested layouts.',
      note: '',
      exercises: [
        { id: 'routing-params', title: 'Details page with URL params', status: 'not_started' },
        { id: 'routing-guards', title: 'Add guarded routes with redirects', status: 'not_started' },
        { id: 'routing-nav', title: 'Active nav styling and breadcrumbs', status: 'not_started' },
      ],
    },
    {
      id: 'hooks',
      title: 'Hooks Deep Dive',
      description: 'useEffect, custom hooks, and handling async flows.',
      note: '',
      exercises: [
        { id: 'hooks-effect', title: 'Data fetching with cleanup and deps', status: 'not_started' },
        { id: 'hooks-custom', title: 'Write a custom hook for persistence', status: 'not_started' },
        { id: 'hooks-async', title: 'Handle loading/error UI states', status: 'not_started' },
      ],
    },
    {
      id: 'context',
      title: 'Context & State Management',
      description: 'Context API patterns, reducers, and state co-location choices.',
      note: '',
      exercises: [
        { id: 'context-provider', title: 'Refactor shared state into context', status: 'not_started' },
        { id: 'context-reducer', title: 'Add reducer for predictable updates', status: 'not_started' },
        { id: 'context-optimizations', title: 'Avoid unnecessary re-renders', status: 'not_started' },
      ],
    },
    {
      id: 'testing',
      title: 'Testing & Quality',
      description: 'React Testing Library, user flows, and mocking data sources.',
      note: '',
      exercises: [
        { id: 'testing-render', title: 'Render a component with providers', status: 'not_started' },
        { id: 'testing-events', title: 'Write a user flow test', status: 'not_started' },
        { id: 'testing-mock', title: 'Mock network calls with MSW', status: 'not_started' },
      ],
    },
    {
      id: 'performance',
      title: 'Performance & Patterns',
      description: 'Memoization, lazy loading, suspense patterns, and profiling.',
      note: '',
      exercises: [
        { id: 'performance-memo', title: 'Profile a list and add memoization', status: 'not_started' },
        { id: 'performance-lazy', title: 'Lazy load a heavy section', status: 'not_started' },
        { id: 'performance-suspense', title: 'Experiment with Suspense fallback UI', status: 'not_started' },
      ],
    },
  ],
}
