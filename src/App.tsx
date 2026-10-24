import { useCallback, useEffect, useState, lazy, Suspense, type ReactNode } from 'react'
import { COMPONENTS, INSTALL_CMD, type CompMeta } from './lib/data'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import CompSection from './components/CompSection'
import Odometer from './components/Odometer'
import Marquee from './components/Marquee'
import OtpInput from './components/OtpInput'
import Stepper from './components/Stepper'
import Segmented from './components/Segmented'
import PaletteCard from './components/PaletteCard'
import CopyButton from './components/CopyButton'
import ThemeSwitch from './components/ThemeSwitch'
import HoldToBoard from './components/HoldToBoard'
import BoardingPass from './components/BoardingPass'
import CommandPalette, { usePaletteHotkey } from './components/CommandPalette'
import ComponentViewer from './components/ComponentViewer'

/* 新增组件代码分割：独立 chunk 在主包解析后异步加载，不阻塞首屏渲染 */
const SeatMap = lazy(() => import('./components/SeatMap'))
const Autocomplete = lazy(() => import('./components/Autocomplete'))
const DetentDrawer = lazy(() => import('./components/DetentDrawer'))
const RotaryKnob = lazy(() => import('./components/RotaryKnob'))
const SkeletonLoader = lazy(() => import('./components/SkeletonLoader'))
const SlideToConfirm = lazy(() => import('./components/SlideToConfirm'))
const TiltCard = lazy(() => import('./components/TiltCard'))
const EscapeButton = lazy(() => import('./components/EscapeButton'))
const MagnifyingDock = lazy(() => import('./components/MagnifyingDock'))
const ReactionBurst = lazy(() => import('./components/ReactionBurst'))
const RangeSlider = lazy(() => import('./components/RangeSlider'))
const ProgressSteps = lazy(() => import('./components/ProgressSteps'))
const Accordion = lazy(() => import('./components/Accordion'))
const TagInput = lazy(() => import('./components/TagInput'))
const UploadDropzone = lazy(() => import('./components/UploadDropzone'))
const TextScramble = lazy(() => import('./components/TextScramble'))
const StarRating = lazy(() => import('./components/StarRating'))
const Checklist = lazy(() => import('./components/Checklist'))
const SpotlightCard = lazy(() => import('./components/SpotlightCard'))
const CardSwap = lazy(() => import('./components/CardSwap'))
const TimeScrubber = lazy(() => import('./components/TimeScrubber'))
const DestCarousel = lazy(() => import('./components/DestCarousel'))

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<span className="hint">LOADING…</span>}>{children}</Suspense>
)

const SECTIONS = COMPONENTS.filter((c): c is CompMeta & { id: string } => !!c.id)

const viewFromURL = () => {
  const v = new URLSearchParams(location.search).get('view')
  return v && SECTIONS.some(s => s.id === v) ? v : null
}

