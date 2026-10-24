import type { CSSProperties } from 'react'

export interface MarqueeProps {
  items: readonly string[]
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  label: string
  className?: string
}

export function Marquee({ items, duration = 24, reverse = false, pauseOnHover = true, label, className = '' }: MarqueeProps) {
  const seconds = Number.isFinite(duration) ? Math.max(3, duration) : 24
  return (
    <div className={['tui-marquee', reverse && 'tui-marquee--reverse', pauseOnHover && 'tui-marquee--pause', className].filter(Boolean).join(' ')} role="region" aria-label={label}>
      <div className="tui-marquee__track" style={{ '--tui-marquee-duration': seconds + 's' } as CSSProperties}>
        <div className="tui-marquee__group">{items.map((item, index) => <span key={index} className="tui-marquee__item">{item}</span>)}</div>
        <div className="tui-marquee__group" aria-hidden="true">{items.map((item, index) => <span key={index} className="tui-marquee__item">{item}</span>)}</div>
      </div>
    </div>
  )
}
