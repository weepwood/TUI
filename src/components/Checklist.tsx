import { useState } from 'react'
import { useToast } from '../state/app'

const ITEMS = [
  { key: 'passport', label: '护照 Passport' },
  { key: 'visa', label: '签证 Visa' },
  { key: 'power', label: '充电宝 Power Bank' },
  { key: 'pillow', label: '颈枕 Neck Pillow' },
  { key: 'loyalty', label: '常旅客卡 Loyalty Card' },
]

/** 登机清单（C-27）：描画对勾 + 划除动画 + 进度条，全部完成庆祝 */
export default function Checklist() {
  const [done, setDone] = useState<Set<string>>(() => new Set(['passport', 'power']))
  const { toast } = useToast()

  const toggle = (key: string) => {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
        if (next.size === ITEMS.length) toast('ALL SET · 万事俱备，起飞！', 'ok')
      }
      return next
    })
  }

  const all = done.size === ITEMS.length

  return (
    <div className="ck">
      <div className="ck-list">
        {ITEMS.map(it => {
          const on = done.has(it.key)
          return (
            <button key={it.key} className={`ck-item${on ? ' done' : ''}`} onClick={() => toggle(it.key)} aria-pressed={on}>
              <span className="ck-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path className="ck-tick" d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="ck-label">{it.label}</span>
            </button>
          )
        })}
      </div>
      <div className="ck-foot">
        <div className="ck-bar" aria-hidden="true">
          <i style={{ width: `${(done.size / ITEMS.length) * 100}%` }} className={all ? ' full' : ''} />
        </div>
        <span className={`ck-count mono${all ? ' ok' : ''}`}>
          {done.size}/{ITEMS.length} {all ? 'READY' : 'PACKING'}
        </span>
      </div>
    </div>
  )
}
