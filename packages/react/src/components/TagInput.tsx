import { useId, useState, type KeyboardEvent } from 'react'

export interface TagInputProps {
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  onError?: (reason: 'duplicate' | 'limit') => void
  maxTags?: number
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagInput({
  value, defaultValue = [], onValueChange, onError, maxTags = 6, label, placeholder = '输入后按 Enter 添加',
  disabled = false, className = '',
}: TagInputProps) {
  const [localValue, setLocalValue] = useState<string[]>(() => [...defaultValue])
  const [draft, setDraft] = useState('')
  const tags = value === undefined ? localValue : value
  const id = useId()
  const publish = (next: string[]) => {
    if (value === undefined) setLocalValue(next)
    onValueChange?.(next)
  }
  const add = (raw: string) => {
    const tag = raw.trim()
    if (!tag || disabled) return
    if (tags.includes(tag)) { onError?.('duplicate'); return }
    if (tags.length >= maxTags) { onError?.('limit'); return }
    publish([...tags, tag])
    setDraft('')
  }
  const remove = (tag: string) => { if (!disabled) publish(tags.filter(item => item !== tag)) }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add(draft)
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  return (
    <div className={['tui-tags', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className="tui-tags__label">{label}</label>
      <div className="tui-tags__box">
        {tags.map(tag => (
          <span className="tui-tags__tag" key={tag}>
            {tag}
            <button type="button" disabled={disabled} aria-label={'移除 ' + tag} onClick={() => remove(tag)}>×</button>
          </span>
        ))}
        <input id={id} disabled={disabled} className="tui-tags__input" value={draft} placeholder={placeholder} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} />
      </div>
      <div className="tui-tags__hint">{tags.length}/{maxTags} · Enter / 逗号添加 · 退格删除</div>
    </div>
  )
}
