import { useState } from 'react'

const CARDS = [
  { no: 'TR-401', from: 'PEK', to: 'LAX', cls: 'a' },
  { no: 'TR-405', from: 'SHA', to: 'SIN', cls: 'b' },
  { no: 'TR-412', from: 'CAN', to: 'NRT', cls: 'c' },
]

/** 卡片堆叠切换（C-29，Bencho Card Swap 风格）：点击轮转，弹性换位 */
export default function CardSwap() {
  const [order, setOrder] = useState([0, 1, 2]) /* index → 卡片 */

  const advance = () => setOrder(([a, b, c]) => [b, c, a])

  return (
    <div className="cs">
      <div className="cs-stage">
        {CARDS.map((card, i) => {
          const pos = order.indexOf(i)
          return (
            <button
              key={card.no}
              className={`cs-card ${card.cls}`}
              style={{
                transform: `translate(-50%, calc(-50% + ${pos * 16}px)) scale(${1 - pos * 0.06}) rotate(${pos === 0 ? 0 : pos === 1 ? 3 : -4}deg)`,
                zIndex: 10 - pos,
              }}
              onClick={advance}
              aria-label={`${card.no} ${card.from} 到 ${card.to}，点击切换`}
            >
              <span className="cs-no mono">{card.no}</span>
              <span className="cs-route cond">
                {card.from} <i>✈&#xFE0E;</i> {card.to}
              </span>
              <span className="cs-tag mono">BOARDING PASS</span>
            </button>
          )
        })}
      </div>
      <button className="btn" onClick={advance}>
        下一张 NEXT
      </button>
      <span className="hint">点击卡片或按钮 · 堆底卡片轮转到最前</span>
    </div>
  )
}
