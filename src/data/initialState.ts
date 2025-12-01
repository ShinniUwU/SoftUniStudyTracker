import type { StudyState } from '../types'
import { DEFAULT_EXAM_DATE } from '../config/course'

// Swap this array to adapt the tracker for ANY SoftUni course
export const initialTopics: StudyState['topics'] = []

export const initialState: StudyState = {
  examDate: `${DEFAULT_EXAM_DATE}T09:00:00Z`,
  checklist: [
    { id: 'chk-routing', text: 'Finish routing exercises', done: false },
    { id: 'chk-hooks', text: 'Revise hooks and lifecycle nuances', done: false },
    { id: 'chk-context', text: 'Review context patterns and testing', done: false },
    { id: 'chk-mock', text: 'Do one full mock exam under time', done: false },
  ],
  topics: initialTopics,
}
