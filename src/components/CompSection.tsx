import { useState, type ReactNode } from 'react'
import { useReveal } from '../lib/hooks'
import { MULTI_VARIANT_IDS, VARIANTS, type Status } from '../lib/data'
import PromptCard from './PromptCard'

interface Props {
  id: string
  tag: string
  title: string
  cn: string
  st: Exclude<Status, 'DELAYED'>
  footer: ReactNode
  /** 基础提示词（当前变体的风格描述会自动拼接） */
  prompt: string
  className?: string
  demoStyle?: React.CSSProperties
  children: ReactNode
}

/** 组件展示块统一骨架：变体切换 + 提示词折叠面板（默认隐藏）+ 演示区 + 说明条 */
export default function CompSection({ id, tag, title, cn, st, footer, prompt, className, demoStyle, children }: Props) {
  const ref = useReveal<HTMLElement>()
  const multi = MULTI_VARIANT_IDS.has(id)
  const [variantId, setVariantId] = useState('classic')
  const [promptOpen, setPromptOpen] = useState(false)
  const variant = VARIANTS.find(v => v.id === variantId) ?? VARIANTS[0]
  const fullPrompt = variant.id === 'classic' ? prompt : `${prompt}${variant.promptSuffix}`

  return (
    <section className={`comp reveal${className ? ' ' + className : ''}`} id={id} ref={ref}>
      <div className="comp-hd">
        <div>
          <div className="comp-tag">{tag}</div>
          <h2>
            {title} <small>{cn}</small>
          </h2>
        </div>
        <div className="comp-hd-r">
          <button
            className={`prompt-chip${promptOpen ? ' on' : ''}`}
            onClick={() => setPromptOpen(o => !o)}
            aria-expanded={promptOpen}
            title={promptOpen ? '收起提示词' : '展开提示词（当前变体）'}
          >
            ✦ 提示词
          </button>
          <span className={`chip ${st === 'BOARDING' ? 'boarding' : 'ontime'}`}>{st}</span>
        </div>
      </div>

      {multi && (
        <div className="var-row" role="tablist" aria-label="样式变体">
          {VARIANTS.map(v => (
            <button
              key={v.id}
              className={`var-chip${v.id === variantId ? ' on' : ''}`}
              role="tab"
              aria-selected={v.id === variantId}
              onClick={() => setVariantId(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className={`comp-demo${variant.cls ? ' ' + variant.cls : ''}`} style={demoStyle} data-variant={variant.id}>
        {children}
      </div>
      <div className="comp-ft">{footer}</div>

      {/* 提示词面板：默认隐藏，点击 ✦ 展开，内容跟随当前变体 */}
      <div className={`pcard-wrap${promptOpen ? ' open' : ''}`}>
        <div className="pcard-clip">
          <PromptCard prompt={fullPrompt} variantLabel={variant.label} />
        </div>
      </div>
    </section>
  )
}
