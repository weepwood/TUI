import { memo } from 'react'
import { useReveal } from '../lib/hooks'

interface Props {
  onGoto: (id: string) => void
}

/** 登机牌风格页脚 */
function BoardingPass({ onGoto }: Props) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <footer id="about">
      <div className="pass reveal" ref={ref}>
        <div className="pass-main">
          <div className="pass-l">
            <div className="tag2">Boarding Pass · 登机牌</div>
            <h2>SHIP FASTER, TOGETHER</h2>
            <p>
              TERMINAL/UI 是一组手工打磨的 React 动效组件：翻牌、滚动、充能、弹跳。
              基于 React 18 + TypeScript + Vite，零运行时依赖，复制即用。本页即文档，页面即演示。
            </p>
            <div className="pass-links">
              <button onClick={() => onGoto('c00')}>GITHUB</button>
              <button onClick={() => onGoto('c00')}>RELEASES</button>
              <button onClick={() => onGoto('c01')}>全部组件</button>
              <button onClick={() => onGoto('c06')}>指令面板</button>
            </div>
          </div>
          <div className="pass-r">
            <div className="barcode" aria-hidden="true" />
            <div className="pass-code">TR-2026 · GATE 24 · SEAT 06A</div>
          </div>
        </div>
        <div className="pass-bottom">
          <span>© 2026 TERMINAL/UI · React + TypeScript + Vite 手工打造</span>
          <span>DESIGN THAT DEPARTS · 会起飞的设计</span>
        </div>
      </div>
    </footer>
  )
}

export default memo(BoardingPass)
