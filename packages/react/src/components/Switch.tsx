import { useId, useState } from 'react'

export interface SwitchProps {
  label: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

/** Accessible two-state control; supports both controlled and local state. */
export function Switch({ label, description, checked, defaultChecked = false, onCheckedChange, disabled = false, className = '' }: SwitchProps) {
  const [local, setLocal] = useState(defaultChecked)
  const active = checked === undefined ? local : checked
  const descriptionId = useId()
  const toggle = () => {
    if (disabled) return
    if (checked === undefined) setLocal(!active)
    onCheckedChange?.(!active)
  }
  return (
    <div className={['tui-switch', disabled && 'is-disabled', className].filter(Boolean).join(' ')}>
      <span className="tui-switch__copy">
        <span className="tui-switch__label" id={descriptionId + '-label'}>{label}</span>
        {description && <span className="tui-switch__description" id={descriptionId + '-description'}>{description}</span>}
      </span>
      <button
        className="tui-switch__control"
        type="button"
        role="switch"
        aria-checked={active}
        aria-labelledby={descriptionId + '-label'}
        aria-describedby={description ? descriptionId + '-description' : undefined}
        disabled={disabled}
        onClick={toggle}
      ><span className="tui-switch__thumb" aria-hidden="true" /></button>
    </div>
  )
}
