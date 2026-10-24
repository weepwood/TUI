import { useEffect, useRef, useState } from 'react'
import { REDUCED } from '../lib/scroll'

const PHRASES = ['GATE 24 OPEN', 'SHIP FASTER', 'TERMINAL UI']
const GLYPHS = '!<>-_\\/[]{}=+*^?#·—'

/** 乱码解码文字（C-25）：随机字符逐步解码成目标短语（ReactBits Decode Text / 经典 TextScramble），离屏自动暂停 */
export default function TextScramble() {
  const ref = useRef<HTMLSpanElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const el = ref.current!
    let idx = 0 /* 已定格字符数 */
    let frame = 0
    let queue: { from: string; to: string }[] = []
    let raf = 0
    let visible = true

    const setText = (text: string) => {
      const old = el.textContent ?? ''
      queue = [...text].map((to, i) => ({ from: old[i] ?? ' ', to }))
      idx = 0
      frame = 0
    }

    const update = () => {
      let out = ''
      let done = 0
      queue.forEach((q, i) => {
        if (idx >= i + 1) {
          done++
          out += q.to
        } else if (idx >= i) {
          /* 当前正在解码的字符：每 2 帧换一个随机字形 */
          out = out + (frame % 2 === 0 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : (el.textContent ?? '')[i] ?? q.from)
        } else {
          out += q.from
        }
      })
      el.textContent = out
      if (done === queue.length) {
        /* 解码完成，停留后切下一句 */
        setTimeout(() => {
          if (!visible) return
          setPhase(p => (p + 1) % PHRASES.length)
        }, 1800)
        return
      }
      frame++
      if (frame % 3 === 0) idx++
      raf = requestAnimationFrame(update)
    }

    if (REDUCED) {
      /* 减弱动态：直接切换 */
      const t = setInterval(() => setPhase(p => (p + 1) % PHRASES.length), 2400)
      el.textContent = PHRASES[phase]
      return () => clearInterval(t)
    }

    setText(PHRASES[phase])
    raf = requestAnimationFrame(update)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(update)
    })
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [phase])

  return (
    <div className="ts">
      <span className="od-label">Now Decoding · 正在解码</span>
      <span className="ts-text cond" ref={ref} aria-live="off">
        {PHRASES[phase]}
      </span>
      <span className="hint">随机字形逐位定格 · 离开视口自动暂停</span>
    </div>
  )
}
