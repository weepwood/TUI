import { memo, useState, type ReactNode } from 'react'
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
  /** 受控变体：传入时（单页查看器）由外部驱动 ←/→ 切换；不传时（总览）内部自持 */
  variant?: string
  onVariantChange?: (v: string) => void
}

/** 组件展示块统一骨架：变体切换 + 一键复制提示词（点击即复制，不展开面板）+ 演示区 + 说明条 */
function CompSection({ id, tag, title, cn, st, footer, prompt, className, demoStyle, children, variant, onVariantChange }: Props) {
  const ref = useReveal<HTMLElement>()
  const multi = MULTI_VARIANT_IDS.has(id)
  const [localVariant, setLocalVariant] = useState('classic')
  const variantId = variant ?? localVariant
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const variantMeta = VARIANTS.find(v => v.id === variantId) ?? VARIANTS[0]
  const fullPrompt = variantMeta.id === 'classic' ? prompt : `${prompt}${variantMeta.promptSuffix}`

  const pickVariant = (v: string) => {
    if (variant === undefined) setLocalVariant(v)
    onVariantChange?.(v)
  }

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
              onClick={() => pickVariant(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className={`comp-demo${variantMeta.cls ? ' ' + variantMeta.cls : ''}`} style={demoStyle} data-variant={variantMeta.id}>
        {children}
      </div>
      <div className="comp-ft">{footer}</div>
    </section>
  )
}

/* props 全部来自 useMemo 的稳定引用：总览滚动时 scrollspy 更新不会重渲染各区块 */
export default memo(CompSection)
