import { useMemo, useRef, useState } from 'react'

interface Airport {
  code: string
  city: string
  name: string
}

const AIRPORTS: Airport[] = [
  { code: 'PEK', city: '北京首都', name: 'Capital' },
  { code: 'PKX', city: '北京大兴', name: 'Daxing' },
  { code: 'SHA', city: '上海虹桥', name: 'Hongqiao' },
  { code: 'PVG', city: '上海浦东', name: 'Pudong' },
  { code: 'CAN', city: '广州白云', name: 'Baiyun' },
  { code: 'SZX', city: '深圳宝安', name: 'Baoan' },
  { code: 'CTU', city: '成都天府', name: 'Tianfu' },
  { code: 'CKG', city: '重庆江北', name: 'Jiangbei' },
  { code: 'HGH', city: '杭州萧山', name: 'Xiaoshan' },
  { code: 'NKG', city: '南京禄口', name: 'Lukou' },
  { code: 'XIY', city: '西安咸阳', name: 'Xianyang' },
  { code: 'KMG', city: '昆明长水', name: 'Changshui' },
  { code: 'HKG', city: '香港国际', name: 'International' },
  { code: 'TPE', city: '台北桃园', name: 'Taoyuan' },
  { code: 'NRT', city: '东京成田', name: 'Narita' },
  { code: 'HND', city: '东京羽田', name: 'Haneda' },
  { code: 'ICN', city: '首尔仁川', name: 'Incheon' },
  { code: 'SIN', city: '新加坡樟宜', name: 'Changi' },
  { code: 'BKK', city: '曼谷素万那普', name: 'Suvarnabhumi' },
  { code: 'LAX', city: '洛杉矶', name: 'Los Angeles' },
  { code: 'SFO', city: '旧金山', name: 'San Francisco' },
  { code: 'JFK', city: '纽约肯尼迪', name: 'John F. Kennedy' },
  { code: 'LHR', city: '伦敦希思罗', name: 'Heathrow' },
  { code: 'CDG', city: '巴黎戴高乐', name: 'Charles de Gaulle' },
  { code: 'FRA', city: '法兰克福', name: 'Frankfurt' },
]

/** 机场联想输入（C-11）：模糊过滤 + 键盘导航 + 选中回显 */
export default function Autocomplete() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState(0)
  const [chosen, setChosen] = useState<Airport | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return AIRPORTS.slice(0, 6)
    return AIRPORTS.filter(
      a =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    ).slice(0, 7)
  }, [query])

  const pick = (a: Airport) => {
    setChosen(a)
    setQuery(a.code)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setSel(s => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && open && results[sel]) {
      e.preventDefault()
      pick(results[sel])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="ac" ref={rootRef}>
      <span className="od-label">Destination · 目的地机场</span>
      <div className="ac-box">
        <input
          className="ac-input"
          placeholder="输入代码 / 城市，如 PEK 或 东京"
          aria-label="机场搜索"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setOpen(true)
            setSel(0)
            setChosen(null)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {chosen && (
          <span className="ac-chosen">
            ✈&#xFE0E; {chosen.code} · {chosen.city}
          </span>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="ac-list" role="listbox" aria-label="机场候选">
          {results.map((a, i) => (
            <button
              key={a.code}
              className={`ac-item${i === sel ? ' sel' : ''}`}
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onMouseDown={e => {
                e.preventDefault() // 防止 input 失焦先触发 blur
                pick(a)
              }}
            >
              <span className="ac-code">{a.code}</span>
              <span className="ac-city">{a.city}</span>
              <small>{a.name}</small>
            </button>
          ))}
        </div>
      )}
      {open && results.length === 0 && query.trim() !== '' && (
        <div className="ac-list">
          <div className="ac-empty">没有匹配的机场 —— 试试 PEK / 东京 / LHR</div>
        </div>
      )}
      <span className="hint">↑↓ 选择 · ENTER 确认 · ESC 收起</span>
    </div>
  )
}
