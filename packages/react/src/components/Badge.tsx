import { forwardRef, type HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'danger'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', className = '', ...props },
  ref,
) {
  return <span {...props} ref={ref} className={['tui-badge', 'tui-badge--' + tone, className].filter(Boolean).join(' ')} />
})
