import { useRef, useState } from 'react'
import { useToast } from '../state/app'

const LEN = 6
const DEMO = '470916'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/** OTP 验证码输入：自动跳格 / 退格回跳 / 粘贴分发 / 填满校验（组件 C-03 本体） */
export default function OtpInput() {
  const [values, setValues] = useState<string[]>(Array(LEN).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const { toast } = useToast()

  const check = (vals: string[]) => {
    if (vals.every(v => v !== '')) {
      toast('OTP VERIFIED · 验证通过', 'ok')
      return true
    }
    return false
  }

  const setAt = (i: number, v: string) => {
    setValues(prev => {
      const next = [...prev]
      next[i] = v
      check(next)
      return next
    })
  }

  const onInput = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1)
    setAt(i, v)
    if (v && i < LEN - 1) inputsRef.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const digits = (e.clipboardData.getData('text').match(/\d/g) ?? []).slice(0, LEN)
    setValues(prev => {
      const next = [...prev]
      digits.forEach((d, k) => {
        if (k < LEN) next[k] = d
      })
      check(next)
      return next
    })
    inputsRef.current[Math.min(digits.length, LEN - 1)]?.focus()
  }

  const runDemo = async () => {
    setValues(Array(LEN).fill(''))
    inputsRef.current[0]?.focus()
    for (let k = 0; k < DEMO.length; k++) {
      await sleep(150)
      setAt(k, DEMO[k])
      if (k < DEMO.length - 1) inputsRef.current[k + 1]?.focus()
    }
  }

  const full = values.every(v => v !== '')

  return (
    <>
      <div className="otp" onPaste={onPaste}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={el => {
              inputsRef.current[i] = el
            }}
            inputMode="numeric"
            maxLength={1}
            value={v}
            className={v !== '' ? 'full' : ''}
            aria-label={`验证码第 ${i + 1} 位`}
            onChange={e => onInput(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
          />
        ))}
      </div>
      <div className={`otp-ok${full ? ' show' : ''}`}>✓ VERIFIED · 验证通过</div>
      <button className="btn" onClick={runDemo}>
        帮我演示：自动填充
      </button>
    </>
  )
}
