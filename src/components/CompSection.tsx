import { useState, type ReactNode } from 'react'
import { useReveal } from '../lib/hooks'
import { MULTI_VARIANT_IDS, VARIANTS, type Status } from '../lib/data'
import { copyText } from '../lib/scroll'
import { useToast } from '../state/app'

interface Props {
  id: string
  tag: string
  title: string
  cn: string
  st: Exclude<Status, 'DELAYED'>
  footer: ReactNode
  /** 基础提示词（当前变体的风格描述会自动拼接后一起复制） */
  prompt: string
  className?: string
  demoStyle?: React.CSSProperties
  children: ReactNode
}

/** 组件展示块统一骨架：变体切换 + 一键复制提示词（点击即复制，不展开面板）+ 演示区 + 说明条 */
export default function CompSection({ id, tag, title, cn, st, footer, prompt, className, demoStyle, children }: Props) {
  const ref = useReveal<HTMLElement>()
  const multi = MULTI_VARIANT_IDS.has(id)
  const [variantId, setVariantId] = useState('classic')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const variant = VARIANTS.find(v => v.id === variantId) ?? VARIANTS[0]
  const fullPrompt = variant.id === 'classic' ? prompt : `${prompt}${variant.promptSuffix}`

  const copyPrompt = async () => {
    const ok = await copyText(fullPrompt)
    toast(ok ? '组件提示词已复制，去喂给 AI 吧' : '复制失败，请手动选择', ok ? 'ok' : 'err')
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

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
            className={`prompt-chip${copied ? ' done' : ''}`}
            onClick={copyPrompt}
            title="复制当前变体的生成提示词"
          >
            {copied ? '✓ 已复制' : '✦ 提示词'}
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
    </section>
  )
}
