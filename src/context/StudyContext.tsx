import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { initialState } from '../data/initialState'
import { useAuth } from './AuthContext'
import {
  type ChecklistItem,
  type ExerciseStatus,
  type StudyState,
  type Topic,
} from '../types'

type StudyContextValue = {
  state: StudyState
  topics: Topic[]
  checklist: ChecklistItem[]
  examDate: string
  addTopic: (data: { title: string; description: string; exerciseCount: number }) => void
  updateTopic: (
    topicId: string,
    changes: Partial<Pick<Topic, 'title' | 'description' | 'exerciseCount'>>,
  ) => void
  deleteTopic: (topicId: string) => void
  addExercise: (topicId: string, title: string) => void
  updateExerciseTitle: (topicId: string, exerciseId: string, title: string) => void
  updateExerciseStatus: (
    topicId: string,
    exerciseId: string,
    status: ExerciseStatus,
  ) => void
  updateTopicNote: (topicId: string, note: string) => void
  addChecklistItem: (text: string) => void
  toggleChecklistItem: (itemId: string) => void
  updateExamDate: (isoDate: string) => void
  getTopicProgress: (topicId: string) => { completed: number; total: number; percent: number }
  overallProgress: number
}

const StudyContext = createContext<StudyContextValue | undefined>(undefined)

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2, 9)}`
}

const buildExercises = (count: number) => {
  const safe = Math.max(0, Math.floor(count))
  return Array.from({ length: safe }, (_v, idx) => {
    const num = idx + 1
    return { id: createId(), title: `Exercise ${num}`, status: 'not_started' as ExerciseStatus }
  })
}

const alignExercises = (existing: Topic, nextCount: number) => {
  const safe = Math.max(0, Math.floor(nextCount))
  const current = existing.exercises
  if (safe === current.length) return current
  if (safe < current.length) {
    return current.slice(0, safe)
  }
  const toAdd = safe - current.length
  const added = Array.from({ length: toAdd }, (_v, idx) => {
    const num = current.length + idx + 1
    return { id: createId(), title: `Exercise ${num}`, status: 'not_started' as ExerciseStatus }
  })
  return [...current, ...added]
}

const legacyTopicIds = new Set([
  'kickoff',
  'components',
  'state-events',
  'lists-forms',
  'routing',
  'hooks',
  'context',
  'testing',
  'performance',
])

const stripLegacyTopics = (state: StudyState): StudyState => {
  if (state.topics.length === 0) return state
  const allLegacy = state.topics.every((topic) => legacyTopicIds.has(topic.id))
  if (allLegacy) {
    return { ...state, topics: [] }
  }
  return state
}

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const storageKey = useMemo(
    () => `study-tracker-progress-${user?.email ?? 'guest'}`,
    [user?.email],
  )
  const [state, setState] = useState<StudyState>(() => {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return initialState
    try {
      return stripLegacyTopics(JSON.parse(stored) as StudyState)
    } catch {
      return initialState
    }
  })
  const hydratedKey = useRef(storageKey)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      setState(initialState)
      hydratedKey.current = storageKey
      return
    }
    try {
      setState(stripLegacyTopics(JSON.parse(stored) as StudyState))
    } catch {
      setState(initialState)
    } finally {
      hydratedKey.current = storageKey
    }
  }, [storageKey])

  useEffect(() => {
    if (hydratedKey.current !== storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  const updateExerciseStatus = useCallback(
    (topicId: string, exerciseId: string, status: ExerciseStatus) => {
      setState((prev) => ({
        ...prev,
        topics: prev.topics.map((topic) =>
          topic.id !== topicId
            ? topic
            : {
                ...topic,
                exercises: topic.exercises.map((exercise) =>
                  exercise.id === exerciseId ? { ...exercise, status } : exercise,
                ),
              },
        ),
      }))
    },
    [],
  )

  const updateTopicNote = useCallback((topicId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.id === topicId ? { ...topic, note } : topic,
      ),
    }))
  }, [])

  const addChecklistItem = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const nextItem: ChecklistItem = { id: createId(), text: trimmed, done: false }
    setState((prev) => ({
      ...prev,
      checklist: [nextItem, ...prev.checklist],
    }))
  }, [])

  const toggleChecklistItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item,
      ),
    }))
  }, [])

  const updateExamDate = useCallback((isoDate: string) => {
    setState((prev) => ({
      ...prev,
      examDate: isoDate,
    }))
  }, [])

  const addTopic = useCallback((data: { title: string; description: string; exerciseCount: number }) => {
    const exerciseCount = Math.max(0, Math.floor(data.exerciseCount))
    const exercises = buildExercises(exerciseCount)
    const nextTopic: Topic = {
      id: createId(),
      title: data.title.trim(),
      description: data.description.trim(),
      exerciseCount,
      note: '',
      exercises,
    }
    setState((prev) => ({
      ...prev,
      topics: [nextTopic, ...prev.topics],
    }))
  }, [])

  const updateTopic = useCallback(
    (topicId: string, changes: Partial<Pick<Topic, 'title' | 'description' | 'exerciseCount'>>) => {
      setState((prev) => ({
        ...prev,
        topics: prev.topics.map((topic) => {
          if (topic.id !== topicId) return topic
          const nextCount =
            typeof changes.exerciseCount === 'number' ? Math.max(0, Math.floor(changes.exerciseCount)) : topic.exerciseCount
          const nextExercises =
            typeof changes.exerciseCount === 'number' ? alignExercises(topic, nextCount) : topic.exercises
          return {
            ...topic,
            title: changes.title?.trim() ?? topic.title,
            description: changes.description?.trim() ?? topic.description,
            exerciseCount: nextCount,
            exercises: nextExercises,
          }
        }),
      }))
    },
    [],
  )

  const deleteTopic = useCallback((topicId: string) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic.id !== topicId),
    }))
  }, [])

  const addExercise = useCallback((topicId: string, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.id !== topicId
          ? topic
          : {
              ...topic,
              exerciseCount: topic.exercises.length + 1,
              exercises: [
                ...topic.exercises,
                { id: createId(), title: trimmed, status: 'not_started' as ExerciseStatus },
              ],
            },
      ),
    }))
  }, [])

  const updateExerciseTitle = useCallback((topicId: string, exerciseId: string, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.id !== topicId
          ? topic
          : {
              ...topic,
              exercises: topic.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, title: trimmed } : exercise,
              ),
            },
      ),
    }))
  }, [])

  const getTopicProgress = useCallback(
    (topicId: string) => {
      const topic = state.topics.find((t) => t.id === topicId)
      if (!topic || topic.exercises.length === 0) {
        return { completed: 0, total: 0, percent: 0 }
      }
      const completed = topic.exercises.filter((e) => e.status === 'done').length
      const total = topic.exercises.length
      const percent = Math.round((completed / total) * 100)
      return { completed, total, percent }
    },
    [state.topics],
  )

  const overallProgress = useMemo(() => {
    const totals = state.topics.map((t) => getTopicProgress(t.id).percent)
    if (totals.length === 0) return 0
    const sum = totals.reduce((acc, val) => acc + val, 0)
    return Math.round(sum / totals.length)
  }, [state.topics, getTopicProgress])

  const value: StudyContextValue = {
    state,
    topics: state.topics,
    checklist: state.checklist,
    examDate: state.examDate,
    addTopic,
    updateTopic,
    deleteTopic,
    addExercise,
    updateExerciseTitle,
    updateExerciseStatus,
    updateTopicNote,
    addChecklistItem,
    toggleChecklistItem,
    updateExamDate,
    getTopicProgress,
    overallProgress,
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStudy = () => {
  const ctx = useContext(StudyContext)
  if (!ctx) {
    throw new Error('useStudy must be used within StudyProvider')
  }
  return ctx
}
