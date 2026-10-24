import { useRef, useState, type KeyboardEvent } from 'react'

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedControlProps {
  options: readonly SegmentedOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label: string
  disabled?: boolean
  className?: string
}

export function SegmentedControl({
  options, value, defaultValue, onValueChange, label, disabled = false, className = '',
}: SegmentedControlProps) {
  const [localValue, setLocalValue] = useState(defaultValue ?? options.find(option => !option.disabled)?.value ?? '')
  const selected = value === undefined ? localValue : value
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const choose = (next: string) => {
    if (disabled || selected === next) return
    if (value === undefined) setLocalValue(next)
    onValueChange?.(next)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let direction = 0
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 1
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = -1
    if (!direction || disabled || !options.length) return
    event.preventDefault()
    let next = index
    for (let attempts = 0; attempts < options.length; attempts++) {
      next = (next + direction + options.length) % options.length
      if (!options[next].disabled) {
        choose(options[next].value)
        refs.current[next]?.focus()
        return
      }
    }
  }

  const focusIndex = Math.max(0, options.findIndex(option => option.value === selected && !option.disabled))
  return (
    <div className={['tui-segmented', className].filter(Boolean).join(' ')} role="radiogroup" aria-label={label} aria-disabled={disabled || undefined}>
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={element => { refs.current[index] = element }}
          type="button"
          role="radio"
          aria-checked={selected === option.value}
          disabled={disabled || option.disabled}
          tabIndex={disabled || option.disabled ? -1 : index === focusIndex ? 0 : -1}
          className={selected === option.value ? 'tui-segmented__option is-selected' : 'tui-segmented__option'}
          onClick={() => choose(option.value)}
          onKeyDown={event => handleKeyDown(event, index)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
