import { useState } from 'react'

const FAQS = [
  {
    q: '随身行李限额是多少？',
    a: '经济舱一件 55×40×23cm、7kg 以内；尊享排可多带一个登机箱。充电宝必须随身携带且 ≤100Wh。',
  },
  {
    q: '转机需要重新办行李直挂吗？',
    a: '同一票号（联程票）默认直挂到最终目的地；分开购买的两段票需要先入境提取、再重新值机托运。',
  },
  {
    q: '延误了有什么补偿？',
    a: '延误 2 小时以上提供餐券；4 小时以上可改签下一班或全额退票，详情见登机口屏幕或询问地服。',
  },
  {
    q: '什么时候开始登机？',
    a: '通常起飞前 40 分钟开启登机口，起飞前 15 分钟关闭。航显板状态变为 BOARDING 时请尽快前往 GATE 24。',
  },
]

/** 手风琴（C-22）：grid-template-rows 0fr→1fr 展开动画（Magic UI 风格），单开模式 + 箭头旋转 */
export default function Accordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="acc">
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={`acc-item${isOpen ? ' open' : ''}`}>
            <button className="acc-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              <span className="acc-idx mono">Q{i + 1}</span>
              <span>{f.q}</span>
              <i className="acc-arrow">＋</i>
            </button>
            <div className="acc-a-wrap">
              <div className="acc-a">
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
