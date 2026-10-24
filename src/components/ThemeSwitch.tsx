import { useTheme } from '../state/app'

/** 主题开关：昼夜双主题的真开关（组件 C-08 本体） */
export default function ThemeSwitch() {
  const { theme, toggle } = useTheme()
  return (
    <div className="tgl-wrap">
      <span className="od-label">Operations Mode · 运行模式</span>
      <button className="tgl" onClick={toggle} aria-label="切换昼夜主题">
        <span className="tgl-knob">
          <svg className="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4" />
          </svg>
          <svg className="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
          </svg>
        </span>
      </button>
      <span className="tgl-label">
        当前 <b>{theme === 'day' ? '日间 DAY' : '夜间 NIGHT'}</b> · 点击切换
      </span>
    </div>
  )
}
