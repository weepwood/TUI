import { useEffect, useRef, useState } from 'react'

export default function DialogShowcase() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      } else if (event.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll<HTMLElement>('.ui-dialog button:not([disabled])'))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus()
    wasOpen.current = open
  }, [open])

  return (
    <div className="ui-showcase ui-dialog-demo">
      <div className="ui-dialog-preview">
        <div className="ui-dialog-icon">✦</div>
        <div><strong>Confirm before you continue</strong><p>Use a dialog for decisions that need a clear response.</p></div>
        <button ref={triggerRef} className="ui-button ui-button-primary" onClick={() => setOpen(true)}>Open dialog</button>
      </div>
      {open && <div className="ui-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
        <section className="ui-dialog" role="dialog" aria-modal="true" aria-labelledby="ui-dialog-title" aria-describedby="ui-dialog-description">
          <button ref={closeRef} className="ui-dialog-x" onClick={() => setOpen(false)} aria-label="Close dialog">×</button>
          <div className="ui-dialog-icon">✦</div>
          <h3 id="ui-dialog-title">Publish your changes?</h3>
          <p id="ui-dialog-description">Your updates will be visible to everyone in your workspace. You can always make changes later.</p>
          <div className="ui-dialog-actions"><button className="ui-button ui-button-outline" onClick={() => setOpen(false)}>Cancel</button><button className="ui-button ui-button-primary" onClick={() => setOpen(false)}>Publish changes</button></div>
        </section>
      </div>}
    </div>
  )
}
