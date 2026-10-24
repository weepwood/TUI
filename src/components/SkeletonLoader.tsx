import { useEffect, useRef, useState } from 'react'

const FLIGHTS = [
  { no: 'TR-201', from: 'PEK', to: 'LAX', time: '09:45', st: 'BOARDING', ok: true },
  { no: 'TR-305', from: 'SHA', to: 'SIN', time: '11:20', st: 'ON TIME', ok: false },
  { no: 'TR-412', from: 'CAN', to: 'NRT', time: '14:05', st: 'DELAYED', ok: false },
]

/** 骨架屏（C-14）：模拟 1.6s 加载，微光扫过占位块后内容淡入 */
export default function SkeletonLoader() {
  const [i, setI] = useState(0)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number>(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const reload = () => {
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      setI(k => (k + 1) % FLIGHTS.length)
    }, 1600)
  }

  const f = FLIGHTS[i]

  return (
    <div className="sk-wrap">
      {loading ? (
        <div className="sk-card" aria-label="加载中">
          <div className="sk-circle" />
          <div className="sk-lines">
            <div className="sk-line" style={{ width: '58%' }} />
            <div className="sk-line" style={{ width: '84%' }} />
            <div className="sk-line" style={{ width: '40%' }} />
          </div>
        </div>
      ) : (
        <div className="arr-card" key={f.no}>
          <span className="arr-code">{f.no}</span>
          <div className="arr-route">
            <b>{f.from}</b>
            <span className="arr-dash">✈&#xFE0E;</span>
            <b>{f.to}</b>
          </div>
          <span className="arr-time">{f.time}</span>
          <span className={`chip ${f.ok ? 'boarding' : f.st === 'DELAYED' ? 'ontime' : 'ontime'}`}>{f.st}</span>
        </div>
      )}
      <button className="btn" onClick={reload} disabled={loading}>
        {loading ? 'LOADING…' : '刷新下一班'}
      </button>
    </div>
  )
}
