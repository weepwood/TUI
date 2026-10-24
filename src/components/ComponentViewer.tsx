import { useEffect, useRef, type ReactNode } from 'react'
import { COMPONENTS, type CompMeta } from '../lib/data'

interface Props {
  id: string
  onClose: () => void
  onSwitch: (id: string) => void
  children: ReactNode
}

const SECTIONS = COMPONENTS.filter((c): c is CompMeta & { id: string } => !!c.id)

/** 全局浮动组件查看器：固定居中浮窗 + 左右固定切换按钮 + 滚轮/键盘切换 */
export default function ComponentViewer({ id, onClose, onSwitch, children }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)

  const idx = SECTIONS.findIndex(s => s.id === id)
  const cur = SECTIONS[idx]
  const prev = idx > 0 ? SECTIONS[idx - 1] : null
  const next = idx >= 0 && idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null

  /* 打开期间锁定背景滚动 */
  useEffect(() => {
    document.documentElement.classList.add('viewer-open')
    return () => document.documentElement.classList.remove('viewer-open')
  }, [])

  /* 切换组件后回到顶部 */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [id])

  /* 滚轮切换：浮窗内容可滚时先滚内容，到边界或内容不溢出时切换；带节流锁 */
  useEffect(() => {
    let lock = false
    let acc = 0
    const onWheel = (e: WheelEvent) => {
      if (lock) return
      const body = bodyRef.current
      if (body && e.target instanceof Node && body.contains(e.target)) {
        const scrollable = body.scrollHeight > body.clientHeight + 1
        const atTop = body.scrollTop <= 0
        const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1
        /* 内容自身还有滚动空间时放行原生滚动 */
        if (scrollable && !((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom))) return
      }
      e.preventDefault()
      acc += e.deltaY
      if (Math.abs(acc) < 36) return
      const dir = acc > 0 ? 1 : -1
      acc = 0
      const target = dir > 0 ? next : prev
      if (!target) return
      lock = true
      setTimeout(() => (lock = false), 720)
      onSwitch(target.id)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, prev, onSwitch])

  /* 键盘：←/→ 切换，ESC 关闭（指令面板打开时让位） */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.pal-overlay.open')) return
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && next) onSwitch(next.id)
      else if (e.key === 'ArrowLeft' && prev) onSwitch(prev.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, onClose, onSwitch])

  return (
    <div
      className="cv-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        className="cv-arrow cv-l"
        disabled={!prev}
        onClick={() => prev && onSwitch(prev.id)}
        aria-label={`上一个组件：${prev ? prev.cn : '无'}`}
        title={prev ? `${prev.cn} ${prev.en}` : '已经是第一个'}
      >
        ←
      </button>

      <div className="cv-panel" role="dialog" aria-modal="true" aria-label={`组件查看器：${cur?.cn}`}>
        <div className="cv-hd">
          <span className="cv-crumb mono">
            {cur ? `${cur.id.replace('c', 'C-')} · ${cur.cn} · ${cur.en}` : ''}
          </span>
          <span className="cv-count mono">
            {idx + 1} / {SECTIONS.length}
          </span>
          <button className="cv-close" onClick={onClose} aria-label="关闭返回总览">
            ✕ ESC
          </button>
        </div>
        <div className="cv-body" ref={bodyRef}>
          <div className="cv-anim" key={id}>
            {children}
          </div>
        </div>
      </div>

      <button
        className="cv-arrow cv-r"
        disabled={!next}
        onClick={() => next && onSwitch(next.id)}
        aria-label={`下一个组件：${next ? next.cn : '无'}`}
        title={next ? `${next.cn} ${next.en}` : '已经是最后一个'}
      >
        →
      </button>
    </div>
  )
}
