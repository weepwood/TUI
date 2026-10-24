import { useEffect, useRef } from 'react'

/** 聚光卡片（C-28）：边框光晕跟随指针（Magic UI Spotlight 风格），ref 直写零重渲染 */
export default function SpotlightCard() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--gx', `${e.clientX - r.left}px`)
        el.style.setProperty('--gy', `${e.clientY - r.top}px`)
      })
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="spot-wrap">
      <div className="spot" ref={ref}>
        <div className="spot-inner">
          <div className="spot-hd">
            <span className="od-label">Gate 24 · Now Boarding</span>
            <span className="chip boarding">BOARDING</span>
          </div>
          <div className="spot-route cond">
            PEK <i>✈&#xFE0E;</i> LAX
          </div>
          <div className="spot-rows mono">
            <span>FLIGHT TR-2026</span>
            <span>DEPART 09:45</span>
            <span>SEAT 06A</span>
            <span>ZONE A</span>
          </div>
        </div>
      </div>
      <span className="hint">移动指针 · 边框光晕跟随</span>
    </div>
  )
}
