import { useId, useState, type ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  className?: string
}

export function Accordion({ items, value, defaultValue = null, onValueChange, className = '' }: AccordionProps) {
  const [localValue, setLocalValue] = useState<string | null>(defaultValue)
  const selected = value === undefined ? localValue : value
  const instanceId = useId().replace(/:/g, '')
  const toggle = (id: string) => {
    const next = selected === id ? null : id
    if (value === undefined) setLocalValue(next)
    onValueChange?.(next)
  }
  return (
    <div className={['tui-accordion', className].filter(Boolean).join(' ')}>
      {items.map((item, index) => {
        const opened = selected === item.id
        const buttonId = instanceId + '-trigger-' + index
        const panelId = instanceId + '-panel-' + index
        return (
          <div className="tui-accordion__item" key={item.id}>
            <h3 className="tui-accordion__heading">
              <button
                id={buttonId}
                type="button"
                className="tui-accordion__trigger"
                aria-controls={panelId}
                aria-expanded={opened}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span><span className="tui-accordion__icon" aria-hidden="true">{opened ? '−' : '+'}</span>
              </button>
            </h3>
            <div id={panelId} className="tui-accordion__panel" role="region" aria-labelledby={buttonId} hidden={!opened}>
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
