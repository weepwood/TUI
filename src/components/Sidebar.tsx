import { useEffect, useState } from 'react'
import { COMPONENTS, GROUPS, type Status } from '../lib/data'
import { useToast } from '../state/app'

interface Props {
  activeId: string
  onNavigate: (id: string) => void
  onOpenOverview: () => void
  overview: boolean
}

const dotCls = (st: Status) => (st === 'BOARDING' ? 'st-boarding pulse' : st === 'ON TIME' ? 'st-ontime' : 'st-delayed')

/* 模块级常量：目录本身不变，避免每次渲染（含 4.6s 状态点闪烁）重建 Map 与数组 */
const byId = new Map(COMPONENTS.map(c => [c.id, c]))
const teasers = COMPONENTS.filter(c => !c.id)

/** 左侧目录：总览/聚焦切换 + 分组导航 + 状态点（点会偶尔闪换，保持"活着"） */
export default function Sidebar({ activeId, onNavigate, onOpenOverview, overview }: Props) {
  const { toast } = useToast()
  const [flick, setFlick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      if (!document.hidden) setFlick(f => (f + 1) % 10)
    }, 4600)
    return () => clearInterval(t)
  }, [])

  return (
    <aside className="sidebar" aria-label="组件目录">
      <div className="sb-hd">
        组件目录 <span>INDEX</span>
      </div>
      <nav className="sb-nav">
        <button
          className={`sb-item${overview ? ' active' : ''}`}
          onClick={onOpenOverview}
          title="并排显示全部组件"
        >
          <span className="sb-code">▤▤</span>
          <span className="sb-name">总览全部组件</span>
          <i className="sb-dot st-boarding" />
        </button>
        {GROUPS.map(g => (
          <div key={g.label} style={{ display: 'contents' }}>
            <div className="sb-group">{g.label}</div>
            {g.ids.map(id => {
              const c = byId.get(id)!
              const idx = COMPONENTS.indexOf(c)
              const st = flick === idx && c.st !== 'DELAYED' ? (c.st === 'BOARDING' ? 'ON TIME' : 'BOARDING') : c.st
              return (
                <button
                  key={id}
                  className={`sb-item${activeId === id ? ' active' : ''}`}
                  onClick={() => onNavigate(id)}
                  title={c.en}
                >
                  <span className="sb-code">C-{String(idx).padStart(2, '0')}</span>
                  <span className="sb-name">{c.cn}</span>
                  <i className={`sb-dot ${dotCls(st)}`} />
                </button>
              )
            })}
          </div>
        ))}
        <div className="sb-group">排队 · QUEUE</div>
        {teasers.map(c => (
          <button
            key={c.no}
            className="sb-item disabled"
            title="即将推出"
            onClick={() => toast(`${c.cn} · ${c.en} 还在塔台排队，敬请期待`)}
          >
            <span className="sb-code">--</span>
            <span className="sb-name">{c.cn}</span>
            <i className="sb-dot st-delayed" />
          </button>
        ))}
      </nav>
      <div className="sb-ft">
        <div>
          <kbd>⌘K</kbd> 指令面板
        </div>
        <div>
          状态：<span style={{ color: 'var(--ok)' }}>●</span> 登机中 · <span style={{ color: 'var(--amber)' }}>●</span> 准点
        </div>
      </div>
    </aside>
  )
}
