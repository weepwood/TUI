import { forwardRef, useId, type InputHTMLAttributes } from 'react'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hint?: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, className = '', 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helpId = inputId + '-help'
  const description = [describedBy, (error || hint) && helpId].filter(Boolean).join(' ') || undefined
  return (
    <div className={['tui-field', className].filter(Boolean).join(' ')}>
      <label className="tui-field__label" htmlFor={inputId}>{label}</label>
      <input
        {...props}
        ref={ref}
        id={inputId}
        className="tui-field__input"
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={description}
      />
      {(error || hint) && (
        <span id={helpId} className={error ? 'tui-field__error' : 'tui-field__hint'}>
          {error || hint}
        </span>
      )}
    </div>
  )
})
