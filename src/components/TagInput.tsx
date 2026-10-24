import { useState } from 'react'
import { useToast } from '../state/app'

const SUGGESTIONS = ['靠窗 WINDOW', '常旅客 GOLD', '素食餐 VGML', '前排 AISLE']
const MAX_TAGS = 6

/** 标签输入（C-23）：回车/逗号提交，退格删最后一个，点 × 移除，去重 + 上限 */
export default function TagInput() {
  const [tags, setTags] = useState<string[]>(['靠窗 WINDOW'])
  const [draft, setDraft] = useState('')
  const { toast } = useToast()

  const add = (raw: string) => {
    const t = raw.trim().replace(/,+$/, '').toUpperCase() === raw.trim() ? raw.trim() : raw.trim()
    if (!t) return
    setTags(prev => {
      if (prev.includes(t)) {
        toast('这个偏好已经加过了')
        return prev
      }
      if (prev.length >= MAX_TAGS) {
        toast(`最多 ${MAX_TAGS} 个偏好`)
        return prev
      }
      return [...prev, t]
    })
    setDraft('')
  }

  const remove = (t: string) => setTags(prev => prev.filter(x => x !== t))

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  return (
    <div className="ti">
      <span className="od-label">Travel Preferences · 出行偏好</span>
      <div className="ti-box">
        {tags.map(t => (
          <span key={t} className="ti-tag">
            {t}
            <button className="ti-x" onClick={() => remove(t)} aria-label={`移除 ${t}`}>
              ×
            </button>
          </span>
        ))}
        <input
          className="ti-input"
          placeholder={tags.length ? '' : '输入后回车，如 靠窗 WINDOW'}
          value={draft}
          aria-label="偏好输入"
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
        />
      </div>
      <div className="ti-sug">
        {SUGGESTIONS.filter(s => !tags.includes(s)).map(s => (
          <button key={s} className="preset" onClick={() => add(s)}>
            + {s}
          </button>
        ))}
      </div>
      <span className="hint">ENTER / 逗号 添加 · 退格删最后一个 · {tags.length}/{MAX_TAGS}</span>
    </div>
  )
}
