import CopyButton from './CopyButton'

interface Props {
  prompt: string
  variantLabel?: string
}

/** 组件提示词卡片：展示当前变体的完整提示词 + 一键复制（外层负责折叠显隐） */
export default function PromptCard({ prompt, variantLabel }: Props) {
  return (
    <div className="pcard">
      <div className="pcard-hd">
        <span className="pcard-tag">
          ✦ AI PROMPT{variantLabel ? ` · ${variantLabel}` : ''}
        </span>
        <CopyButton cmd={prompt} label="一键复制" doneLabel="已复制 COPIED" />
      </div>
      <p className="pcard-body">{prompt}</p>
    </div>
  )
}
