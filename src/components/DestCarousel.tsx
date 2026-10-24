import { useEffect, useRef, useState } from 'react'

const DESTS = [
  { code: 'HND', city: 'TOKYO', tag: '樱花与霓虹', cls: 'a' },
  { code: 'CDG', city: 'PARIS', tag: '塞纳河畔', cls: 'b' },
  { code: 'JFK', city: 'NEW YORK', tag: '不眠之城', cls: 'c' },
  { code: 'KEF', city: 'REYKJAVIK', tag: '极光之门', cls: 'd' },
  { code: 'SYD', city: 'SYDNEY', tag: '南半球之夏', cls: 'e' },
]

/** 目的地轮播（C-31）：scroll-snap 吸附 + 指针拖拽 + 按钮翻页 + 圆点指示 */
export default function DestCarousel() {
  const viewRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, startX: 0, startL: 0, moved: false })
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const view = viewRef.current!
    const onScroll = () => {
      const card = view.querySelector('.dc-card') as HTMLElement | null
      if (!card) return
      const w = card.offsetWidth + 14
      setIdx(Math.round(view.scrollLeft / w))
    }
    view.addEventListener('scroll', onScroll, { passive: true })
    return () => view.removeEventListener('scroll', onScroll)
  }, [])

  const page = (dir: 1 | -1) => {
    const view = viewRef.current!
    const card = view.querySelector('.dc-card') as HTMLElement
    view.scrollBy({ left: dir * (card.offsetWidth + 14), behavior: 'smooth' })
  }

  return (
    <div className="dc">
      <div
        className="dc-view"
        ref={viewRef}
        onPointerDown={e => {
          drag.current = { on: true, startX: e.clientX, startL: viewRef.current!.scrollLeft, moved: false }
        }}
        onPointerMove={e => {
          if (!drag.current.on) return
          const dx = e.clientX - drag.current.startX
          if (Math.abs(dx) > 4) drag.current.moved = true
          viewRef.current!.scrollLeft = drag.current.startL - dx
        }}
        onPointerUp={() => (drag.current.on = false)}
        onPointerLeave={() => (drag.current.on = false)}
        onClickCapture={e => {
          /* 拖拽后抑制卡片点击 */
          if (drag.current.moved) {
            e.preventDefault()
            e.stopPropagation()
            drag.current.moved = false
          }
        }}
      >
        {DESTS.map(d => (
          <div key={d.code} className={`dc-card ${d.cls}`}>
            <span className="dc-code mono">{d.code}</span>
            <span className="dc-city cond">{d.city}</span>
            <span className="dc-tag">{d.tag}</span>
          </div>
        ))}
      </div>
      <div className="dc-bar">
        <button className="preset" onClick={() => page(-1)} aria-label="上一页">
          ←
        </button>
        <div className="dc-dots" aria-hidden="true">
          {DESTS.map((d, i) => (
            <i key={d.code} className={i === idx ? ' on' : ''} />
          ))}
        </div>
        <button className="preset" onClick={() => page(1)} aria-label="下一页">
          →
        </button>
      </div>
    </div>
  )
}
