import { useEffect, useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

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

/**
 * Pure, testable digit editing. Native inputs may briefly contain both the
 * existing selected digit and a newly typed digit (e.g. "39").
 */
export function updateOtpValue(
  current: string, index: number, raw: string, length: number, mode: 'change' | 'paste' = 'change',
) {
  const size = Number.isFinite(length) ? Math.max(1, Math.min(12, Math.floor(length))) : 6
  const code = normalize(current, size)
  const position = Math.max(0, Math.min(index, code.length))
  let digits = normalize(raw, size)
  if (mode === 'change' && digits.length === 2 && code[position] === digits[0]) {
    digits = digits.slice(-1)
  }
  if (!digits) return code.slice(0, position) + code.slice(position + 1)
  return (code.slice(0, position) + digits + code.slice(position + digits.length)).slice(0, size)
}

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
  const announced = useRef('')
  // A controlled parent may clear the code without a local input event.
  useEffect(() => {
    if (code.length !== size) announced.current = ''
  }, [code, size])

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
  const replace = (index: number, text: string, mode: 'change' | 'paste') => {
    const next = updateOtpValue(code, index, text, size, mode)
    commit(next)
    if (normalize(text, size)) {
      // Cursor remains in the final cell when the code is complete.
      const advance = normalize(text, size).length
      focus(Math.min(size - 1, index + (mode === 'change' && advance === 2 && code[index] === text[0] ? 1 : advance)))
    }
  }
  const onChange = (index: number, event: ChangeEvent<HTMLInputElement>) =>
    replace(index, event.target.value, 'change')
  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    replace(index, event.clipboardData.getData('text'), 'paste')
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
