import { useCallback, useEffect, useRef, useState } from 'react'

const MIN = 1
const MAX = 9

/** 数字步进器：点按单步、长按 420ms 连发、数值弹跳 + 座位灯（组件 C-04 本体） */
export default function Stepper() {
  const [val, setVal] = useState(1)
  const [popKey, setPopKey] = useState(0)
  const timers = useRef<{ t1?: number; t2?: number }>({})

  const update = useCallback((v: number) => {
    const next = Math.max(MIN, Math.min(MAX, v))
    setVal(prev => {
      if (next !== prev) setPopKey(k => k + 1)
      return next
    })
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(timers.current.t1)
      clearInterval(timers.current.t2)
    }
  }, [])

  const bindHold = (fn: () => void) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      fn()
      timers.current.t1 = setTimeout(() => {
        timers.current.t2 = setInterval(fn, 90)
      }, 420)
    },
    onPointerUp: () => {
      clearTimeout(timers.current.t1)
      clearInterval(timers.current.t2)
    },
    onPointerLeave: () => {
      clearTimeout(timers.current.t1)
      clearInterval(timers.current.t2)
    },
    onPointerCancel: () => {
      clearTimeout(timers.current.t1)
      clearInterval(timers.current.t2)
    },
  })

  return (
    <>
      <span className="od-label">Passengers · 乘客</span>
      <div className="stepper">
        <button className="step-btn" aria-label="减少一位乘客" {...bindHold(() => update(val - 1))}>
          −
        </button>
        <span className="step-val pop" key={popKey}>
          {val}
        </span>
        <button className="step-btn" aria-label="增加一位乘客" {...bindHold(() => update(val + 1))}>
          +
        </button>
      </div>
      <div className="seats" aria-hidden="true">
        {Array.from({ length: MAX }, (_, i) => (
          <i key={i} className={i < val ? 'on' : ''} />
        ))}
      </div>
      <span className="hint">点按单步 · 长按连发</span>
    </>
  )
}
