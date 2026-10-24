import { useRef, useState, useEffect } from 'react'

interface Particle {
  id: number
  tx: number
  ty: number
  size: number
  color: string
}
const COLORS = ['var(--amber)', 'var(--ok)', 'var(--danger)']
let seq = 0

/** 点赞爆裂（C-19）：点击计数 + CSS 变量驱动的一簇粒子（Bencho: Like / Reactions） */
export default function ReactionBurst() {
  const [count, setCount] = useState(128)
  const [batches, setBatches] = useState<Particle[][]>([])
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const like = () => {
    setCount(c => c + 1)
    const batch: Particle[] = Array.from({ length: 12 }, () => {
      const a = Math.random() * Math.PI * 2
      const d = 36 + Math.random() * 52
      return {
        id: ++seq,
        tx: Math.cos(a) * d,
        ty: Math.sin(a) * d,
        size: 4 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    })
    setBatches(list => [...list, batch])
    const t = window.setTimeout(() => {
      setBatches(list => list.filter(b => b !== batch))
    }, 750)
    timers.current.push(t)
  }

  return (
    <div className="rb">
      <div className="rb-stage">
        {batches.flat().map(p => (
          <span
            key={p.id}
            className="rb-p"
            style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, width: p.size, height: p.size, background: p.color } as React.CSSProperties}
          />
        ))}
        <button className="rb-btn" onClick={like} aria-label="点赞">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M3 11.5 21 3l-8.5 18-2.3-7.2L3 11.5z" />
          </svg>
        </button>
      </div>
      <span className="rb-count mono">{count} 次起飞祝福</span>
      <span className="hint">点击飞机 · 粒子爆裂</span>
    </div>
  )
}
