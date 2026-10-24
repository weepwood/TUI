import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react'

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  text: string
  copiedLabel?: string
  onCopy?: () => void
  onCopyError?: (error: unknown) => void
}

export function CopyButton({
  text, children = '复制', copiedLabel = '已复制', onCopy, onCopyError, disabled,
  className = '', ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current) }, [])

  const copy = async () => {
    if (busy || disabled) return
    setBusy(true)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable')
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      onCopyError?.(error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      {...props}
      type="button"
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={['tui-copy', copied && 'is-copied', className].filter(Boolean).join(' ')}
      onClick={copy}
    >
      <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
      <span aria-live="polite">{copied ? copiedLabel : children}</span>
    </button>
  )
}
