import { forwardRef, type HTMLAttributes } from 'react'

export interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  theme?: 'light' | 'dark'
}

export const ThemeScope = forwardRef<HTMLDivElement, ThemeScopeProps>(function ThemeScope(
  { theme = 'dark', className = '', ...props },
  ref,
) {
  return <div {...props} ref={ref} data-tui-theme={theme} className={['tui-theme', className].filter(Boolean).join(' ')} />
})
