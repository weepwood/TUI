import { useCallback, useEffect, useState, lazy, Suspense } from 'react'
import { COMPONENTS, INSTALL_CMD } from './lib/data'
import { gotoComponent, nav, scrollToEl } from './lib/scroll'
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

export default function App() {
  const [activeId, setActiveId] = useState('c00')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  usePaletteHotkey(paletteOpen, openPalette, closePalette)

  /* 统一导航：立即高亮 + 平滑滚动 + 结束后按实际位置校准 */
  const navigate = useCallback((id: string) => {
    setActiveId(id)
    const after = (sec: string) => setActiveId(sec)
    if (id === 'about') {
      const el = document.getElementById('about')
      if (el) scrollToEl(el, after)
      history.replaceState(null, '', '#about')
    } else {
      gotoComponent(id, after)
    }
  }, [])

  /* scrollspy：滚动时同步侧边栏高亮（程序化滚动期间由 nav.lock 冻结） */
  useEffect(() => {
    const sections = COMPONENTS.filter(c => c.id)
      .map(c => document.getElementById(c.id!))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      entries => {
        if (nav.lock) return
        entries.forEach(en => {
          if (en.isIntersecting) setActiveId(en.target.id)
        })
      },
      { rootMargin: '-18% 0px -68% 0px' },
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  const randomFlip = useCallback(() => {
    window.dispatchEvent(new CustomEvent('terminal:flip-random'))
  }, [])

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-noise" />

      <Header onOpenPalette={openPalette} onGoto={navigate} />

      <div className="layout">
        <Sidebar activeId={activeId} onNavigate={navigate} />

        <main className="content">
          <Hero onGoto={navigate} onOpenPalette={openPalette} />

          <CompSection
            id="c01"
            tag="C-01 · Text · TR-102"
            title="Odometer"
            cn="里程表"
            st="ON TIME"
            footer={
              <>
                每位数字一根「字轴」，<code>transform: translateY</code> 垂直滚动，逐位错峰到位。
              </>
            }
          >
            <Odometer />
          </CompSection>

          <CompSection
            id="c02"
            tag="C-02 · Text · TR-103"
            title="Marquee"
            cn="跑马灯"
            st="ON TIME"
            className="mq-comp"
            footer={
              <>
                内容复制两份，<code>translateX(-50%)</code> 无限循环；两侧用 mask 淡出。
              </>
            }
          >
            <Marquee />
            <span className="hint mq-hint">双行反向 · HOVER 暂停 · 无缝循环</span>
          </CompSection>

          <CompSection
            id="c03"
            tag="C-03 · Input · TR-104"
            title="OTP Input"
            cn="验证码输入"
            st="BOARDING"
            footer={
              <>
                自动跳格、退格回跳、整段粘贴分发、填满即校验，<code>inputmode=numeric</code> 唤起数字键盘。
              </>
            }
          >
            <OtpInput />
          </CompSection>

          <CompSection
            id="c04"
            tag="C-04 · Input · TR-105"
            title="Number Stepper"
            cn="数字步进器"
            st="ON TIME"
            footer={
              <>
                长按 420ms 后进入连发模式；数值变化带 <code>pop</code> 弹跳反馈。
              </>
            }
          >
            <Stepper />
          </CompSection>

          <CompSection
            id="c05"
            tag="C-05 · Input · TR-106"
            title="Segmented Control"
            cn="分段控制"
            st="BOARDING"
            footer={
              <>
                滑块用 <code>translateX</code> 弹性跟随 —— 这个控件真的连着顶部的翻牌大屏，试试切换。
              </>
            }
          >
            <Segmented />
          </CompSection>

          <CompSection
            id="c06"
            tag="C-06 · Input · TR-107"
            title="Command Palette"
            cn="指令面板"
            st="BOARDING"
            footer={<>真实的模糊搜索 + 键盘导航，可以直达任意组件、切换主题、随机翻一句话。整个页面都可以被它指挥。</>}
          >
            <PaletteCard onOpen={openPalette} />
          </CompSection>

          <CompSection
            id="c07"
            tag="C-07 · Feedback · TR-108"
            title="Copy Button"
            cn="复制按钮"
            st="ON TIME"
            footer={
              <>
                <code>navigator.clipboard</code> 优先，环境不支持时自动回退到 <code>execCommand</code>。
              </>
            }
          >
            <div className="cmd-box">
              <code>{INSTALL_CMD}</code>
            </div>
            <CopyButton cmd={INSTALL_CMD} />
            <span className="hint">写入剪贴板后图标与文案一起切换</span>
          </CompSection>

          <CompSection
            id="c08"
            tag="C-08 · Feedback · TR-109"
            title="Theme Switch"
            cn="主题开关"
            st="BOARDING"
            footer={<>这不是装饰品 —— 它真的在切换整个页面的昼夜模式。白天是「纸质登机牌」，夜里是「航站楼」。</>}
          >
            <ThemeSwitch />
          </CompSection>

          <CompSection
            id="c09"
            tag="C-09 · Motion · TR-110"
            title="Hold To Board"
            cn="长按登机"
            st="ON TIME"
            demoStyle={{ minHeight: 260 }}
            footer={<>rAF 驱动的进度环：按住充能、松手回弹、充满即放行一架飞机。来自 Reaction Arc 的长按变体。</>}
          >
            <HoldToBoard />
          </CompSection>

          <CompSection
            id="c10"
            tag="C-10 · Input · TR-113"
            title="Seat Map"
            cn="座位图"
            st="ON TIME"
            footer={<>7×5 座舱网格：可选 / 已选 / 占用 / 尊享四种状态，超过 3 座会礼貌拒绝。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <SeatMap />
            </Suspense>
          </CompSection>

          <CompSection
            id="c11"
            tag="C-11 · Input · TR-114"
            title="Airport Lookup"
            cn="机场联想输入"
            st="BOARDING"
            footer={
              <>
                26 座机场的模糊过滤（代码 / 城市 / 英文名），键盘导航 + 防失焦的 <code>onMouseDown</code> 选中。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <Autocomplete />
            </Suspense>
          </CompSection>

          <CompSection
            id="c12"
            tag="C-12 · Motion · TR-115"
            title="Detent Drawer"
            cn="阻尼抽屉"
            st="BOARDING"
            demoStyle={{ minHeight: 320 }}
            footer={
              <>
                三个卡点、越界橡皮筋、快甩跨卡点吸附 —— 原 TR-111 预告组件，今日正式登机。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <DetentDrawer />
            </Suspense>
          </CompSection>

          <CompSection
            id="c13"
            tag="C-13 · Motion · TR-116"
            title="Rotary Knob"
            cn="旋转旋钮"
            st="ON TIME"
            footer={<>atan2 环形拖拽换算角度，只在整数变化时 setState；旋钮本体用 ref 直写 transform。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <RotaryKnob />
            </Suspense>
          </CompSection>

          <CompSection
            id="c14"
            tag="C-14 · Feedback · TR-117"
            title="Skeleton Loader"
            cn="骨架屏"
            st="ON TIME"
            footer={<>微光扫过占位块（300% 背景位移动画），内容到位后淡入上浮。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <SkeletonLoader />
            </Suspense>
          </CompSection>

          <CompSection
            id="c15"
            tag="C-15 · Feedback · TR-119"
            title="Slide to Confirm"
            cn="滑动确认"
            st="BOARDING"
            footer={<>把飞机推过 85% 才放行，跑道灯随进度点亮；中途松手弹性回位。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <SlideToConfirm />
            </Suspense>
          </CompSection>

          <CompSection
            id="c16"
            tag="C-16 · Motion · TR-120"
            title="Tilt Card"
            cn="倾斜卡片"
            st="ON TIME"
            footer={
              <>
                指针位置换算 <code>rotateX/rotateY</code>，高光用 CSS 变量 <code>--gx/--gy</code> 跟随；全程 ref 直写，零重渲染。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <TiltCard />
            </Suspense>
          </CompSection>

          <CompSection
            id="c17"
            tag="C-17 · Motion · TR-121"
            title="Escape Button"
            cn="逃跑按钮"
            st="ON TIME"
            footer={<>指针一靠近就躲，躲满 5 次累瘫任点；键盘用户可直接 Tab + Enter 抓住它。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <EscapeButton />
            </Suspense>
          </CompSection>

          <CompSection
            id="c18"
            tag="C-18 · Motion · TR-122"
            title="Magnifying Dock"
            cn="放大坞栏"
            st="BOARDING"
            footer={<>按指针距离衰减放大（macOS Dock 手感），rAF 批量直写 transform。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <MagnifyingDock />
            </Suspense>
          </CompSection>

          <CompSection
            id="c19"
            tag="C-19 · Feedback · TR-123"
            title="Reaction Burst"
            cn="点赞爆裂"
            st="ON TIME"
            footer={<>每次点击一簇随机角度的粒子，飞行终点由 CSS 变量 <code>--tx/--ty</code> 注入。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <ReactionBurst />
            </Suspense>
          </CompSection>

          <CompSection
            id="c20"
            tag="C-20 · Input · TR-124"
            title="Range Slider"
            cn="滑杆"
            st="ON TIME"
            footer={<>自定义轨道 + 琥珀渐变填充 + 拖拽数值气泡；方向键、HOME/END 全键盘可达。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <RangeSlider />
            </Suspense>
          </CompSection>

          <CompSection
            id="c21"
            tag="C-21 · Motion · TR-125"
            title="Progress Steps"
            cn="登机步骤条"
            st="BOARDING"
            footer={<>连接线按进度「注液」展开（scaleX + transform-origin: left），完成步打勾、当前步脉冲。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <ProgressSteps />
            </Suspense>
          </CompSection>

          <CompSection
            id="c22"
            tag="C-22 · Text · TR-126"
            title="Accordion"
            cn="手风琴"
            st="ON TIME"
            footer={
              <>
                用 <code>grid-template-rows: 0fr → 1fr</code> 实现高度展开动画（Magic UI 同款手法），单开模式。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <Accordion />
            </Suspense>
          </CompSection>

          <CompSection
            id="c23"
            tag="C-23 · Input · TR-127"
            title="Tag Input"
            cn="标签输入"
            st="BOARDING"
            footer={<>回车 / 逗号提交、空输入退格删最后一个、去重 + 上限校验，芯片带入场动画。</>}
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <TagInput />
            </Suspense>
          </CompSection>

          <CompSection
            id="c24"
            tag="C-24 · Input · TR-128"
            title="Upload Dropzone"
            cn="上传区"
            st="ON TIME"
            footer={
              <>
                拖入高亮 + 文件芯片列表（参考 Magic UI FileUpload）。纯前端演示，不真正上传。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <UploadDropzone />
            </Suspense>
          </CompSection>

          <CompSection
            id="c25"
            tag="C-25 · Text · TR-129"
            title="Text Scramble"
            cn="乱码解码"
            st="BOARDING"
            footer={
              <>
                随机字形逐位定格成目标短语（ReactBits Decode Text 同款效果），rAF 驱动、离屏自动暂停。
              </>
            }
          >
            <Suspense fallback={<span className="hint">LOADING…</span>}>
              <TextScramble />
            </Suspense>
          </CompSection>

          <BoardingPass onGoto={navigate} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        onNavigate={navigate}
        onRandomFlip={randomFlip}
      />
    </>
  )
}
