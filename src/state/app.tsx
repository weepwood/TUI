import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/* ---------- 主题 ---------- */
type Theme = 'night' | 'day'
interface ThemeCtx {
  theme: Theme
  toggle: () => void
}
const ThemeContext = createContext<ThemeCtx>({ theme: 'night', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: { children: ReactNode }) {
  /* 初始值来自 index.html 内联脚本按系统外观写入的 data-theme */
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || 'night')
  const [userPicked, setUserPicked] = useState(false)

  /* 系统切换深浅色时实时跟随，用户手动选过一次后尊重手动选择 */
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      if (userPicked) return
      const next: Theme = mq.matches ? 'day' : 'night'
      setTheme(next)
      document.documentElement.dataset.theme = next
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [userPicked])

  const toggle = useCallback(() => {
    setUserPicked(true)
    setTheme(t => {
      const next = t === 'day' ? 'night' : 'day'
      document.documentElement.dataset.theme = next
      return next
    })
  }, [])
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

/* ---------- Toast ---------- */
export type ToastType = '' | 'ok' | 'err'
interface ToastItem {
  id: number
  msg: string
  type: ToastType
  leaving: boolean
}
interface ToastCtx {
  toast: (msg: string, type?: ToastType) => void
}
const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

let toastSeq = 0

function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const toast = useCallback((msg: string, type: ToastType = '') => {
    const id = ++toastSeq
    setItems(list => [...list, { id, msg, type, leaving: false }])
    setTimeout(() => {
      setItems(list => list.map(t => (t.id === id ? { ...t, leaving: true } : t)))
      setTimeout(() => setItems(list => list.filter(t => t.id !== id)), 320)
    }, 2300)
  }, [])
  /* 固定上下文值：toast 回调稳定，弹 toast / 消失时不再重渲染全部消费者 */
  const value = useMemo(() => ({ toast }), [toast])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map(t => (
          <div key={t.id} className={`toast ${t.type}${t.leaving ? ' out' : ''}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
