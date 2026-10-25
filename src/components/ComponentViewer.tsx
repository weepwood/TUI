import { useEffect, useRef, type ReactNode } from 'react'
import { COMPONENTS, MULTI_VARIANT_IDS, VARIANTS, type CompMeta } from '../lib/data'

interface Props {
  id: string
  /** 当前样式变体（由 App 持有，跨 ↑↓ 切换时复位为 classic） */
  variantId: string
  onVariantChange: (v: string) => void
  onClose: () => void
  onSwitch: (id: string) => void
  children: ReactNode
}

const SECTIONS = COMPONENTS.filter((c): c is CompMeta & { id: string } => !!c.id)

/* 这些控件自身用方向键工作（OTP、滑杆、旋钮、分段、座位图等），让位 */
const INTERACTIVE_SEL =
  'input, textarea, select, [contenteditable], [role=slider], [role=radiogroup], [role=radio], [role=listbox], [role=option], [role=combobox], [role=grid]'

/** 单页组件页面：嵌在侧边栏右侧内容区。↑/↓（或滚轮/底部按钮）切换组件，←/→ 切换样式变体，ESC 返回总览 */
export default function ComponentViewer({ id, variantId, onVariantChange, onClose, onSwitch, children }: Props) {
  const pageRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const idx = SECTIONS.findIndex(s => s.id === id)
  const cur = SECTIONS[idx]
  const prev = idx > 0 ? SECTIONS[idx - 1] : null
  const next = idx >= 0 && idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null

  const multi = MULTI_VARIANT_IDS.has(id)
  const variantIdx = VARIANTS.findIndex(v => v.id === variantId)
  const prevVariant = VARIANTS[(variantIdx - 1 + VARIANTS.length) % VARIANTS.length]
  const nextVariant = VARIANTS[(variantIdx + 1) % VARIANTS.length]

  /* 页面模式锁定文档滚动：内容在 cv-body 内滚 */
  useEffect(() => {
    document.documentElement.classList.add('viewer-open')
    return () => document.documentElement.classList.remove('viewer-open')
  }, [])

  /* 切换组件后回到顶部 */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [id])

  /* 滚轮切换：仅页面区域内生效；内容可滚时先滚内容，到边界或内容不溢出时切换；带节流锁 */
  useEffect(() => {
    let lock = false
    let acc = 0
    const onWheel = (e: WheelEvent) => {
      const page = pageRef.current
      if (!page || !(e.target instanceof Node) || !page.contains(e.target)) return
      if (lock) return
      const body = bodyRef.current
      if (body && body.contains(e.target)) {
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

  /* 键盘：↑/↓ 切换组件，←/→ 切换样式变体，ESC 返回总览（指令面板/表单控件内让位） */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.pal-overlay.open')) return
      const el = e.target as HTMLElement | null
      if (el && typeof el.closest === 'function' && el.closest(INTERACTIVE_SEL)) return
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        if (!next) return
        e.preventDefault()
        onSwitch(next.id)
      } else if (e.key === 'ArrowUp') {
        if (!prev) return
        e.preventDefault()
        onSwitch(prev.id)
      } else if (e.key === 'ArrowRight' && multi) {
        e.preventDefault()
        onVariantChange(nextVariant.id)
      } else if (e.key === 'ArrowLeft' && multi) {
        e.preventDefault()
        onVariantChange(prevVariant.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, onClose, onSwitch, multi, nextVariant, prevVariant, onVariantChange])

  return (
    <>
      <div className="cv-page" ref={pageRef}>
        <div className="cv-hd">
          <span className="cv-crumb mono">
            {cur ? `${cur.id.replace('c', 'C-')} · ${cur.cn} · ${cur.en}` : ''}
          </span>
          <span className="cv-keys mono">↑↓ 组件 · ←→ 样式 · ESC 总览</span>
          <span className="cv-count mono">
            {idx + 1} / {SECTIONS.length}
          </span>
          <button className="cv-close" onClick={onClose} aria-label="返回总览全部组件">
            ✕ 总览
          </button>
        </div>
        <div className="cv-body" ref={bodyRef}>
          <div className="cv-anim" key={id}>
            {children}
          </div>
        </div>

        {multi && (
          <button
            className="cv-arrow cv-l"
            onClick={() => onVariantChange(prevVariant.id)}
            aria-label={`上一样式：${prevVariant.label}`}
            title={`← 上一样式 · ${prevVariant.label}`}
          >
            ‹
          </button>
        )}
        {multi && (
          <button
            className="cv-arrow cv-r"
            onClick={() => onVariantChange(nextVariant.id)}
            aria-label={`下一样式：${nextVariant.label}`}
            title={`→ 下一样式 · ${nextVariant.label}`}
          >
            ›
          </button>
        )}
      </div>

      {/* 固定在视口底部的组件切换条（.cv-page 的入场动画带 transform，避免成为其定位基准） */}
      <div className="cv-nav">
        <button
          className="cv-step"
          disabled={!prev}
          onClick={() => prev && onSwitch(prev.id)}
          aria-label={`上一个组件：${prev ? prev.cn : '无'}`}
          title={prev ? `${prev.cn} ${prev.en}` : '已经是第一个'}
        >
          ↑ {prev ? prev.cn : '已到头'}
        </button>
        <span className="cv-step-count mono">
          {idx + 1} / {SECTIONS.length}
        </span>
        <button
          className="cv-step"
          disabled={!next}
          onClick={() => next && onSwitch(next.id)}
          aria-label={`下一个组件：${next ? next.cn : '无'}`}
          title={next ? `${next.cn} ${next.en}` : '已经是最后一个'}
        >
          {next ? next.cn : '已到头'} ↓
        </button>
      </div>
    </>
  )
}
