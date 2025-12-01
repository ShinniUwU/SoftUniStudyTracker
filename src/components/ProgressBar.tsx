type ProgressBarProps = {
  value: number
  label?: string
  size?: 'sm' | 'md'
}

export const ProgressBar = ({ value, label, size = 'md' }: ProgressBarProps) => {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div className={`progress ${size}`}>
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track" role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${safeValue}%` }}>
          <span className="progress-value">{safeValue}%</span>
        </div>
      </div>
    </div>
  )
}
