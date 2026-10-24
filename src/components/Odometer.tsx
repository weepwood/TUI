import { useEffect, useRef, useState } from 'react'

const START = 0
const INITIAL = 86412

/** 里程表：每位数字一根字轴，translateY 滚动 + 逐位错峰（组件 C-01 本体） */
export default function Odometer() {
  const [value, setValue] = useState(START)
  const [rolled, setRolled] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  /* 进入视口后从 000000 滚到初始值 */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let started = false
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started) {
          started = true
          setTimeout(() => {
            setRolled(true)
            setValue(INITIAL)
          }, 350)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const str = String(value).padStart(6, '0')

  return (
    <div ref={rootRef} style={{ display: 'contents' }}>
      <span className="od-label">Weekly Installs · 本周安装</span>
      <div className="od" aria-label="滚动数字演示">
        {[...str].map((ch, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span className="od-col">
              <span
                className="od-strip"
                style={{
                  transform: `translateY(${-Number(ch)}em)`,
                  /* 千位以外的位错峰滚动 */
                  transitionDelay: rolled ? `${(5 - i) * 70}ms` : '0ms',
                }}
              >
                {Array.from({ length: 10 }, (_, d) => (
                  <div key={d}>{d}</div>
                ))}
              </span>
            </span>
            {i === 2 && <span className="sep">,</span>}
          </span>
        ))}
        <span className="unit">INSTALLS</span>
      </div>
      <button className="btn" onClick={() => setValue(v => v + 137 + Math.floor(Math.random() * 830))}>
        再滚一次 +N
      </button>
    </div>
  )
}
