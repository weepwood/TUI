import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}
export interface TabsProps {
  items: readonly TabItem[]
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

/** Roving tabindex, keyboard navigation, and an associated labelled tabpanel. */
export function Tabs({ items, label, value, defaultValue, onValueChange, className = '' }: TabsProps) {
  const [local, setLocal] = useState(() => defaultValue ?? items.find(item => !item.disabled)?.id ?? '')
  const selected = value === undefined ? local : value
  const chosen = items.find(item => item.id === selected && !item.disabled)
  const active = chosen?.id ?? items.find(item => !item.disabled)?.id ?? ''
  const groupId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const choose = (id: string) => {
    if (id === active) return
    if (value === undefined) setLocal(id)
    onValueChange?.(id)
  }
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const allowed = items.map((item, n) => !item.disabled ? n : -1).filter(n => n >= 0)
    if (!allowed.length) return
    const current = allowed.indexOf(index)
    const target = event.key === 'Home' ? allowed[0] :
      event.key === 'End' ? allowed[allowed.length - 1] :
      allowed[(current + (event.key === 'ArrowRight' ? 1 : -1) + allowed.length) % allowed.length]
    choose(items[target].id)
    refs.current[target]?.focus()
  }
  return (
    <div className={['tui-tabs', className].filter(Boolean).join(' ')}>
      <div className="tui-tabs__list" role="tablist" aria-label={label} aria-orientation="horizontal">
        {items.map((item, index) => (
          <button
            key={item.id}
            id={groupId + '-tab-' + index}
            ref={node => { refs.current[index] = node }}
            type="button"
            role="tab"
            aria-controls={groupId + '-panel-' + index}
            aria-selected={item.id === active}
            tabIndex={item.id === active && !item.disabled ? 0 : -1}
            disabled={item.disabled}
            onClick={() => choose(item.id)}
            onKeyDown={event => keyDown(event, index)}
            className={item.id === active ? 'tui-tabs__tab is-active' : 'tui-tabs__tab'}
          >{item.label}</button>
        ))}
      </div>
      {items.map((item, index) => (
        <div key={item.id} id={groupId + '-panel-' + index} className="tui-tabs__panel"
          role="tabpanel" aria-labelledby={groupId + '-tab-' + index}
          tabIndex={item.id === active ? 0 : -1} hidden={item.id !== active || item.disabled}>
          {item.id === active && !item.disabled && item.content}
        </div>
      ))}
    </div>
  )
}
