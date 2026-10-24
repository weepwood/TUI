import { useState } from 'react'
import { copyText } from '../lib/scroll'
import { useToast } from '../state/app'

interface Props {
  cmd: string
  label?: string
  doneLabel?: string
  className?: string
}

/** 复制按钮：写入剪贴板后图标与文案一起切换（组件 C-07 本体） */
export default function CopyButton({ cmd, label = '复制命令', doneLabel = '已复制 COPIED', className }: Props) {
  const [done, setDone] = useState(false)
  const { toast } = useToast()

  const onClick = async () => {
    const ok = await copyText(cmd)
    if (ok) {
      setDone(true)
      toast('命令已复制到剪贴板', 'ok')
      setTimeout(() => setDone(false), 1800)
    } else {
      toast('复制失败，请手动选择命令', 'err')
    }
  }

  return (
    <button className={`copy-btn${done ? ' done' : ''}${className ? ' ' + className : ''}`} onClick={onClick}>
      <svg className="ic-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
      <svg className="ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{done ? doneLabel : label}</span>
    </button>
  )
}
