import CopyButton from './CopyButton'

interface Props {
  prompt: string
}

/** 组件提示词卡片：完整展示 AI 生成提示词 + 一键复制 */
export default function PromptCard({ prompt }: Props) {
  return (
    <div className="pcard">
      <div className="pcard-hd">
        <span className="pcard-tag">✦ AI PROMPT · 生成提示词</span>
        <CopyButton cmd={prompt} label="一键复制" doneLabel="已复制 COPIED" />
      </div>
      <p className="pcard-body">{prompt}</p>
    </div>
  )
}
