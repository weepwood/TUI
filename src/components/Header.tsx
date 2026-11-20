import { useTheme } from '../state/app'
import Clock from './Clock'

interface Props {
  onOpenPalette: () => void
  onGoto: (id: string) => void
}

/** 顶栏：品牌 / 关于 / 时钟 / ⌘K / 主题 */
export default function Header({ onOpenPalette, onGoto }: Props) {
  const { toggle, theme } = useTheme()
  return (
    <header>
      <div className="hd">
        <button className="brand" onClick={() => onGoto('c00')} aria-label="打开 UI Playground 首页">
          <span className="mini-flap">U</span>
          <b>UI / PLAYGROUND</b>
          <span className="ver mono">v3.0</span>
        </button>
        <nav className="top">
          <button onClick={() => onGoto('about')}>关于 About</button>
        </nav>
        <span className="hd-clock">
          <Clock />
        </span>
        <button className="kchip" onClick={onOpenPalette} aria-label="打开指令面板">
          搜索 <kbd>⌘K</kbd>
        </button>
        <button
          className="theme-btn"
          onClick={toggle}
          aria-label={theme === 'day' ? '切换到夜间模式' : '切换到日间模式'}
        >
          <svg className="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg className="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
