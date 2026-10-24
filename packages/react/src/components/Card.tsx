import { forwardRef, type HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevated = false, className = '', ...props },
  ref,
) {
  return <div {...props} ref={ref} className={['tui-card', elevated && 'tui-card--elevated', className].filter(Boolean).join(' ')} />
})