export default function App() {
  /* view = null 总览模式；view = 组件 id 聚焦模式（URL ?view= 同步，可分享/后退） */
  const [view, setView] = useState<string | null>(viewFromURL)
  const [spyId, setSpyId] = useState('c00')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  usePaletteHotkey(paletteOpen, openPalette, closePalette)

  useEffect(() => {
    const onPop = () => setView(viewFromURL())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openView = useCallback((id: string | null) => {
    setView(id)
    const url = new URL(location.href)
    if (id) url.searchParams.set('view', id)
    else url.searchParams.delete('view')
    url.hash = ''
    history.pushState({}, '', url)
    window.scrollTo(0, 0)
  }, [])

  /* scrollspy：仅总览模式滚动时同步侧边栏高亮 */
  useEffect(() => {
    if (view) return
    const sections = SECTIONS.map(s => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    if (!sections.length) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) setSpyId(en.target.id)
        })
      },
      { rootMargin: '-18% 0px -68% 0px' },
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [view])

  const randomFlip = useCallback(() => {
    window.dispatchEvent(new CustomEvent('terminal:flip-random'))
  }, [])

  const bodies: Record<string, ReactNode> = {
    c01: <Odometer />,
    c02: <Marquee />,
    c03: <OtpInput />,
    c04: <Stepper />,
    c05: <Segmented />,
    c06: <PaletteCard onOpen={openPalette} />,
    c07: (
      <>
        <div className="cmd-box">
          <code>{INSTALL_CMD}</code>
        </div>
        <CopyButton cmd={INSTALL_CMD} />
        <span className="hint">写入剪贴板后图标与文案一起切换</span>
      </>
    ),
    c08: <ThemeSwitch />,
    c09: <HoldToBoard />,
    c10: <Lazy><SeatMap /></Lazy>,
    c11: <Lazy><Autocomplete /></Lazy>,
    c12: <Lazy><DetentDrawer /></Lazy>,
    c13: <Lazy><RotaryKnob /></Lazy>,
    c14: <Lazy><SkeletonLoader /></Lazy>,
    c15: <Lazy><SlideToConfirm /></Lazy>,
    c16: <Lazy><TiltCard /></Lazy>,
    c17: <Lazy><EscapeButton /></Lazy>,
    c18: <Lazy><MagnifyingDock /></Lazy>,
    c19: <Lazy><ReactionBurst /></Lazy>,
    c20: <Lazy><RangeSlider /></Lazy>,
    c21: <Lazy><ProgressSteps /></Lazy>,
    c22: <Lazy><Accordion /></Lazy>,
    c23: <Lazy><TagInput /></Lazy>,
    c24: <Lazy><UploadDropzone /></Lazy>,
    c25: <Lazy><TextScramble /></Lazy>,
    c26: <Lazy><StarRating /></Lazy>,
    c27: <Lazy><Checklist /></Lazy>,
    c28: <Lazy><SpotlightCard /></Lazy>,
    c29: <Lazy><CardSwap /></Lazy>,
    c30: <Lazy><TimeScrubber /></Lazy>,
    c31: <Lazy><DestCarousel /></Lazy>,
  }

  const renderComp = (c: CompMeta & { id: string }) => (
    <CompSection
      key={c.id}
      id={c.id}
      tag={`${c.id.replace('c', 'C-')} · ${c.gate[0] + c.gate.slice(1).toLowerCase()} · ${c.no}`}
      title={c.en}
      cn={c.cn}
      st={c.st === 'BOARDING' ? 'BOARDING' : 'ON TIME'}
      prompt={c.prompt}
      demoStyle={c.id === 'c09' ? { minHeight: 260 } : undefined}
      className={c.id === 'c02' ? 'mq-comp' : undefined}
      footer={FOOTERS[c.id]}
    >
      {bodies[c.id]}
    </CompSection>
  )

  const idx = view ? SECTIONS.findIndex(s => s.id === view) : -1
  const cur = idx >= 0 ? SECTIONS[idx] : null

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-noise" />

      <Header onOpenPalette={openPalette} onGoto={openView} />

      <div className="layout">
        <Sidebar activeId={view ?? spyId} onNavigate={openView} onOpenOverview={() => openView(null)} overview={!view} />

        <main className="content">
          {/* 聚焦模式：组件呈现在全局浮动查看器中，背后不挂载总览，保持单组件开销 */}
          {!cur && (
            <>
              <Hero onGoto={openView} onOpenPalette={openPalette} />
              {SECTIONS.filter(s => s.id !== 'c00').map(s => renderComp(s))}
              <BoardingPass onGoto={openView} />
            </>
          )}
        </main>
      </div>

      {cur && (
        <ComponentViewer id={cur.id} onClose={() => openView(null)} onSwitch={openView}>
          {cur.id === 'c00' ? (
            <Hero onGoto={openView} onOpenPalette={openPalette} />
          ) : (
            renderComp(cur)
          )}
        </ComponentViewer>
      )}

      <CommandPalette open={paletteOpen} onClose={closePalette} onNavigate={openView} onRandomFlip={randomFlip} />
    </>
  )
}

