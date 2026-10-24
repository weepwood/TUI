/* 滚动与剪贴板工具：rAF 自实现平滑滚动，不依赖 CSS scroll-behavior */

export const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 程序化滚动锁：滚动期间冻结 scrollspy，避免侧边栏高亮沿途乱闪 */
export const nav = { lock: false }

export function scrollOffset(): number {
  return window.matchMedia('(max-width:960px)').matches ? 122 : 84
}

export function smoothScrollTo(targetY: number, onDone?: () => void): void {
  const startY = window.scrollY
  const maxY = document.documentElement.scrollHeight - window.innerHeight
  const endY = Math.max(0, Math.min(targetY, maxY))
  cancelAnimationFrame(scrollAnimId)
  if (REDUCED || Math.abs(endY - startY) < 2) {
    window.scrollTo(0, endY)
    onDone?.()
    return
  }
  const dist = endY - startY
  const duration = Math.max(300, Math.min(820, Math.abs(dist) * 0.5))
  const t0 = performance.now()
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / duration)
    window.scrollTo(0, startY + dist * ease(k))
    if (k < 1) scrollAnimId = requestAnimationFrame(step)
    else onDone?.()
  }
  scrollAnimId = requestAnimationFrame(step)
}
let scrollAnimId = 0

/** 滚动结束后按实际位置校准高亮（IO 在锁定期错过事件时的兜底） */
export function currentSectionId(): string {
  const off = scrollOffset() + 80
  let cur = 'c00'
  document.querySelectorAll<HTMLElement>('section[id]').forEach(el => {
    if (el.getBoundingClientRect().top <= off) cur = el.id
  })
  return cur
}

export function scrollToEl(el: HTMLElement, after?: (id: string) => void): void {
  nav.lock = true
  /* 目标若未入场，先瞬间揭示（跳过过渡）再测量，避免量到过渡中的位移；
     同时强制渲染（配合 content-visibility: auto），确保测到真实高度 */
  if (el.style) el.style.contentVisibility = 'visible'
  if (el.classList.contains('reveal') && !el.classList.contains('in')) {
    el.style.transition = 'none'
    el.classList.add('in')
    void el.offsetWidth
    el.style.transition = ''
  }
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - scrollOffset(), () => {
    setTimeout(() => {
      nav.lock = false
      after?.(currentSectionId())
      /* content-visibility 估算高度与真实高度的残差校正（一次性瞬时修正） */
      const delta = el.getBoundingClientRect().top - scrollOffset()
      if (Math.abs(delta) > 6) window.scrollTo(0, window.scrollY + delta)
    }, 60)
  })
}

export function gotoComponent(id: string, after?: (id: string) => void): void {
  const el = document.getElementById(id)
  if (!el) return
  scrollToEl(el, after)
  el.classList.remove('flash')
  void el.offsetWidth
  el.classList.add('flash')
  history.replaceState(null, '', '#' + id)
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}
