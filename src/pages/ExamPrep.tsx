import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useStudy } from '../context/StudyContext'
import { ProgressBar } from '../components/ProgressBar'

type Countdown = { days: number; hours: number; minutes: number; past: boolean }

const getCountdown = (isoDate: string): Countdown => {
  const target = new Date(isoDate).getTime()
  const diff = target - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, past: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { days, hours, minutes, past: false }
}

export const ExamPrep = () => {
  const { examDate, checklist, toggleChecklistItem, addChecklistItem, updateExamDate } = useStudy()
  const [newItem, setNewItem] = useState('')
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(examDate))

  const completed = checklist.filter((item) => item.done).length
  const percent = checklist.length === 0 ? 0 : Math.round((completed / checklist.length) * 100)
  const examMessage = countdown.past
    ? 'Exam time. Set a new date to keep tracking.'
    : 'Stay steady — focus on weak spots.'

  const datetimeLocalValue = useMemo(() => {
    const date = new Date(examDate)
    const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    return iso
  }, [examDate])

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(examDate)), 60 * 1000)
    return () => clearInterval(timer)
  }, [examDate])

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addChecklistItem(newItem)
    setNewItem('')
  }

  const handleDateChange = (value: string) => {
    if (!value) return
    const iso = new Date(value).toISOString()
    updateExamDate(iso)
    setCountdown(getCountdown(iso))
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Course exam preparation</p>
          <h2>Countdown & readiness</h2>
          <p className="muted">
            Keep the final exam date visible and ship small, consistent prep tasks.
          </p>
        </div>
        <div className="countdown-card">
          <p className="muted tiny">Exam date</p>
          <div className="countdown-values">
            <div>
              <p className="stat-number">{countdown.days}</p>
              <p className="muted tiny">days</p>
            </div>
            <div>
              <p className="stat-number">{countdown.hours}</p>
              <p className="muted tiny">hours</p>
            </div>
            <div>
              <p className="stat-number">{countdown.minutes}</p>
              <p className="muted tiny">minutes</p>
            </div>
          </div>
          <p className={countdown.past ? 'error tiny' : 'muted tiny'}>{examMessage}</p>
          <div className="field-group">
            <label className="muted tiny" htmlFor="exam-date-input">
              Update exam date
            </label>
            <input
              id="exam-date-input"
              type="datetime-local"
              value={datetimeLocalValue}
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <p className="muted tiny countdown-meta">Local timezone · Keeps your countdown in sync.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <header className="section-header">
          <div>
            <p className="eyebrow">Checklist</p>
            <h3>Exam readiness tasks</h3>
          </div>
          <ProgressBar value={percent} size="sm" label={`${completed}/${checklist.length} done`} />
        </header>

        <form className="inline-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Add a prep task..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit" className="primary-button">
            Add
          </button>
        </form>

        <ul className="checklist">
          {checklist.map((item) => (
            <li key={item.id} className="checklist-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                />
                <span className={item.done ? 'done' : ''}>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
