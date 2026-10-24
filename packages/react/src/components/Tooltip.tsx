import { useId, useState } from 'react'

export interface TooltipProps {
  label: string
  content: string
  placement?: 'top' | 'bottom'
  disabled?: boolean
  className?: string
}

/** Keyboard-and-pointer trigger; does not use global event listeners. */
export function Tooltip({ label, content, placement = 'top', disabled = false, className = '' }: TooltipProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return (
    <span className={['tui-tooltip', 'tui-tooltip--' + placement, className].filter(Boolean).join(' ')}>
      <button type="button" disabled={disabled} className="tui-tooltip__trigger"
        aria-describedby={!disabled ? id : undefined}
        onPointerEnter={() => setVisible(true)}
        onPointerLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onKeyDown={event => { if (event.key === 'Escape') setVisible(false) }}
      >{label}</button>
      {!disabled && <span id={id} role="tooltip" className={visible ? 'tui-tooltip__bubble is-open' : 'tui-tooltip__bubble'}>{content}</span>}
    </span>
  )
}
