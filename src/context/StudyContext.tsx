import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialState } from '../data/initialState'
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

const STORAGE_KEY = 'study-tracker-state'

const StudyContext = createContext<StudyContextValue | undefined>(undefined)

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2, 9)}`
}

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StudyState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialState
    try {
      return JSON.parse(stored) as StudyState
    } catch {
      return initialState
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

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
