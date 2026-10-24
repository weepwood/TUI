import { useId, useState, type ChangeEvent } from 'react'

export interface RangeSliderProps {
  label: string
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  showValue?: boolean
  disabled?: boolean
  className?: string
}

export function RangeSlider({
  label, min = 0, max = 100, step = 1, value, defaultValue,
  onValueChange, showValue = true, disabled = false, className = '',
}: RangeSliderProps) {
  const lower = Number.isFinite(min) ? min : 0
  const upper = Math.max(lower + 1, Number.isFinite(max) ? max : 100)
  const tick = Number.isFinite(step) && step > 0 ? step : 1
  const bound = (num: number) => Math.min(upper, Math.max(lower, Number.isFinite(num) ? num : lower))
  const [localValue, setLocalValue] = useState(() => bound(defaultValue ?? lower))
  const current = bound(value === undefined ? localValue : value)
  const percentage = (current - lower) / (upper - lower) * 100
  const id = useId()
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const next = bound(event.currentTarget.valueAsNumber)
    if (value === undefined) setLocalValue(next)
    if (next !== current) onValueChange?.(next)
  }
  return (
    <div className={['tui-range', className].filter(Boolean).join(' ')}>
      <div className="tui-range__heading">
        <label htmlFor={id}>{label}</label>
        {showValue && <output htmlFor={id} aria-live="off">{current}</output>}
      </div>
      <input
        className="tui-range__input"
        id={id}
        type="range"
        min={lower}
        max={upper}
        step={tick}
        value={current}
        onChange={change}
        disabled={disabled}
        style={{ '--tui-range-pct': percentage + '%' } as React.CSSProperties}
      />
    </div>
  )
}
