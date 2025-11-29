import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { useStudy } from '../context/StudyContext'
import { type ExerciseStatus } from '../types'

const statusLabels: Record<ExerciseStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
}

export const TopicDetails = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const { topics, updateExerciseStatus, updateTopicNote, getTopicProgress } = useStudy()
  const topic = useMemo(
    () => topics.find((item) => item.id === topicId),
    [topics, topicId],
  )
  const [note, setNote] = useState(topic?.note ?? '')
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNote(topic?.note ?? '')
  }, [topic])

  if (!topic) {
    return (
      <div className="page">
        <div className="card">
          <h3>Topic not found</h3>
          <p className="muted">This topic might have been removed or the URL is wrong.</p>
          <Link to="/" className="ghost-link">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const progress = getTopicProgress(topic.id)

  const handleStatusChange = (exerciseId: string, next: ExerciseStatus) => {
    updateExerciseStatus(topic.id, exerciseId, next)
  }

  const handleSaveNote = () => {
    updateTopicNote(topic.id, note)
    setSavedMessage('Note saved')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Topic</p>
          <h2>{topic.title}</h2>
          <p className="muted">{topic.description}</p>
        </div>
        <div className="stat-card">
          <p className="muted tiny">Progress</p>
          <p className="stat-number">{progress.percent}%</p>
          <ProgressBar value={progress.percent} size="sm" label={`${progress.completed}/${progress.total} done`} />
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <header className="section-header">
            <div>
              <p className="eyebrow">Exercises</p>
              <h3>Status tracker</h3>
            </div>
            <p className="muted tiny">Move items as you progress. Done = counted toward progress.</p>
          </header>
          <ul className="exercise-list">
            {topic.exercises.map((exercise) => (
              <li key={exercise.id} className="exercise-row">
                <div>
                  <p className="exercise-title">{exercise.title}</p>
                  <p className="muted tiny">Status: {statusLabels[exercise.status]}</p>
                </div>
                <div className="exercise-actions">
                  <select
                    value={exercise.status}
                    onChange={(e) => handleStatusChange(exercise.id, e.target.value as ExerciseStatus)}
                  >
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <p className="eyebrow">Notes</p>
          <h3>Topic notes & takeaways</h3>
          <p className="muted tiny">Keep short reminders, pitfalls, or links you want to revisit.</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Key patterns, things to revisit, or links..."
            rows={8}
          />
          <div className="actions-row">
            <button type="button" className="primary-button" onClick={handleSaveNote}>
              Save note
            </button>
            {savedMessage && <span className="muted tiny">{savedMessage}</span>}
          </div>
          <Link to="/" className="ghost-link">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
