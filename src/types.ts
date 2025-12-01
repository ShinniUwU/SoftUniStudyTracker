export type ExerciseStatus = 'not_started' | 'in_progress' | 'done'

export interface Exercise {
  id: string
  title: string
  status: ExerciseStatus
}

export interface Topic {
  id: string
  title: string
  description: string
  exerciseCount: number
  note: string
  exercises: Exercise[]
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface StudyState {
  topics: Topic[]
  examDate: string
  checklist: ChecklistItem[]
}
