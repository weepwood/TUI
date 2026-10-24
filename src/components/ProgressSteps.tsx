import { useState } from 'react'

const STEPS = [
  { label: '值机', en: 'CHECK-IN' },
  { label: '安检', en: 'SECURITY' },
  { label: '登机', en: 'BOARDING' },
  { label: '起飞', en: 'DEPARTED' },
]

/** 登机步骤条（C-21）：连接线按进度注液，完成步打勾、当前步脉冲 */
export default function ProgressSteps() {
  const [cur, setCur] = useState(1) /* 已完成 cur 步，正在第 cur+1 步 */

  return (
    <div className="ps">
      <div className="ps-track">
        {STEPS.map((s, i) => {
          const done = i < cur
          const active = i === cur
          return (
            <div key={s.en} className="ps-step">
              <div className="ps-node-wrap">
                {i > 0 && <i className={`ps-line${done ? ' on' : ''}`} style={{ transitionDelay: `${i * 60}ms` }} />}
                <button
                  className={`ps-node${done ? ' done' : ''}${active ? ' active' : ''}`}
                  onClick={() => setCur(i)}
                  aria-label={`步骤 ${i + 1} ${s.label}${done ? '（已完成）' : ''}`}
                >
                  {done ? '✓' : i + 1}
                </button>
              </div>
              <div className="ps-label">
                <b>{s.label}</b>
                <span>{s.en}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="ps-bar">
        <button className="preset" onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0}>
          ← 上一步
        </button>
        <span className="ps-count mono">
          {cur}/{STEPS.length} 完成
        </span>
        <button className="preset" onClick={() => setCur(c => Math.min(STEPS.length, c + 1))} disabled={cur === STEPS.length}>
          下一步 →
        </button>
      </div>
    </div>
  )
}
