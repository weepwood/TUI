import type { ReactNode } from 'react'
import { useReveal } from '../lib/hooks'
import { copyText } from '../lib/scroll'
import type { Status } from '../lib/data'
import { useToast } from '../state/app'
import PromptCard from './PromptCard'

interface Props {
  id: string
  tag: string
  title: string
  cn: string
  st: Exclude<Status, 'DELAYED'>
  footer: ReactNode
  prompt: string
  /** 聚焦视图：在区块下方展开完整提示词卡片 */
  showPrompt?: boolean
  className?: string
  demoStyle?: React.CSSProperties
  children: ReactNode
}

/** 组件展示块的统一骨架：编号标签 + 标题 + 状态胶囊 + 提示词复制 / 演示区 / 说明条 */
export default function CompSection({ id, tag, title, cn, st, footer, prompt, showPrompt, className, demoStyle, children }: Props) {
  const ref = useReveal<HTMLElement>()
  const { toast } = useToast()

  const copyPrompt = async () => {
    const ok = await copyText(prompt)
    toast(ok ? '组件提示词已复制，去喂给 AI 吧' : '复制失败，请手动选择', ok ? 'ok' : 'err')
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
          <button className="prompt-chip" onClick={copyPrompt} title={prompt.slice(0, 60) + '…'}>
            ✦ 提示词
          </button>
          <span className={`chip ${st === 'BOARDING' ? 'boarding' : 'ontime'}`}>{st}</span>
        </div>
      </div>
      <div className="comp-demo" style={demoStyle}>
        {children}
      </div>
      <div className="comp-ft">{footer}</div>
      {showPrompt && <PromptCard prompt={prompt} />}
    </section>
  )
}
