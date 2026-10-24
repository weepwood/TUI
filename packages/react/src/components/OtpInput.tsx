import { useId, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

export interface OtpInputProps {
  /** Number of cells; limited to 1–12 to avoid accidental huge input groups. */
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Invoked by a user action whenever a *different* full code is entered. */
  onComplete?: (value: string) => void
  label: string
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

const normalize = (value: string, length: number) =>
  value.replace(/\D/g, '').slice(0, length)

export function OtpInput({
  length = 6, value, defaultValue = '', onValueChange, onComplete,
  label, disabled = false, autoFocus = false, className = '',
}: OtpInputProps) {
  const size = Number.isFinite(length) ? Math.min(12, Math.max(1, Math.floor(length))) : 6
  const [localValue, setLocalValue] = useState(() => normalize(defaultValue, size))
  // Maintain a contiguous code: deleting a digit shifts later digits left.
  const code = normalize(value === undefined ? localValue : value, size)
  const cells = Array.from({ length: size }, (_, i) => code[i] ?? '')
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const id = useId()
  const announced = useRef('')

  const focus = (position: number) => {
    const target = inputs.current[Math.min(size - 1, Math.max(0, position))]
    target?.focus()
    target?.select()
  }
  const commit = (next: string) => {
    const clean = normalize(next, size)
    if (value === undefined) setLocalValue(clean)
    if (clean !== code) onValueChange?.(clean)
    if (clean.length === size && clean !== announced.current) {
      announced.current = clean
      if (clean !== code) onComplete?.(clean)
    }
    if (clean.length < size) announced.current = ''
  }
  const replace = (index: number, text: string) => {
    const digits = normalize(text, size)
    const at = Math.min(index, code.length)
    if (!digits) {
      commit(code.slice(0, at) + code.slice(at + 1))
      return
    }
    // Paste/typing replaces the selected range without introducing gaps.
    commit((code.slice(0, at) + digits + code.slice(at + digits.length)).slice(0, size))
    focus(Math.min(size - 1, at + digits.length))
  }
  const onChange = (index: number, event: ChangeEvent<HTMLInputElement>) =>
    replace(index, event.target.value)
  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    replace(index, event.clipboardData.getData('text'))
  }
  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); focus(index - 1) }
    else if (event.key === 'ArrowRight') { event.preventDefault(); focus(index + 1) }
    else if (event.key === 'Home') { event.preventDefault(); focus(0) }
    else if (event.key === 'End') { event.preventDefault(); focus(size - 1) }
    else if (event.key === 'Backspace') {
      event.preventDefault()
      const position = index < code.length ? index : code.length
      if (position > 0 && index >= code.length) {
        commit(code.slice(0, position - 1))
        focus(position - 1)
      } else if (index < code.length) {
        commit(code.slice(0, index) + code.slice(index + 1))
      }
    } else if (event.key === 'Delete') {
      event.preventDefault()
      if (index < code.length) commit(code.slice(0, index) + code.slice(index + 1))
    }
  }

  return (
    <div className={['tui-otp', className].filter(Boolean).join(' ')} role="group" aria-label={label}>
      {cells.map((digit, index) => (
        <input
          key={index}
          ref={element => { inputs.current[index] = element }}
          id={index === 0 ? id : undefined}
          className={['tui-otp__cell', digit && 'is-filled'].filter(Boolean).join(' ')}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={size}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          value={digit}
          aria-label={label + '，第 ' + (index + 1) + ' 位，共 ' + size + ' 位'}
          onChange={event => onChange(index, event)}
          onPaste={event => onPaste(index, event)}
          onKeyDown={event => onKeyDown(index, event)}
        />
      ))}
    </div>
  )
}
