import { useEffect, useId, useRef, type ReactNode } from 'react'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  closeLabel?: string
  className?: string
}
const focusable = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** A focused modal with Escape, focus containment, restore focus and backdrop dismissal. */
export function Dialog({ open, onOpenChange, title, description, children, footer, closeLabel = '关闭', className = '' }: DialogProps) {
  const id = useId()
  const panel = useRef<HTMLDivElement>(null)
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const body = document.body
    const oldOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const element = panel.current
    const first = element?.querySelector<HTMLElement>(focusable)
    ;(first ?? element)?.focus()
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChangeRef.current(false)
        return
      }
      if (event.key !== 'Tab' || !panel.current) return
      const targets = Array.from(panel.current.querySelectorAll<HTMLElement>(focusable))
      if (!targets.length) { event.preventDefault(); panel.current.focus(); return }
      const firstItem = targets[0]
      const lastItem = targets[targets.length - 1]
      if (event.shiftKey && (document.activeElement === firstItem || !panel.current.contains(document.activeElement))) {
        event.preventDefault(); lastItem.focus()
      } else if (!event.shiftKey && (document.activeElement === lastItem || !panel.current.contains(document.activeElement))) {
        event.preventDefault(); firstItem.focus()
      }
    }
    document.addEventListener('keydown', keyDown)
    return () => {
      document.removeEventListener('keydown', keyDown)
      body.style.overflow = oldOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="tui-dialog__overlay" onPointerDown={event => { if (event.target === event.currentTarget) onOpenChange(false) }}>
      <div className={['tui-dialog', className].filter(Boolean).join(' ')} ref={panel}
        role="dialog" aria-modal="true" aria-labelledby={id + '-title'}
        aria-describedby={description ? id + '-description' : undefined} tabIndex={-1}>
        <header className="tui-dialog__header">
          <div><h2 id={id + '-title'}>{title}</h2>{description && <p id={id + '-description'}>{description}</p>}</div>
          <button type="button" className="tui-dialog__close" aria-label={closeLabel} onClick={() => onOpenChange(false)}>×</button>
        </header>
        <div className="tui-dialog__body">{children}</div>
        {footer && <footer className="tui-dialog__footer">{footer}</footer>}
      </div>
    </div>
  )
}
