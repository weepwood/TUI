import { useEffect, useRef, useState } from 'react'
import { REDUCED } from '../lib/scroll'
import { useToast } from '../state/app'

const PLANE = '✈\uFE0E'

/** 滑动确认（C-15）：把飞机推到跑道尽头才放行，跑道灯随进度点亮（Bencho: Slide to Confirm） */
export default function SlideToConfirm() {
  const trackRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const st = useRef({ dragging: false, x: 0, startX: 0, w: 0, done: false })
  const [cleared, setCleared] = useState(false)
  const { toast } = useToast()

  const setX = (x: number, animate: boolean) => {
    const knob = knobRef.current
    const track = trackRef.current
    if (!knob || !track) return
    st.current.x = x
    knob.style.transition = animate && !REDUCED ? 'transform .32s cubic-bezier(.3,1.3,.4,1)' : 'none'
    knob.style.transform = `translateX(${x}px)`
    const p = st.current.w > 0 ? x / st.current.w : 0
    track.querySelectorAll<HTMLElement>('.sc-tick').forEach(t => {
      t.classList.toggle('on', p >= Number(t.dataset.p))
    })
  }

  useEffect(() => {
    const knob = knobRef.current!
    const track = trackRef.current!
    const s = st.current
    const max = () => track.clientWidth - knob.offsetWidth - 8

    const onDown = (e: PointerEvent) => {
      if (s.done) return
      e.preventDefault()
      s.w = max()
      s.dragging = true
      s.startX = e.clientX - s.x
      knob.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return
      setX(Math.max(0, Math.min(max(), e.clientX - s.startX)), false)
    }
    const onUp = () => {
      if (!s.dragging) return
      s.dragging = false
      if (s.x >= max() * 0.85) {
        setX(max(), true)
        if (!s.done) {
          s.done = true
          setCleared(true)
          toast('CLEARED FOR TAKEOFF · 允许起飞', 'ok')
          setTimeout(() => {
            s.done = false
            setCleared(false)
            setX(0, true)
          }, 1800)
        }
      } else {
        setX(0, true)
      }
    }
    knob.addEventListener('pointerdown', onDown)
    knob.addEventListener('pointermove', onMove)
    knob.addEventListener('pointerup', onUp)
    knob.addEventListener('pointercancel', onUp)
    return () => {
      knob.removeEventListener('pointerdown', onDown)
      knob.removeEventListener('pointermove', onMove)
      knob.removeEventListener('pointerup', onUp)
      knob.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div className="sc">
      <div className={`sc-track${cleared ? ' ok' : ''}`} ref={trackRef}>
        <span className={`sc-label${cleared ? ' ok' : ''}`}>{cleared ? 'CLEARED · 允许起飞' : 'SLIDE TO TAKEOFF · 推到尽头'}</span>
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className="sc-tick" data-p={((i + 1) / 10).toFixed(1)} style={{ left: `${8 + ((i + 1) / 10) * 84}%` }} />
        ))}
        <div className="sc-knob" ref={knobRef}>
          {PLANE}
        </div>
      </div>
      <span className="hint">拖动飞机越过 85% 处松手 · 中途松手回弹</span>
    </div>
  )
}
