import { useEffect, useRef, useState } from 'react'

const RANGE = 135 // 旋钮可旋转的半角：-135° ~ +135°，共 270°
const angleFor = (v: number) => -RANGE + (v / 100) * RANGE * 2
const valueFor = (a: number) => Math.round(((a + RANGE) / (RANGE * 2)) * 100)
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** 旋转旋钮（C-13）：环形拖拽调角度，控制闸口亮度读数（帧内直写，整数变化才 setState） */
export default function RotaryKnob() {
  const [value, setValue] = useState(42)
  const knobRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, cx: 0, cy: 0 })

  useEffect(() => {
    if (knobRef.current) knobRef.current.style.transform = `rotate(${angleFor(value)}deg)`
  }, [value])

  useEffect(() => {
    const el = knobRef.current!
    const onDown = (e: PointerEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      drag.current = { on: true, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.current.on) return
      const raw = (Math.atan2(e.clientY - drag.current.cy, e.clientX - drag.current.cx) * 180) / Math.PI
      let a = raw + 90 /* 0° = 正上方 */
      if (a > 180) a -= 360
      a = clamp(a, -RANGE, RANGE)
      const v = valueFor(a)
      if (v !== value) setValue(v)
    }
    const onUp = () => {
      drag.current.on = false
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [value])

  const byKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      setValue(v => clamp(v + 4, 0, 100))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setValue(v => clamp(v - 4, 0, 100))
    }
  }

  const lit = Math.round(value / 10)

  return (
    <div className="knob-wrap">
      <div className="knob-area">
        <div className="knob-ring" aria-hidden="true">
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              className={`knob-tick${i <= lit ? ' on' : ''}`}
              style={{ transform: `translate(-50%, -50%) rotate(${-RANGE + i * 27}deg) translateY(-58px)` }}
            />
          ))}
        </div>
        <div
          className="knob"
          ref={knobRef}
          role="slider"
          tabIndex={0}
          aria-label="闸口亮度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          onKeyDown={byKey}
        >
          <span className="knob-grip" />
        </div>
      </div>
      <div className="knob-read">
        <span className="od-label">Gate Brightness · 闸口亮度</span>
        <span className="knob-val">
          {String(value).padStart(3, '0')}
          <small>%</small>
        </span>
        <div className="knob-segs" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} className={i < lit ? 'on' : ''} />
          ))}
        </div>
        <span className="hint">环形拖拽 · 方向键微调</span>
      </div>
    </div>
  )
}
