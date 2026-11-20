import { useEffect, useRef, useState } from 'react'

export default function TooltipPopover() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const anchor = useRef<HTMLDivElement>(null)

  /* 点击外部或按 Escape 关闭浮层，避免浮层滞留 */
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!anchor.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="ui-showcase ui-overlay-demo">
      <div className="ui-overlay-group">
        <span className="ui-overlay-caption">TOOLTIPS</span>
        <button className="ui-icon-button" aria-label="Help with sharing" aria-describedby="share-tooltip">i<span className="ui-tooltip" role="tooltip" id="share-tooltip">Invite teammates to collaborate</span></button>
        <button className="ui-button ui-button-outline ui-tooltip-button" aria-describedby="shortcut-tooltip">Keyboard shortcuts <span className="ui-keycap">⌘ K</span><span className="ui-tooltip ui-tooltip-wide" role="tooltip" id="shortcut-tooltip">Open search from anywhere in the workspace</span></button>
      </div>
      <div className="ui-overlay-group ui-popover-stage">
        <span className="ui-overlay-caption">POPOVER</span>
        <div className="ui-popover-anchor" ref={anchor}>
          <button className="ui-button ui-button-secondary" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(value => !value)}>Share project <span className="ui-chevron">⌄</span></button>
          {open && <div className="ui-share-popover" role="dialog" aria-label="Share project">
            <div className="ui-share-popover-head"><span className="ui-share-symbol">↗</span><div><strong>Share workspace</strong><small>Invite your team to this project</small></div><button aria-label="Close share popover" onClick={() => setOpen(false)}>×</button></div>
            <div className="ui-share-link"><span>workspace.design/acme</span><button onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1600) }}>{copied ? 'Copied ✓' : 'Copy link'}</button></div>
            <div className="ui-share-people"><span className="ui-avatar ui-avatar-rose">OR</span><span className="ui-avatar ui-avatar-blue">PB</span><span className="ui-avatar ui-avatar-green">DW</span><span>3 people have access</span></div>
          </div>}
        </div>
      </div>
      <div className="ui-overlay-hint">Tooltips reveal on hover or keyboard focus · Popovers hold actions and useful context</div>
    </div>
  )
}
