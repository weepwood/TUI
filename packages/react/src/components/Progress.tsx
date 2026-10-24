import { forwardRef, type HTMLAttributes } from 'react'

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  max?: number
  label: string
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, className = '', ...props },
  ref,
) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(value, safeMax)) : 0
  const percent = (safeValue / safeMax) * 100
  return (
    <div {...props} ref={ref} className={['tui-progress', className].filter(Boolean).join(' ')}>
      <div className="tui-progress__labels"><span>{label}</span><span>{Math.round(percent)}%</span></div>
      <div className="tui-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
        <div className="tui-progress__fill" style={{ width: percent + '%' }} />
      </div>
    </div>
  )
})
