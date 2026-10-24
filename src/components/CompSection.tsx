import type { ReactNode } from 'react'
import { useReveal } from '../lib/hooks'
import type { Status } from '../lib/data'

interface Props {
  id: string
  tag: string
  title: string
  cn: string
  st: Exclude<Status, 'DELAYED'>
  footer: ReactNode
  className?: string
  demoStyle?: React.CSSProperties
  children: ReactNode
}

/** 组件展示块的统一骨架：编号标签 + 标题 + 状态胶囊 / 演示区 / 说明条 */
export default function CompSection({ id, tag, title, cn, st, footer, className, demoStyle, children }: Props) {
  const ref = useReveal<HTMLElement>()
  return (
    <section className={`comp reveal${className ? ' ' + className : ''}`} id={id} ref={ref}>
      <div className="comp-hd">
        <div>
          <div className="comp-tag">{tag}</div>
          <h2>
            {title} <small>{cn}</small>
          </h2>
        </div>
        <span className={`chip ${st === 'BOARDING' ? 'boarding' : 'ontime'}`}>{st}</span>
      </div>
      <div className="comp-demo" style={demoStyle}>
        {children}
      </div>
      <div className="comp-ft">{footer}</div>
    </section>
  )
}
