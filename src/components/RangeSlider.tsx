import { useRef, useState } from 'react'

const MIN = 0
const MAX = 100

/** 滑杆（C-20）：自定义轨道 + 琥珀填充 + 数值气泡，指针拖拽与键盘均可操作 */
export default function RangeSlider() {
  const [value, setValue] = useState(36)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const pct = ((value - MIN) / (MAX - MIN)) * 100

  const fromClientX = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect()
    const k = Math.max(0, Math.min(1, (clientX - r.left) / r.width))
    setValue(Math.round(MIN + k * (MAX - MIN)))
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
    fromClientX(e.clientX)
    /* 合成事件没有活动指针 id，捕获失败不影响取值 */
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) fromClientX(e.clientX)
  }
  const stop = () => setDragging(false)

  const byKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setValue(v => Math.min(MAX, v + 2))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setValue(v => Math.max(MIN, v - 2))
    } else if (e.key === 'Home') {
      setValue(MIN)
    } else if (e.key === 'End') {
      setValue(MAX)
    }
  }

  return (
    <div className="rs">
      <div className="rs-hd">
        <span className="od-label">Cabin Pressure · 客舱增压</span>
        <span className="rs-val mono">{value}%</span>
      </div>
      <div
        className={`rs-track${dragging ? ' drag' : ''}`}
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="客舱增压"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={byKey}
      >
        {Array.from({ length: 11 }, (_, i) => (
          <i key={i} className={`rs-tick${value >= i * 10 ? ' on' : ''}`} style={{ left: `${i * 10}%` }} />
        ))}
        <div className="rs-fill" style={{ width: `${pct}%` }} />
        <div className="rs-thumb" style={{ left: `${pct}%` }}>
          <span className={`rs-bubble mono${dragging ? ' show' : ''}`}>{value}</span>
        </div>
      </div>
      <span className="hint">拖动圆点 · 方向键微调 · HOME/END 到两端</span>
    </div>
  )
}
