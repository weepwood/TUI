import { useRef, useState } from 'react'
import { useToast } from '../state/app'

const TAUNTS = ['再试试？', '没抓到～', '快一点！', '就差一点', '累了…']
const MAX_DODGE = 5

/** 逃跑按钮（C-17）：指针靠近就躲，躲满 5 次后累瘫任点（Bencho: Escape Button） */
export default function EscapeButton() {
  const areaRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [dodges, setDodges] = useState(0)
  const [taunt, setTaunt] = useState('想取消航班？先抓住我')
  const { toast } = useToast()

  const dodge = () => {
    const area = areaRef.current
    const btn = btnRef.current
    if (!area || !btn) return
    if (dodges >= MAX_DODGE) return
    const aw = area.clientWidth, ah = area.clientHeight
    const bw = btn.offsetWidth, bh = btn.offsetHeight
    const x = 8 + Math.random() * Math.max(0, aw - bw - 16)
    const y = 8 + Math.random() * Math.max(0, ah - bh - 16)
    btn.style.transform = `translate(${x - aw / 2 + bw / 2}px, ${y - ah / 2 + bh / 2}px)`
    const n = dodges + 1
    setDodges(n)
    setTaunt(n >= MAX_DODGE ? '累了…你点吧' : TAUNTS[n % TAUNTS.length])
  }

  const onClick = () => {
    if (dodges < MAX_DODGE) {
      /* 键盘用户直接点到：也算抓住 */
      toast('抓到了！但航班还是取消了… 才怪')
    } else {
      toast('好吧好吧，我认输 —— 航班继续，重新登机', 'ok')
    }
    setDodges(0)
    setTaunt('想取消航班？先抓住我')
    if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <div className="eb">
      <div className="eb-area" ref={areaRef}>
        <button className="eb-btn" ref={btnRef} onMouseEnter={dodge} onClick={onClick}>
          取消航班 CANCEL
        </button>
      </div>
      <div className="eb-bar">
        <span className="hint">{taunt}</span>
        <span className="eb-count mono">
          DODGE {dodges}/{MAX_DODGE}
        </span>
      </div>
    </div>
  )
}
