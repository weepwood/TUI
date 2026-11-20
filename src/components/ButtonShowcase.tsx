import { useState } from 'react'

const variants = ['Primary', 'Secondary', 'Outline', 'Ghost', 'Destructive'] as const

export default function ButtonShowcase() {
  const [busy, setBusy] = useState(false)
  const [pressed, setPressed] = useState(false)

  const save = () => {
    if (busy) return
    setBusy(true)
    window.setTimeout(() => setBusy(false), 1200)
  }

  return (
    <div className="ui-showcase ui-buttons">
      <div className="ui-button-grid">
        {variants.map((variant, index) => (
          <button
            key={variant}
            className={`ui-button ui-button-${variant.toLowerCase()}`}
            onClick={() => index === 0 ? save() : setPressed(value => !value)}
          >
            {index === 0 && busy ? <><span className="ui-spinner" /> Saving…</> : variant}
          </button>
        ))}
      </div>
      <div className="ui-button-grid ui-button-sizes">
        <button className="ui-button ui-button-primary ui-size-sm">Small</button>
        <button className="ui-button ui-button-primary">Default</button>
        <button className="ui-button ui-button-primary ui-size-lg">Large action</button>
        <button className="ui-button ui-button-outline" aria-pressed={pressed} onClick={() => setPressed(value => !value)}>
          {pressed ? '✓ Selected' : '♡ Save item'}
        </button>
      </div>
      <div className="ui-showcase-note">Click the primary action to preview a loading state. Buttons include hover, focus, pressed, and disabled-ready styles.</div>
    </div>
  )
}
