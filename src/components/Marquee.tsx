import { useEffect, useRef } from 'react'
import { MQ_ITEMS } from '../lib/data'

const PLANE = '✈\uFE0E'

function Track({ items, rev }: { items: string[]; rev?: boolean }) {
  return (
    <div className={`mq-track${rev ? ' rev' : ''}`}>
      {[0, 1].map(copy => (
        <div key={copy} style={{ display: 'contents' }}>
          {items.map((t, i) => (
            <span key={`${copy}-${i}`} className={`mq-item${i % 2 ? ' dim' : ''}`}>
              {t}
              <i>{PLANE}</i>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/** 跑马灯：双行反向无缝循环，滚出视口自动暂停（组件 C-02 本体） */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        el.querySelectorAll<HTMLElement>('.mq-track').forEach(t => {
          t.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused'
        })
      },
      { rootMargin: '60px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="mq" ref={ref} aria-label="无限滚动跑马灯">
      <Track items={MQ_ITEMS} />
      <Track items={[...MQ_ITEMS].reverse()} rev />
    </div>
  )
}
