import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'
import { ProgressBar } from '../components/ProgressBar'

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
  const { topics, getTopicProgress, overallProgress, examDate } = useStudy()
  const { user } = useAuth()
  const countdown = formatCountdown(examDate)

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Welcome back, {user?.email}</p>
          <h2>ReactJS Study Tracker</h2>
          <p className="muted">
            Quick snapshot of your ReactJS – October 2025 journey. Track topic progress, exercises,
            and prep for the final exam.
          </p>
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

      <section className="card">
        <header className="section-header">
          <div>
            <p className="eyebrow">Course syllabus</p>
            <h3>Topics & exercises</h3>
          </div>
          <p className="muted">Click a topic to update exercises, status, and notes.</p>
        </header>
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
