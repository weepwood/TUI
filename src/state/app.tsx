import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/* ---------- 主题 ---------- */
type Theme = 'night' | 'day'
interface ThemeCtx {
  theme: Theme
  toggle: () => void
}
const ThemeContext = createContext<ThemeCtx>({ theme: 'night', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('night')
  const toggle = useCallback(() => {
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
  return (
    <ToastContext.Provider value={{ toast }}>
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
