import { useEffect, useRef, useState } from 'react'

export interface CountUpProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  label?: string
  className?: string
}

/** Animate value changes only; initial SSR and hydration show the same final number. */
export function CountUp({ value, duration = 850, decimals = 0, prefix = '', suffix = '', label, className = '' }: CountUpProps) {
  const target = Number.isFinite(value) ? value : 0
  const places = Number.isFinite(decimals) ? Math.max(0, Math.min(5, Math.floor(decimals))) : 0
  const speed = Number.isFinite(duration) ? Math.max(0, Math.min(5000, duration)) : 850
  const [display, setDisplay] = useState(target)
  const lastValue = useRef(target)
  const displayRef = useRef(target)
  displayRef.current = display
  useEffect(() => {
    if (target === lastValue.current) return
    lastValue.current = target
    const reduce = typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (speed === 0 || reduce) { displayRef.current = target; setDisplay(target); return }
    let raf = 0
    let start: number | null = null
    const from = displayRef.current
    const tick = (now: number) => {
      if (start === null) start = now
      const x = Math.min(1, (now - start) / speed)
      const eased = 1 - Math.pow(1 - x, 3)
      const next = from + (target - from) * eased
      displayRef.current = next
      setDisplay(next)
      if (x < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, speed])
  const formatted = display.toLocaleString(undefined, { minimumFractionDigits: places, maximumFractionDigits: places })
  return <span className={['tui-count', className].filter(Boolean).join(' ')} aria-label={label ? label + ': ' + prefix + target + suffix : undefined}>
    <span aria-hidden={label ? 'true' : undefined}>{prefix}{formatted}{suffix}</span>
  </span>
}
