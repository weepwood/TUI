import { useCallback, useEffect, useRef, useState } from 'react'
import { REDUCED } from '../lib/scroll'

const DETENTS = [
  { h: 72, label: '收起 COLLAPSED' },
  { h: 168, label: '半开 HALF' },
  { h: 268, label: '全开 OPEN' },
]
const ROWS = [
  ['TR-113', 'SEAT MAP', 'READY'],
  ['TR-114', 'AIRPORT LOOKUP', 'READY'],
  ['TR-115', 'DETENT DRAWER', 'LIVE'],
  ['TR-116', 'ROTARY KNOB', 'READY'],
  ['TR-117', 'SKELETON', 'READY'],
]

/** 阻尼抽屉（C-12）：三个卡点，拖拽带橡皮筋越界、释放按速度吸附（原 TR-111 预告组件正式登机） */
export default function DetentDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null)
  const st = useRef({
    h: DETENTS[0].h,
    dragging: false,
    startY: 0,
    startH: 0,
    lastY: 0,
    lastT: 0,
    v: 0,
    raf: 0,
    from: 0,
    to: 0,
    t0: 0,
    dur: 0,
  })
  const [idx, setIdx] = useState(0)

  const nearestIdx = (h: number) =>
    DETENTS.reduce((best, d, i) => (Math.abs(d.h - h) < Math.abs(DETENTS[best].h - h) ? i : best), 0)

  const apply = (h: number) => {
    st.current.h = h
    if (drawerRef.current) drawerRef.current.style.height = `${h}px`
  }

  const animateTo = useCallback((target: number, targetIdx?: number) => {
    const s = st.current
    cancelAnimationFrame(s.raf)
    setIdx(targetIdx ?? nearestIdx(target))
    if (REDUCED) {
      apply(target)
      return
    }
    s.from = s.h
    s.to = target
    s.t0 = performance.now()
    s.dur = Math.max(180, Math.min(420, Math.abs(target - s.h) * 3))
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (now: number) => {
      const k = Math.min(1, (now - s.t0) / s.dur)
      apply(s.from + (s.to - s.from) * ease(k))
      if (k < 1) s.raf = requestAnimationFrame(step)
    }
    s.raf = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    const s = st.current
    const drawer = drawerRef.current!
    const MIN = DETENTS[0].h
    const MAX = DETENTS[DETENTS.length - 1].h

    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      cancelAnimationFrame(s.raf)
      s.dragging = true
      s.startY = e.clientY
      s.startH = s.h
      s.lastY = e.clientY
      s.lastT = performance.now()
      s.v = 0
      drawer.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const now = performance.now()
      const dt = now - s.lastT
      if (dt > 0) {
        s.v = (s.lastY - e.clientY) / dt
        s.lastY = e.clientY
        s.lastT = now
      }
      let h = s.startH + (s.startY - e.clientY)
      if (h > MAX) h = MAX + (h - MAX) * 0.3 /* 橡皮筋越界 */
      if (h < MIN) h = MIN + (h - MIN) * 0.3
      apply(h)
      setIdx(nearestIdx(h))
    }
    const onUp = () => {
      if (!s.dragging) return
      s.dragging = false
      const near = nearestIdx(s.h)
      /* 速度够快时按方向吸附到下一个卡点 */
      if (Math.abs(s.v) > 0.45) {
        const dir = s.v > 0 ? 1 : -1
        const next = Math.max(0, Math.min(DETENTS.length - 1, near + dir))
        animateTo(DETENTS[next].h, next)
      } else {
        animateTo(DETENTS[near].h, near)
      }
    }
    drawer.addEventListener('pointerdown', onDown)
    drawer.addEventListener('pointermove', onMove)
    drawer.addEventListener('pointerup', onUp)
    drawer.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(s.raf)
      drawer.removeEventListener('pointerdown', onDown)
      drawer.removeEventListener('pointermove', onMove)
      drawer.removeEventListener('pointerup', onUp)
      drawer.removeEventListener('pointercancel', onUp)
    }
  }, [animateTo])

  return (
    <div className="dd">
      <div className="dd-frame">
        <div className="dd-bg" aria-hidden="true">
          GATE 24
        </div>
        <div className="dd-drawer" ref={drawerRef} style={{ height: DETENTS[0].h }} role="slider" aria-label="阻尼抽屉" aria-valuemin={0} aria-valuenow={idx} aria-valuemax={2} tabIndex={0}>
          <div className="dd-handle" />
          <div className="dd-rows">
            {ROWS.map(([no, name, state]) => (
              <div key={no} className="dd-row">
                <span>{no}</span>
                <span>{name}</span>
                <span className={state === 'LIVE' ? 'amber' : ''}>{state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dd-dots">
        {DETENTS.map((d, i) => (
          <button key={d.label} className={`dd-pill${i === idx ? ' on' : ''}`} onClick={() => animateTo(d.h, i)}>
            {d.label}
          </button>
        ))}
      </div>
      <span className="hint">拖动抽屉 · 快甩跨卡点吸附 · 越界橡皮筋</span>
    </div>
  )
}
