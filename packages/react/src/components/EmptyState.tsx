import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

/** Generic empty-data surface with a slot for a caller-provided action. */
export function EmptyState({ title, description, icon, action, size = 'md', className = '' }: EmptyStateProps) {
  return (
    <div className={['tui-empty', 'tui-empty--' + size, className].filter(Boolean).join(' ')}>
      <div className="tui-empty__icon" aria-hidden="true">{icon ?? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 13h5l2 2h3l2-2h5"/></svg>}</div>
      <strong className="tui-empty__title">{title}</strong>
      {description && <p className="tui-empty__description">{description}</p>}
      {action && <div className="tui-empty__action">{action}</div>}
    </div>
  )
}
