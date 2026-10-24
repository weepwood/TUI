import { useEffect, useMemo, useRef, useState } from 'react'
import { COMPONENTS, INSTALL_CMD } from '../lib/data'
import { copyText, smoothScrollTo } from '../lib/scroll'
import { useTheme, useToast } from '../state/app'

interface PalItem {
  group: string
  ic: string
  label: string
  en: string
  kw: string
  run: () => void
}

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (id: string) => void
  onRandomFlip: () => void
}

/** 指令面板浮层：模糊搜索 + 键盘导航，指挥整个页面（组件 C-06 本体） */
export default function CommandPalette({ open, onClose, onNavigate, onRandomFlip }: Props) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const { toggle } = useTheme()
  const { toast } = useToast()

  const items = useMemo<PalItem[]>(
    () => [
      ...COMPONENTS.filter(c => c.id).map((c, i) => ({
        group: '跳转 · GOTO',
        ic: 'C' + String(i).padStart(2, '0'),
        label: c.cn,
        en: c.en,
        kw: `${c.en} ${c.cn} ${c.gate} ${c.no}`,
        run: () => onNavigate(c.id!),
      })),
      {
        group: '操作 · ACTIONS',
        ic: 'TH',
        label: '切换昼夜主题',
        en: 'THEME',
        kw: 'theme 主题 昼夜 day night 切换',
        run: toggle,
      },
      {
        group: '操作 · ACTIONS',
        ic: 'CP',
        label: '复制安装命令',
        en: 'COPY',
        kw: 'copy 复制 install 安装 命令 npm npx',
        run: () => {
          copyText(INSTALL_CMD).then(ok => ok && toast('命令已复制到剪贴板', 'ok'))
        },
      },
      {
        group: '操作 · ACTIONS',
        ic: 'FL',
        label: '随机翻一句话',
        en: 'RANDOM',
        kw: 'random 随机 翻牌 flip phrase 短语',
        run: () => {
          onRandomFlip()
          toast('大屏已重新翻牌')
        },
      },
      {
        group: '操作 · ACTIONS',
        ic: 'TOP',
        label: '回到顶部',
        en: 'TOP',
        kw: 'top 顶部 回到 首页 scroll',
        run: () => smoothScrollTo(0),
      },
    ],
    [onNavigate, onRandomFlip, toggle, toast],
  )

  const results = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return items
      .filter(it => {
        const hay = (it.label + it.en + ' ' + it.kw).toLowerCase()
        return tokens.every(t => hay.includes(t))
      })
      .slice(0, 14)
  }, [items, query])

  useEffect(() => {
    setSel(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSel(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const move = (d: number) => {
    if (!results.length) return
    setSel(s => (s + d + results.length) % results.length)
  }

  /* 滚动选中项进入可视区 */
  useEffect(() => {
    listRef.current?.querySelector('.pal-item.sel')?.scrollIntoView({ block: 'nearest' })
  }, [sel, results])

  const runItem = (it?: PalItem) => {
    if (!it) return
    onClose()
    setTimeout(it.run, 90)
  }

  if (!open) return null

  return (
    <div
      className="pal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="指令面板"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="pal-panel">
        <div className="pal-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="palInput"
            ref={inputRef}
            placeholder="输入关键词，或直接回车……"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              else if (e.key === 'ArrowDown') {
                e.preventDefault()
                move(1)
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                move(-1)
              } else if (e.key === 'Enter') {
                e.preventDefault()
                runItem(results[sel])
              }
            }}
          />
          <span className="pal-esc">ESC</span>
        </div>
        <div className="pal-list" ref={listRef}>
          {results.length === 0 ? (
            <div className="pal-empty">没有匹配的航班 —— 换个关键词试试</div>
          ) : (
            (() => {
              let lastGroup = ''
              return results.map((it, i) => {
                const nodes = []
                if (it.group !== lastGroup) {
                  nodes.push(
                    <div className="pal-group" key={`g-${it.group}`}>
                      {it.group}
                    </div>,
                  )
                  lastGroup = it.group
                }
                nodes.push(
                  <button
                    key={`${it.group}-${it.label}`}
                    className={`pal-item${i === sel ? ' sel' : ''}`}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => runItem(it)}
                  >
                    <span className="ic">{it.ic}</span>
                    <span className="lb">
                      {it.label}
                      <small>{it.en}</small>
                    </span>
                    <span className="go">{it.group.startsWith('跳转') ? 'GOTO →' : 'RUN ↵'}</span>
                  </button>,
                )
                return nodes
              })
            })()
          )}
        </div>
        <div className="pal-ft">
          <span>
            <b>↑↓</b>选择
          </span>
          <span>
            <b>↵</b>执行
          </span>
          <span>
            <b>ESC</b>关闭
          </span>
        </div>
      </div>
    </div>
  )
}

/** 快捷键 ⌘K / Ctrl+K 的全局监听（挂在 App 层更合适，这里导出工具） */
export function usePaletteHotkey(open: boolean, onOpen: () => void, onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        open ? onClose() : onOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpen, onClose])
}
