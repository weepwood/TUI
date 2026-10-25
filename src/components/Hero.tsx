import { memo, useEffect, useRef, useState } from 'react'
import { CHARSET, COMPONENTS, INSTALL_CMD, PHRASES } from '../lib/data'
import { FlapBoardEngine } from '../lib/flap'
import { REDUCED, copyText } from '../lib/scroll'
import { useToast } from '../state/app'
import CopyButton from './CopyButton'
import Clock from './Clock'

interface Props {
  onGoto: (id: string) => void
  onOpenPalette: () => void
}

/** 英雄区：机械翻牌大屏 + 控制台（组件 C-00 本体） */
function Hero({ onGoto, onOpenPalette }: Props) {
  const rowRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<FlapBoardEngine | null>(null)
  const [input, setInput] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const engine = new FlapBoardEngine(rowRef.current!, REDUCED)
    engineRef.current = engine
    engine.startRotation(PHRASES, 4200)
    /* 滚出视口时停翻，省帧 */
    const io = new IntersectionObserver(([e]) => {
      engine.visible = e.isIntersecting
    })
    io.observe(rowRef.current!)
    /* 速度事件来自「分段控制」组件（C-05），随机翻牌来自指令面板 */
    const onSpeed = (e: Event) => engine.setInterval((e as CustomEvent<number>).detail)
    const onRandom = () => engine.randomFlip()
    window.addEventListener('terminal:speed', onSpeed)
    window.addEventListener('terminal:flip-random', onRandom)
    return () => {
      io.disconnect()
      window.removeEventListener('terminal:speed', onSpeed)
      window.removeEventListener('terminal:flip-random', onRandom)
      engine.destroy()
      /* React 18 卸载时 ref 已被置空，需判空 */
      if (rowRef.current) rowRef.current.innerHTML = ''
    }
  }, [])

  const flip = (phrase: string) => {
    engineRef.current?.poke(phrase)
  }

  const customFlip = () => {
    const v = input.trim()
    if (!v) {
      toast('先输入一个短语，比如 HELLO WORLD')
      return
    }
    const clean = v
      .toUpperCase()
      .replace(new RegExp(`[^${CHARSET.replace('\\', '\\\\')}]`, 'g'), ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (!clean) {
      toast('只支持字母、数字和 - . : / +')
      return
    }
    flip(clean)
  }

  return (
    <section className="hero" id="c00">
      <div className="overline">
        <span className="dot" />
        LIVE · 免费可复制的动效组件
      </div>

      <div className="bezel">
        <div className="bezel-hd">
          <span>SOLARI MODE · MECH FLIP</span>
          <span className="live">
            <span className="rec" />
            LOCAL <Clock />
          </span>
        </div>
        <div className="sf-row" ref={rowRef} aria-label="翻牌屏演示，循环展示短语" />
      </div>

      <div className="sf-console">
        <input
          className="sf-input"
          maxLength={13}
          placeholder="输入短语，让它翻上去"
          aria-label="自定义翻牌短语"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && customFlip()}
        />
        <button className="btn btn-primary" onClick={customFlip}>
          FLIP · 执行
        </button>
        <div className="presets">
          <button className="preset" onClick={() => flip('SHIP FASTER')}>
            SHIP FASTER
          </button>
          <button className="preset" onClick={() => flip('DESIGN SYSTEM')}>
            DESIGN SYSTEM
          </button>
          <button className="preset" onClick={() => flip('GATE 24 OPEN')}>
            GATE 24 OPEN
          </button>
        </div>
      </div>

      <p className="hero-sub">
        这是一个<b>像机场航显板一样翻动</b>的组件展示厅。下面每一个组件，从左侧目录直达，
        全都是<b>可以落地的代码</b> —— 复制、粘贴、起飞。
      </p>
      <div className="hero-cta">
        <button className="btn btn-primary" onClick={() => onGoto('c01')}>
          浏览组件
        </button>
        <button className="btn" onClick={onOpenPalette}>
          ⌘K 指令面板
        </button>
      </div>
      <div className="install">
        <code>
          <b>$</b> {INSTALL_CMD}
        </code>
        <CopyButton cmd={INSTALL_CMD} label="复制" doneLabel="已复制 COPIED" />
        <button
          className="prompt-chip"
          onClick={async () => {
            const ok = await copyText(COMPONENTS[0].prompt)
            toast(ok ? '组件提示词已复制，去喂给 AI 吧' : '复制失败，请手动选择', ok ? 'ok' : 'err')
          }}
        >
          ✦ 提示词
        </button>
      </div>
    </section>
  )
}

export default memo(Hero)
