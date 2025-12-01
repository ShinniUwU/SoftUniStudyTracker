import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'
import { ProgressBar } from '../components/ProgressBar'
import { useCourse } from '../context/CourseContext'

const formatCountdown = (examDate: string) => {
  const target = new Date(examDate).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return 'Exam day is here. Good luck!'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  return `${days}d ${hours}h remaining`
}

export const Dashboard = () => {
  const {
    topics,
    getTopicProgress,
    overallProgress,
    examDate,
    addTopic,
    updateTopic,
    deleteTopic,
  } = useStudy()
  const { user } = useAuth()
  const {
    courseFull,
    courseName,
    courseInstance,
    setCourseName,
    setCourseInstance,
    resetCourse,
  } = useCourse()
  const countdown = formatCountdown(examDate)
  const [showCustomize, setShowCustomize] = useState(false)
  const [newTopic, setNewTopic] = useState({ title: '', description: '', exerciseCount: 3 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', exerciseCount: 0 })
  const [courseForm, setCourseForm] = useState({ name: courseName, instance: courseInstance })

  const handleAddTopic = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newTopic.title.trim()) return
    addTopic({
      title: newTopic.title,
      description: newTopic.description,
      exerciseCount: Number(newTopic.exerciseCount) || 0,
    })
    setNewTopic({ title: '', description: '', exerciseCount: 3 })
  }

  const startEdit = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return
    setEditingId(topicId)
    setEditForm({
      title: topic.title,
      description: topic.description,
      exerciseCount: topic.exerciseCount,
    })
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingId) return
    updateTopic(editingId, {
      title: editForm.title,
      description: editForm.description,
      exerciseCount: Number(editForm.exerciseCount) || 0,
    })
    setEditingId(null)
  }

  const handleDelete = (topicId: string) => {
    deleteTopic(topicId)
    if (editingId === topicId) {
      setEditingId(null)
    }
  }

  const handleCourseSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCourseName(courseForm.name.trim() || 'SoftUni Course')
    setCourseInstance(courseForm.instance.trim())
  }

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Welcome back, {user?.email}</p>
          <h2>SoftUni Study Tracker</h2>
          <p className="muted">Course: {courseFull}. Track topics, exercises, and prep progress.</p>
        </div>
        <div className="stat-card">
          <p className="muted tiny">Overall progress</p>
          <p className="stat-number">{overallProgress}%</p>
          <ProgressBar value={overallProgress} size="sm" />
          <p className="muted tiny">Exam countdown: {countdown}</p>
          <Link to="/exam" className="ghost-link">
            Go to exam prep →
          </Link>
        </div>
      </section>

      <div className="card">
        <header className="section-header">
          <div>
            <p className="eyebrow">Course settings</p>
            <h3>Make it your SoftUni course</h3>
          </div>
          <p className="muted tiny">Update name and instance; brand and exam prep will reflect it.</p>
        </header>
        <form className="inline-form" onSubmit={handleCourseSave} style={{ gridTemplateColumns: '1fr 1fr auto' }}>
          <input
            type="text"
            placeholder="Course name (e.g., JS Advanced)"
            defaultValue={courseName}
            onChange={(e) => setCourseForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Instance (e.g., Feb 2026)"
            defaultValue={courseInstance}
            onChange={(e) => setCourseForm((prev) => ({ ...prev, instance: e.target.value }))}
          />
          <button type="submit" className="primary-button">
            Save course
          </button>
        </form>
        <div className="actions-row" style={{ marginTop: '0.5rem' }}>
          <button type="button" className="ghost-button" onClick={resetCourse}>
            Reset to default
          </button>
        </div>
      </div>

      <section className="card">
        <header className="section-header">
          <div>
            <p className="eyebrow">Course syllabus</p>
            <h3>Topics & exercises</h3>
          </div>
          <p className="muted">Click a topic to update exercises, status, and notes.</p>
        </header>
        <div className="actions-row" style={{ justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <button type="button" className="ghost-button" onClick={() => setShowCustomize((v) => !v)}>
            {showCustomize ? 'Hide customization' : 'Customize syllabus'}
          </button>
        </div>

        {showCustomize && (
          <div className="customize-panel">
            <form className="login-form customize-form" onSubmit={handleAddTopic}>
              <div>
                <h4>Add topic</h4>
                <p className="muted tiny">Create your own syllabus: title, short description, and exercise count.</p>
              </div>
              <label>
                Title
                <input
                  value={newTopic.title}
                  onChange={(e) => setNewTopic((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </label>
              <label>
                Number of exercises
                <input
                  type="number"
                  min={0}
                  value={newTopic.exerciseCount}
                  onChange={(e) =>
                    setNewTopic((prev) => ({ ...prev, exerciseCount: Number(e.target.value) }))
                  }
                />
              </label>
              <div className="actions-row">
                <button type="submit" className="primary-button">
                  Add topic
                </button>
              </div>
            </form>

            <div className="customize-list">
              <div className="customize-list-header">
                <h4>Manage topics</h4>
                <p className="muted tiny">Edit or delete topics you no longer need.</p>
              </div>
              {topics.map((topic) => (
                <div key={topic.id} className="exercise-row customize-list-item">
                  {editingId === topic.id ? (
                    <form className="login-form" onSubmit={handleEditSubmit} style={{ width: '100%' }}>
                      <label>
                        Title
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, description: e.target.value }))
                          }
                          rows={3}
                        />
                      </label>
                      <label>
                        Number of exercises
                        <input
                          type="number"
                          min={0}
                          value={editForm.exerciseCount}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              exerciseCount: Number(e.target.value),
                            }))
                          }
                        />
                      </label>
                      <div className="actions-row">
                        <button type="submit" className="primary-button">
                          Save
                        </button>
                        <button type="button" className="ghost-button" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="customize-list-row">
                      <div>
                        <p className="exercise-title">{topic.title}</p>
                        <p className="muted tiny">
                          {topic.description} • {topic.exercises.length} exercises
                        </p>
                      </div>
                      <div className="actions-row">
                        <button type="button" className="ghost-button" onClick={() => startEdit(topic.id)}>
                          Edit
                        </button>
                        <button type="button" className="ghost-button" onClick={() => handleDelete(topic.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {topics.length === 0 && <p className="muted">No topics yet. Add your first one above.</p>}
            </div>
          </div>
        )}

        <div className="topics-grid">
          {topics.map((topic) => {
            const progress = getTopicProgress(topic.id)
            const doneLabel =
              progress.total > 0 ? `${progress.completed}/${progress.total} exercises` : 'No exercises'
            return (
              <Link key={topic.id} to={`/topic/${topic.id}`} className="topic-card">
                <div className="topic-header">
                  <h4>{topic.title}</h4>
                  <span className="progress-chip">{progress.percent}%</span>
                </div>
                <p className="muted">{topic.description}</p>
                <ProgressBar value={progress.percent} size="sm" label={doneLabel} />
                <div className="topic-footer">
                  <span className="status-dot" data-state={progress.percent === 100 ? 'done' : progress.percent > 0 ? 'progress' : 'idle'} />
                  <p className="muted tiny">
                    {progress.percent === 100 ? 'Ready to revise' : 'Keep pushing — small reps win.'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
