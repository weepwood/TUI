import { useEffect, useRef, useState } from 'react'

/** 入场揭示：进入视口时给元素加 .in（一次性） */
export function useReveal<T extends HTMLElement>(): React.RefObject<T> {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            el.classList.add('in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** 本地时钟，1s 一跳 */
export function useClock(): string {
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 8))
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}
