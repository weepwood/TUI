import { useEffect, useRef } from 'react'

const MAX_DEG = 10

/** 倾斜卡片（C-16）：指针跟踪的 3D 倾斜 + 高光跟随，全程 ref 直写不触发渲染（Bencho: Tilt Card） */
export default function TiltCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current!
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width /* 0~1 */
        const py = (e.clientY - r.top) / r.height
        card.style.transition = 'none'
        card.style.transform = `perspective(700px) rotateX(${(0.5 - py) * MAX_DEG * 2}deg) rotateY(${(px - 0.5) * MAX_DEG * 2}deg)`
        /* 高光跟随指针 */
        card.style.setProperty('--gx', `${px * 100}%`)
        card.style.setProperty('--gy', `${py * 100}%`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      card.style.transition = 'transform .45s cubic-bezier(.2,.8,.3,1)'
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)'
    }
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="tc-wrap">
      <div className="tc" ref={cardRef}>
        <div className="tc-main">
          <div className="tc-brand">
            <span className="tc-flap">T</span> TERMINAL AIR
          </div>
          <div className="tc-route">
            <b>PEK</b>
            <span className="tc-dash">✈&#xFE0E;</span>
            <b>LAX</b>
          </div>
          <div className="tc-meta">
            <span>TR-2026</span>
            <span>GATE 24</span>
            <span>SEAT 06A</span>
          </div>
        </div>
        <div className="tc-stub">
          <span className="tc-barcode" />
          <span className="tc-time">09:45</span>
        </div>
      </div>
      <span className="hint">移动指针 · 卡片与高光一起跟随</span>
    </div>
  )
}
