import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { COURSE_NAME, COURSE_INSTANCE } from '../config/course'

type CourseSettings = {
  courseName: string
  courseInstance: string
}

type CourseContextValue = {
  courseName: string
  courseInstance: string
  courseFull: string
  courseInitial: string
  setCourseName: (value: string) => void
  setCourseInstance: (value: string) => void
  resetCourse: () => void
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined)

const STORAGE_KEY_BASE = 'study-tracker-course'

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const storageKey = useMemo(
    () => `${STORAGE_KEY_BASE}-${user?.email ?? 'guest'}`,
    [user?.email],
  )
  const [settings, setSettings] = useState<CourseSettings>(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CourseSettings
        const isLegacyReact =
          parsed.courseName === 'ReactJS' && parsed.courseInstance === 'October 2025'
        if (isLegacyReact) {
          return { courseName: COURSE_NAME, courseInstance: COURSE_INSTANCE }
        }
        return parsed
      } catch {
        /* ignore */
      }
    }
    return { courseName: COURSE_NAME, courseInstance: COURSE_INSTANCE }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings))
  }, [settings, storageKey])

  const setCourseName = useCallback((value: string) => {
    setSettings((prev) => ({ ...prev, courseName: value }))
  }, [])

  const setCourseInstance = useCallback((value: string) => {
    setSettings((prev) => ({ ...prev, courseInstance: value }))
  }, [])

  const resetCourse = useCallback(() => {
    setSettings({ courseName: COURSE_NAME, courseInstance: COURSE_INSTANCE })
  }, [])

  const value: CourseContextValue = useMemo(
    () => ({
      courseName: settings.courseName,
      courseInstance: settings.courseInstance,
      courseFull:
        settings.courseName && settings.courseInstance
          ? `${settings.courseName} – ${settings.courseInstance}`
          : settings.courseName || settings.courseInstance || 'SoftUni Course',
      courseInitial:
        settings.courseName?.charAt(0).toUpperCase() ||
        settings.courseInstance?.charAt(0).toUpperCase() ||
        'S',
      setCourseName,
      setCourseInstance,
      resetCourse,
    }),
    [settings.courseName, settings.courseInstance, setCourseName, setCourseInstance, resetCourse],
  )

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCourse = () => {
  const ctx = useContext(CourseContext)
  if (!ctx) {
    throw new Error('useCourse must be used within CourseProvider')
  }
  return ctx
}
