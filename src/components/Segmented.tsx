import { useState } from 'react'
import { useToast } from '../state/app'

const OPTIONS = [
  { ms: 4200, label: '慢速 SLOW' },
  { ms: 2600, label: '标准 STD' },
  { ms: 1500, label: '极速 FAST' },
]

/** 分段控制：滑动指示器 + 真的连着顶部翻牌大屏（组件 C-05 本体） */
export default function Segmented() {
  const [idx, setIdx] = useState(0)
  const { toast } = useToast()

  const select = (i: number) => {
    setIdx(i)
    window.dispatchEvent(new CustomEvent('terminal:speed', { detail: OPTIONS[i].ms }))
    toast(`翻牌速度 → ${OPTIONS[i].label}`)
  }

  return (
    <div className="seg-wrap">
      <span className="od-label">Flip Speed · 顶部大屏翻牌速度</span>
      <div className="seg" role="tablist" aria-label="翻牌速度">
        <div className="seg-ind" style={{ transform: `translateX(${idx * 100}%)` }} />
        {OPTIONS.map((o, i) => (
          <button
            key={o.ms}
            className={i === idx ? 'on' : ''}
            role="tab"
            aria-selected={i === idx}
            onClick={() => select(i)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <span className="seg-ms">
        INTERVAL = <b>{OPTIONS[idx].ms}</b> MS
      </span>
    </div>
  )
}
