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
  const {
    topics,
    updateExerciseStatus,
    updateTopicNote,
    getTopicProgress,
    addExercise,
    updateExerciseTitle,
  } = useStudy()
  const topic = useMemo(
    () => topics.find((item) => item.id === topicId),
    [topics, topicId],
  )
  const [note, setNote] = useState(topic?.note ?? '')
  const [savedMessage, setSavedMessage] = useState('')
  const [newExercise, setNewExercise] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [addError, setAddError] = useState('')

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

  const handleAddExercise = () => {
    if (!newExercise.trim()) {
      setAddError('Enter an exercise name first.')
      return
    }
    addExercise(topic.id, newExercise)
    setNewExercise('')
    setAddError('')
  }

  const startEdit = (exerciseId: string, currentTitle: string) => {
    setEditingId(exerciseId)
    setEditingTitle(currentTitle)
  }

  const handleEditSave = () => {
    if (!editingId) return
    updateExerciseTitle(topic.id, editingId, editingTitle)
    setEditingId(null)
    setEditingTitle('')
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
          <div className="inline-form" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Add a new exercise..."
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
            />
            <button type="button" className="primary-button" onClick={handleAddExercise}>
              Add
            </button>
          </div>
          {addError && <p className="error tiny" style={{ marginTop: '-0.5rem' }}>{addError}</p>}
          <ul className="exercise-list">
            {topic.exercises.map((exercise) => (
              <li key={exercise.id} className="exercise-row">
                {editingId === exercise.id ? (
                  <>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                      />
                      <p className="muted tiny">Status: {statusLabels[exercise.status]}</p>
                    </div>
                    <div className="exercise-actions">
                      <button type="button" className="primary-button" onClick={handleEditSave}>
                        Save
                      </button>
                      <button type="button" className="ghost-button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="exercise-title">{exercise.title}</p>
                      <p className="muted tiny">Status: {statusLabels[exercise.status]}</p>
                    </div>
                    <div className="exercise-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => startEdit(exercise.id, exercise.title)}
                      >
                        Edit title
                      </button>
                      <select
                        value={exercise.status}
                        onChange={(e) => handleStatusChange(exercise.id, e.target.value as ExerciseStatus)}
                      >
                        <option value="not_started">Not started</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <p className="eyebrow">Notes</p>
          <h3>Topic notes & takeaways</h3>
          <p className="muted tiny">Keep short reminders, pitfalls, or links you want to revisit.</p>
          <div className="note-area">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Key patterns, things to revisit, or links..."
              rows={10}
            />
            <div className="note-meta">
              <span className="muted tiny">{note.length} chars</span>
              {savedMessage && <span className="muted tiny">{savedMessage}</span>}
            </div>
          </div>
          <div className="actions-row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="primary-button" onClick={handleSaveNote}>
              Save note
            </button>
          </div>
          <Link to="/" className="ghost-link">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
