import { useEffect, useRef, useState } from 'react'

export interface StepperProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  disabled?: boolean
  /** Holding for 420 ms repeats changes every 90 ms. */
  repeatOnHold?: boolean
  className?: string
}

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export function Stepper({
  value, defaultValue = 0, onValueChange, min = 0, max = 100, step = 1,
  label, disabled = false, repeatOnHold = true, className = '',
}: StepperProps) {
  const lower = finite(min, 0)
  const upper = Math.max(lower, finite(max, 100))
  const delta = Math.max(0.000001, finite(step, 1))
  const [localValue, setLocalValue] = useState(() => clamp(finite(defaultValue, lower), lower, upper))
  const current = clamp(finite(value === undefined ? localValue : value, lower), lower, upper)
  const latest = useRef(current)
  latest.current = current
  const timers = useRef<{ delay?: ReturnType<typeof setTimeout>, interval?: ReturnType<typeof setInterval> }>({})
  const didRepeat = useRef(false)
  const pointerDown = useRef(false)

  const stop = () => {
    if (timers.current.delay) clearTimeout(timers.current.delay)
    if (timers.current.interval) clearInterval(timers.current.interval)
    timers.current = {}
    pointerDown.current = false
  }
  useEffect(() => () => stop(), [])

  const increment = (direction: number) => {
    if (disabled) return
    const next = clamp(Number((latest.current + direction * delta).toFixed(8)), lower, upper)
    if (next === latest.current) return
    latest.current = next
    if (value === undefined) setLocalValue(next)
    onValueChange?.(next)
  }
  const hold = (direction: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || disabled || !repeatOnHold) return
      stop()
      pointerDown.current = true
      didRepeat.current = false
      try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* non-capturing browsers */ }
      timers.current.delay = setTimeout(() => {
        if (!pointerDown.current) return
        didRepeat.current = true
        increment(direction)
        timers.current.interval = setInterval(() => increment(direction), 90)
      }, 420)
    },
    onPointerUp: stop,
    onPointerCancel: () => { stop(); didRepeat.current = true },
    onLostPointerCapture: stop,
    onClick: () => {
      if (didRepeat.current) { didRepeat.current = false; return }
      increment(direction)
    },
  })

  return (
    <div className={['tui-stepper', className].filter(Boolean).join(' ')} role="group" aria-label={label}>
      <button type="button" className="tui-stepper__button" aria-label={'减少 ' + label} disabled={disabled || current <= lower} {...hold(-1)}>−</button>
      <output className="tui-stepper__value" aria-live="polite" aria-label={label}>{current}</output>
      <button type="button" className="tui-stepper__button" aria-label={'增加 ' + label} disabled={disabled || current >= upper} {...hold(1)}>+</button>
    </div>
  )
}