const FOOTERS: Record<string, ReactNode> = {
  c01: <>每位数字一根「字轴」，<code>transform: translateY</code> 垂直滚动，逐位错峰到位。</>,
  c02: <>内容复制两份，<code>translateX(-50%)</code> 无限循环；两侧用 mask 淡出。</>,
  c03: <>自动跳格、退格回跳、整段粘贴分发、填满即校验，<code>inputmode=numeric</code> 唤起数字键盘。</>,
  c04: <>长按 420ms 后进入连发模式；数值变化带 <code>pop</code> 弹跳反馈。</>,
  c05: <>滑块用 <code>translateX</code> 弹性跟随 —— 这个控件真的连着顶部的翻牌大屏，试试切换。</>,
  c06: <>真实的模糊搜索 + 键盘导航，可以直达任意组件、切换主题、随机翻一句话。整个页面都可以被它指挥。</>,
  c07: <><code>navigator.clipboard</code> 优先，环境不支持时自动回退到 <code>execCommand</code>。</>,
  c08: <>这不是装饰品 —— 它真的在切换整个页面的昼夜模式。白天是「纸质登机牌」，夜里是「航站楼」。</>,
  c09: <>rAF 驱动的进度环：按住充能、松手回弹、充满即放行一架飞机。来自 Reaction Arc 的长按变体。</>,
  c10: <>7×5 座舱网格：可选 / 已选 / 占用 / 尊享四种状态，超过 3 座会礼貌拒绝。</>,
  c11: <>26 座机场的模糊过滤（代码 / 城市 / 英文名），键盘导航 + 防失焦的 <code>onMouseDown</code> 选中。</>,
  c12: <>三个卡点、越界橡皮筋、快甩跨卡点吸附 —— 原 TR-111 预告组件，今日正式登机。</>,
  c13: <>atan2 环形拖拽换算角度，只在整数变化时 setState；旋钮本体用 ref 直写 transform。</>,
  c14: <>微光扫过占位块（300% 背景位移动画），内容到位后淡入上浮。</>,
  c15: <>把飞机推过 85% 才放行，跑道灯随进度点亮；中途松手弹性回位。</>,
  c16: <>指针位置换算 <code>rotateX/rotateY</code>，高光用 CSS 变量 <code>--gx/--gy</code> 跟随；全程 ref 直写，零重渲染。</>,
  c17: <>指针一靠近就躲，躲满 5 次累瘫任点；键盘用户可直接 Tab + Enter 抓住它。</>,
  c18: <>按指针距离衰减放大（macOS Dock 手感），rAF 批量直写 transform。</>,
  c19: <>每次点击一簇随机角度的粒子，飞行终点由 CSS 变量 <code>--tx/--ty</code> 注入。</>,
  c20: <>自定义轨道 + 琥珀渐变填充 + 拖拽数值气泡；方向键、HOME/END 全键盘可达。</>,
  c21: <>连接线按进度「注液」展开（scaleX + transform-origin: left），完成步打勾、当前步脉冲。</>,
  c22: <>用 <code>grid-template-rows: 0fr → 1fr</code> 实现高度展开动画（Magic UI 同款手法），单开模式。</>,
  c23: <>回车 / 逗号提交、空输入退格删最后一个、去重 + 上限校验，芯片带入场动画。</>,
  c24: <>拖入高亮 + 文件芯片列表（参考 Magic UI FileUpload）。纯前端演示，不真正上传。</>,
  c25: <>随机字形逐位定格成目标短语（ReactBits Decode Text 同款效果），rAF 驱动、离屏自动暂停。</>,
  c26: <>悬停预览、点击确认，选中星带回弹与辉光；方向键可调（Bencho Rating 风格）。</>,
  c27: <>对勾描画 + 文字划除双动画，进度条实时填充，集齐庆祝（Bencho Checklist 风格）。</>,
  c28: <>边框光晕由 <code>--gx/--gy</code> 驱动跟随指针，悬停亮起（Magic UI Spotlight 同款手法）。</>,
  c29: <>三张登机牌堆叠轮转，弹性 transform 换位（Bencho Card Swap 风格）。</>,
  c30: <>四航段时间轴 + 可拖飞机指针，实时换算 T+ 时间并高亮当前航段。</>,
  c31: <><code>scroll-snap</code> 吸附 + 指针拖拽 + 按钮翻页，圆点指示器随滚动联动。</>,
}
