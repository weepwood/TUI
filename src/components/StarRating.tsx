import { useState } from 'react'

const LABELS = ['糟糕 ROUGH', '一般 OK', '舒适 COMFY', '尊享 PRIME', '完美 PERFECT']

/** 星级评分（C-26）：悬停预览、点击确认、回弹动画、键盘可达 */
export default function StarRating() {
  const [value, setValue] = useState(4)
  const [hover, setHover] = useState(0)
  const [popKey, setPopKey] = useState(0)
  const shown = hover || value

  const pick = (v: number) => {
    setValue(v)
    setPopKey(k => k + 1)
  }

  const byKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      pick(Math.min(5, value + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      pick(Math.max(1, value - 1))
    }
  }

  return (
    <div className="sr">
      <span className="od-label">Flight Experience · 乘机体验</span>
      <div className="sr-stars" role="radiogroup" aria-label="星级评分" onKeyDown={byKey} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(i => {
          const on = i <= shown
          return (
            <button
              key={i}
              role="radio"
              aria-checked={value === i}
              aria-label={`${i} 星`}
              className={`sr-star${on ? ' on' : ''}${i === shown ? ' lead' : ''}`}
              onMouseEnter={() => setHover(i)}
              onClick={() => pick(i)}
            >
              <svg viewBox="0 0 24 24" className={i === value ? 'pop' : undefined} key={i === value ? `v${popKey}` : undefined}>
                <path d="M12 2.6 15 8.9l6.9.8-5.1 4.7 1.4 6.8L12 17.8l-6.2 3.4 1.4-6.8L2.1 9.7 9 8.9z" />
              </svg>
            </button>
          )
        })}
      </div>
      <span className="sr-label mono">
        {value} 星 · {LABELS[value - 1]}
      </span>
      <span className="hint">悬停预览 · 点击确认 · 方向键调节</span>
    </div>
  )
}
