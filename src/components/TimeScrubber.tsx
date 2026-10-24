import { useRef, useState } from 'react'

const PHASES = [
  { id: 'TAXI', label: '滑行 TAXI', from: 0, to: 12 },
  { id: 'CLIMB', label: '爬升 CLIMB', from: 12, to: 32 },
  { id: 'CRUISE', label: '巡航 CRUISE', from: 32, to: 74 },
  { id: 'DESCENT', label: '下降 DESCENT', from: 74, to: 100 },
]
const TOTAL_MIN = 690 /* PEK→LAX 11h30m */

const fmt = (min: number) => {
  const h = Math.floor(min / 60)
  const m = Math.floor(min % 60)
  return `T+${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** 起飞时间轴（C-30，Bencho Time Scrubber 风格）：拖拽飞机指针，换算飞行时长并高亮航段 */
export default function TimeScrubber() {
  const [pct, setPct] = useState(38)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef(false)

  const fromX = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect()
    setPct(Math.round(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))))
  }

  const phase = PHASES.find(p => pct >= p.from && pct < p.to) ?? PHASES[PHASES.length - 1]

  const byKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setPct(p => Math.min(100, p + 2))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setPct(p => Math.max(0, p - 2))
    }
  }

  return (
    <div className="tsb">
      <div className="tsb-hd">
        <span className="od-label">PEK ✈&#xFE0E; LAX · 全程 11h30m</span>
        <span className="tsb-time mono">{fmt((pct / 100) * TOTAL_MIN)}</span>
      </div>
      <div
        className="tsb-track"
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="飞行进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        onKeyDown={byKey}
        onPointerDown={e => {
          e.preventDefault()
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            /* 合成事件无活动指针 */
          }
          drag.current = true
          fromX(e.clientX)
        }}
        onPointerMove={e => drag.current && fromX(e.clientX)}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        {PHASES.map(p => (
          <span
            key={p.id}
            className={`tsb-phase${phase.id === p.id ? ' on' : ''}`}
            style={{ left: `${p.from}%`, width: `${p.to - p.from}%` }}
          >
            {p.label}
          </span>
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className="tsb-tick" style={{ left: `${(i + 1) * 10}%` }} />
        ))}
        <div className="tsb-fill" style={{ width: `${pct}%` }} />
        <div className="tsb-head" style={{ left: `${pct}%` }}>
          ✈&#xFE0E;
        </div>
      </div>
      <span className="hint">拖拽飞机指针 · 点击跳转 · 方向键微调</span>
    </div>
  )
}
