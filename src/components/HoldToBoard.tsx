import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '../state/app'

const CIRC = 295.3
const HOLD_MS = 900

type Phase = 'ready' | 'holding' | 'done'

/** 长按登机：rAF 进度环，按住充能、松手回弹、充满放行一架飞机（组件 C-09 本体） */
export default function HoldToBoard() {
  const btnRef = useRef<HTMLDivElement>(null)
  const progRef = useRef<SVGCircleElement>(null)
  const planeRef = useRef<HTMLSpanElement>(null)
  const holdTextRef = useRef<HTMLSpanElement>(null)
  const st = useRef({ p: 0, holding: false, done: false, last: 0, running: false })
  const [phase, setPhase] = useState<Phase>('ready')
  const { toast } = useToast()

  const complete = useCallback(() => {
    st.current.done = true
    st.current.holding = false
    setPhase('done')
    const plane = planeRef.current
    if (plane) {
      plane.classList.remove('fly')
      void plane.offsetWidth
      plane.classList.add('fly')
    }
    toast('欢迎登机 · FLIGHT TR-110 起飞', 'ok')
    setTimeout(() => {
      st.current.done = false
      st.current.p = 0
      setPhase('ready')
    }, 1800)
  }, [toast])

  useEffect(() => {
    const s = st.current
    /* rAF 只在充能/回弹期间运转，空闲即停 */
    const ensureLoop = () => {
      if (s.running) return
      s.running = true
      requestAnimationFrame(loop)
    }
    const loop = (t: number) => {
      const dt = s.last ? t - s.last : 16
      s.last = t
      if (s.holding && !s.done) {
        s.p = Math.min(1, s.p + dt / HOLD_MS)
        if (s.p >= 1) complete()
      } else if (!s.done && s.p > 0) {
        s.p = Math.max(0, s.p - dt / 260)
      }
      if (progRef.current) progRef.current.style.strokeDashoffset = String(CIRC * (1 - s.p))
      /* 百分比文字用 ref 直写，避免每帧 setState 触发重渲染 */
      if (s.holding && !s.done && holdTextRef.current) {
        holdTextRef.current.textContent = `HOLDING ${Math.round(s.p * 100)}% · 充能中`
      }
      if (s.holding || (!s.done && s.p > 0)) requestAnimationFrame(loop)
      else {
        s.running = false
        s.last = 0
      }
    }
    const down = (e: Event) => {
      e.preventDefault()
      if (s.done) return
      s.holding = true
      setPhase('holding')
      ensureLoop()
    }
    const up = () => {
      s.holding = false
      if (!s.done && s.p < 1 && s.p > 0) setPhase('ready')
    }
    const keydown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!s.done && !s.holding) {
          down(e)
          setTimeout(up, HOLD_MS + 30)
        }
      }
    }
    const btn = btnRef.current!
    btn.addEventListener('pointerdown', down)
    btn.addEventListener('pointerup', up)
    btn.addEventListener('pointerleave', up)
    btn.addEventListener('pointercancel', up)
    btn.addEventListener('keydown', keydown)
    return () => {
      btn.removeEventListener('pointerdown', down)
      btn.removeEventListener('pointerup', up)
      btn.removeEventListener('pointerleave', up)
      btn.removeEventListener('pointercancel', up)
      btn.removeEventListener('keydown', keydown)
    }
  }, [complete])

  return (
    <div className="htb">
      <div className={`htb-btn${phase === 'done' ? ' done' : ''}`} ref={btnRef} role="button" tabIndex={0} aria-label="长按完成登机">
        <svg className="ring" width="104" height="104" viewBox="0 0 104 104">
          <circle className="track" cx="52" cy="52" r="47" />
          <circle className="prog" cx="52" cy="52" r="47" ref={progRef} strokeDasharray={CIRC} strokeDashoffset={CIRC} />
        </svg>
        <span className="htb-core">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M3 11.5 21 3l-8.5 18-2.3-7.2L3 11.5z" />
          </svg>
        </span>
        <span className="htb-plane" ref={planeRef}>
          ✈&#xFE0E;
        </span>
      </div>
      <span className={`htb-state${phase === 'done' ? ' ok' : ''}`}>
        {phase === 'done' ? (
          '✓ BOARDING COMPLETE · 登机完成'
        ) : phase === 'holding' ? (
          <span ref={holdTextRef}>HOLDING 0% · 充能中</span>
        ) : (
          'READY · 按住中间的按钮 0.9 秒'
        )}
      </span>
    </div>
  )
}
