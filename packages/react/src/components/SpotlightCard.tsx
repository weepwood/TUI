import { forwardRef, type CSSProperties, type HTMLAttributes, type PointerEvent } from 'react'

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Glow diameter in pixels */
  glowSize?: number
}

export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(function SpotlightCard(
  { glowSize = 260, onPointerMove, className = '', style, children, ...props }, ref,
) {
  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tui-glow-x', event.clientX - box.left + 'px')
    event.currentTarget.style.setProperty('--tui-glow-y', event.clientY - box.top + 'px')
    onPointerMove?.(event)
  }
  return (
    <div
      {...props}
      ref={ref}
      className={['tui-spotlight', className].filter(Boolean).join(' ')}
      style={{ ...style, '--tui-glow-size': (Number.isFinite(glowSize) ? Math.max(0, glowSize) : 260) + 'px' } as CSSProperties}
      onPointerMove={handleMove}
    >
      <div className="tui-spotlight__content">{children}</div>
    </div>
  )
})
