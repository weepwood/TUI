import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  lines?: number
  avatar?: boolean
  label?: string
}

export function Skeleton({ lines = 3, avatar = false, label = '内容加载中', className = '', ...props }: SkeletonProps) {
  const count = Number.isFinite(lines) ? Math.max(1, Math.min(8, Math.floor(lines))) : 3
  return (
    <div {...props} className={['tui-skeleton', className].filter(Boolean).join(' ')} role="status" aria-label={label} aria-busy="true">
      {avatar && <span aria-hidden="true" className="tui-skeleton__avatar" />}
      <div aria-hidden="true" className="tui-skeleton__lines">
        {Array.from({ length: count }, (_, index) => <span key={index} className="tui-skeleton__line" style={{ width: (index === count - 1 ? 63 : index % 2 ? 82 : 100) + '%' }} />)}
      </div>
    </div>
  )
}
