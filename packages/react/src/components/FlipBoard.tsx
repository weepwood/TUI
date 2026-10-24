import { useEffect, useRef, useState, type CSSProperties } from 'react'

export interface FlipBoardProps {
  /** Arbitrary display text; newline also creates new rows. */
  value: string | readonly string[]
  /** Pad/truncate each row; 1–32 cells (defaults to widest row). */
  columns?: number
  align?: 'left' | 'center' | 'right'
  /** Total animation time per character, in milliseconds. Set 0 to disable. */
  duration?: number
  /** Per-column delay, in milliseconds. */
  stagger?: number
  /** Screen-reader label, followed by current display text. */
  label?: string
  className?: string
}

interface CellProps {
  char: string
  duration: number
  delay: number
}

function FlipCell({ char, duration, delay }: CellProps) {
  const [shown, setShown] = useState(char)
  const [phase, setPhase] = useState<{ from: string, to: string, seq: number } | null>(null)
  const sequence = useRef(0)
  const animationTarget = useRef(char)

  useEffect(() => {
    if (char === animationTarget.current) return
    const old = animationTarget.current
    animationTarget.current = char
    const prefersLessMotion = typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (duration === 0 || prefersLessMotion) {
      setShown(char)
      setPhase(null)
      return
    }
    setPhase({ from: old, to: char, seq: ++sequence.current })
    const handle = setTimeout(() => {
      setShown(char)
      setPhase(null)
    }, duration + delay)
    return () => clearTimeout(handle)
  }, [char, duration, delay])

  const from = phase?.from ?? shown
  const to = phase?.to ?? shown
  const motionStyle = {
    '--tui-flip-duration': duration + 'ms',
    '--tui-flip-delay': delay + 'ms',
  } as CSSProperties
  return (
    <span className="tui-flip__cell" style={motionStyle} aria-hidden="true">
      <span className="tui-flip__half tui-flip__half--top"><span>{to === ' ' ? '\u00a0' : to}</span></span>
      <span className="tui-flip__half tui-flip__half--bottom"><span>{from === ' ' ? '\u00a0' : from}</span></span>
      {phase && (
        <span key={phase.seq} className="tui-flip__animation">
          <span className="tui-flip__half tui-flip__leaf--top"><span>{from === ' ' ? '\u00a0' : from}</span></span>
          <span className="tui-flip__half tui-flip__leaf--bottom"><span>{to === ' ' ? '\u00a0' : to}</span></span>
        </span>
      )}
    </span>
  )
}

/** Pure formatting shared by SSR, gallery examples and tests. */
export function formatFlipRows(value: string | readonly string[], columns?: number, align: FlipBoardProps['align'] = 'left') {
  const lines = (typeof value === 'string' ? value.split(/\r?\n/) : [...value]).slice(0, 12).map(v => String(v ?? ''))
  const width = columns === undefined
    ? Math.min(32, Math.max(1, ...lines.map(line => Array.from(line).length)))
    : Number.isFinite(columns) ? Math.min(32, Math.max(1, Math.floor(columns))) : 8
  return lines.map(line => {
    const glyphs = Array.from(line).slice(0, width)
    const deficit = width - glyphs.length
    const lead = align === 'right' ? deficit : align === 'center' ? Math.floor(deficit / 2) : 0
    return [...Array(lead).fill(' '), ...glyphs, ...Array(deficit - lead).fill(' ')] as string[]
  })
}

export function FlipBoard({
  value, columns, align = 'left', duration = 500, stagger = 28, label, className = '',
}: FlipBoardProps) {
  const timing = Number.isFinite(duration) ? Math.max(0, Math.min(2000, duration)) : 500
  const spacing = Number.isFinite(stagger) ? Math.max(0, Math.min(200, stagger)) : 28
  const rows = formatFlipRows(value, columns, align)
  const text = typeof value === 'string' ? value : value.join(' / ')
  return (
    <div className={['tui-flip', className].filter(Boolean).join(' ')} role="img" aria-label={label ? label + ': ' + text : text}>
      {rows.map((row, r) => (
        <div className="tui-flip__row" key={r}>
          {row.map((char, c) => <FlipCell key={c} char={char} duration={timing} delay={spacing * c} />)}
        </div>
      ))}
    </div>
  )
}
