import { useState } from 'react'
import { useToast } from '../state/app'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const N_ROWS = 5
const MAX_PICK = 3
const PREMIUM_ROW = 1
/* 固定的占用座位，保证每次渲染布局一致 */
const OCCUPIED = new Set(['1B', '1E', '2C', '3F', '4A', '4G', '5D'])

/** 座位图（C-10）：选座 / 占用 / 尊享排，最多选 3 个 */
export default function SeatMap() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['2E']))
  const { toast } = useToast()

  const toggle = (id: string) => {
    if (OCCUPIED.has(id)) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= MAX_PICK) {
          toast(`一趟航班最多选 ${MAX_PICK} 个座位`)
          return prev
        }
        next.add(id)
      }
      return next
    })
  }

  return (
    <>
      <span className="od-label">Flight TR-113 · 请选择座位（最多 {MAX_PICK} 座）</span>
      <div className="seatmap" role="grid" aria-label="座位图">
        {Array.from({ length: N_ROWS }, (_, r) => (
          <div key={r} className="seatmap-row" role="row">
            <span className="seat-no">{r + 1}</span>
            {COLS.map((c, ci) => (
              <div key={c} style={{ display: 'contents' }}>
                {ci === 3 && <span className="seat-aisle" aria-hidden="true" />}
                <button
                  className={[
                    'seat',
                    OCCUPIED.has(`${r + 1}${c}`) ? 'occ' : '',
                    r + 1 === PREMIUM_ROW ? 'prem' : '',
                    selected.has(`${r + 1}${c}`) ? 'sel' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="gridcell"
                  aria-label={`${r + 1}${c}${OCCUPIED.has(`${r + 1}${c}`) ? ' 已占用' : selected.has(`${r + 1}${c}`) ? ' 已选择' : ' 可选'}`}
                  onClick={() => toggle(`${r + 1}${c}`)}
                >
                  {c}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="seat-bar">
        <div className="seat-legend">
          <span><i className="lg avail" />可选</span>
          <span><i className="lg sel" />已选</span>
          <span><i className="lg occ" />占用</span>
          <span><i className="lg prem" />尊享</span>
        </div>
        <span className="seat-picked mono">
          {selected.size === 0 ? '未选择' : [...selected].sort().join(' · ')}
        </span>
        <button className="preset" onClick={() => setSelected(new Set())}>
          清空
        </button>
      </div>
    </>
  )
}
