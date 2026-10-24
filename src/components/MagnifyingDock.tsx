import { useEffect, useRef } from 'react'

const ICONS = ['✈\uFE0E', '☁', '☀', '☾', '✉', '⚙', '♫', '☕', '★']
const FALLOFF = 100 /* px，影响半径 */
const MAX_SCALE = 0.6

/** 放大坞栏（C-18）：按指针距离高斯放大的 dock，rAF 批量直写 transform（Bencho: Magnifying Dock） */
export default function MagnifyingDock() {
  const barRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const bar = barRef.current!
    let raf = 0
    const apply = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = bar.getBoundingClientRect()
        const cx = e.clientX - r.left
        tileRefs.current.forEach(tile => {
          if (!tile) return
          const tr = tile.getBoundingClientRect()
          const d = Math.abs(tr.left + tr.width / 2 - r.left - cx)
          const k = Math.max(0, 1 - (d / FALLOFF) ** 2) /* 简化高斯 */
          const scale = 1 + MAX_SCALE * k
          tile.style.transition = 'none'
          tile.style.transform = `translateY(${-10 * k}px) scale(${scale})`
          tile.classList.toggle('near', k > 0.15)
        })
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      tileRefs.current.forEach(tile => {
        if (!tile) return
        tile.style.transition = 'transform .35s cubic-bezier(.2,.8,.3,1)'
        tile.style.transform = 'translateY(0) scale(1)'
        tile.classList.remove('near')
      })
    }
    bar.addEventListener('pointermove', apply)
    bar.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      bar.removeEventListener('pointermove', apply)
      bar.removeEventListener('pointerleave', reset)
    }
  }, [])

  return (
    <div className="dock-wrap">
      <div className="dock" ref={barRef}>
        {ICONS.map((ic, i) => (
          <div
            key={i}
            className="dock-tile"
            ref={el => {
              tileRefs.current[i] = el
            }}
            style={{ transitionDelay: `${i * 8}ms` }}
          >
            {ic}
          </div>
        ))}
      </div>
      <span className="hint">指针扫过 · 按距离放大，离开回弹</span>
    </div>
  )
}
