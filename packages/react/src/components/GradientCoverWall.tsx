import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'

/** Soft gradient colour families. Custom palettes use the same six CSS tokens. */
export interface GradientCoverPalette {
  top: string
  bottom: string
  orb1: string
  orb2: string
  orb3: string
  orb4: string
}
export const gradientCoverPalettes = {
  sunset: { top: '#b9a6c8', bottom: '#a06766', orb1: '#f6b982', orb2: '#e875a0', orb3: '#a66bc0', orb4: '#ffcf8d' },
  smoky: { top: '#a8b8c5', bottom: '#534443', orb1: '#c2d3db', orb2: '#887b81', orb3: '#4c607d', orb4: '#aa785f' },
  ocean: { top: '#afceda', bottom: '#163954', orb1: '#bbeced', orb2: '#5b9ec2', orb3: '#246a9b', orb4: '#264b80' },
  forest: { top: '#aacad5', bottom: '#224741', orb1: '#b5ddd6', orb2: '#8fbea9', orb3: '#327e6a', orb4: '#154d49' },
  lilac: { top: '#c2aedc', bottom: '#302747', orb1: '#d9b5e2', orb2: '#8068b7', orb3: '#493b8b', orb4: '#aaa3d5' },
  ember: { top: '#b0bfc9', bottom: '#994b45', orb1: '#d9d1c5', orb2: '#b9858c', orb3: '#dc795c', orb4: '#7c5d72' },
} as const satisfies Record<string, GradientCoverPalette>
export type GradientCoverPreset = keyof typeof gradientCoverPalettes
export type GradientCoverPattern = 'rays' | 'contours' | 'waves' | 'dots' | 'lens' | 'none'

export interface GradientCoverCardProps {
  lines: readonly [string, string]
  palette?: GradientCoverPreset | GradientCoverPalette
  pattern?: GradientCoverPattern
  /** Enables ambient drift and cursor interaction. Browser reduced-motion always wins. */
  motion?: boolean
  className?: string
  style?: CSSProperties
}

export interface GradientCoverItem {
  id?: string
  lines: readonly [string, string]
  palette?: GradientCoverPreset | GradientCoverPalette
  pattern?: GradientCoverPattern
}

export const defaultGradientCovers: readonly GradientCoverItem[] = [
  { id: 'daily-poetry', lines: ['DAILY', 'POETRY'], palette: 'sunset', pattern: 'rays' },
  { id: 'after-hours', lines: ['AFTER', 'HOURS'], palette: 'smoky', pattern: 'none' },
  { id: 'deep-blue', lines: ['DEEP', 'BLUE'], palette: 'ocean', pattern: 'contours' },
  { id: 'quiet-garden', lines: ['QUIET', 'GARDEN'], palette: 'forest', pattern: 'waves' },
  { id: 'lilac-night', lines: ['LILAC', 'NIGHT'], palette: 'lilac', pattern: 'dots' },
  { id: 'ember-sky', lines: ['EMBER', 'SKY'], palette: 'ember', pattern: 'lens' },
]

export interface GradientCoverWallProps {
  items?: readonly GradientCoverItem[]
  /** Responsive desktop column count; the layout narrows to two then one column. */
  columns?: 2 | 3 | 4
  motion?: boolean
  label?: string
  className?: string
  style?: CSSProperties
}

/** A shared, physical-pixel 128×128 noise tile. Never generated during SSR. */
let sharedNoiseTile: HTMLCanvasElement | null = null
function noiseTile(): HTMLCanvasElement | null {
  if (sharedNoiseTile) return sharedNoiseTile
  if (typeof document === 'undefined') return null
  const tile = document.createElement('canvas')
  const ctx = tile.getContext('2d', { alpha: false })
  if (!ctx) return null
  tile.width = tile.height = 128
  const bitmap = ctx.createImageData(128, 128)
  const random = new Uint8Array(128 * 128)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(random)
  } else {
    for (let i = 0; i < random.length; i++) random[i] = Math.floor(Math.random() * 256)
  }
  for (let i = 0; i < random.length; i++) {
    const gray = 94 + Math.floor(random[i] * .27)
    const p = i * 4
    bitmap.data[p] = bitmap.data[p + 1] = bitmap.data[p + 2] = gray
    bitmap.data[p + 3] = 255
  }
  ctx.putImageData(bitmap, 0, 0)
  sharedNoiseTile = tile
  return tile
}

/** Paint in physical pixel coordinates; a source noise pixel equals one device pixel. */
export function paintGradientCoverNoise(canvas: HTMLCanvasElement, width: number, height: number, dpr: number): void {
  const tile = noiseTile()
  if (!tile) return
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) return
  const w = Math.max(1, Math.round(width * dpr))
  const h = Math.max(1, Math.round(height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  context.imageSmoothingEnabled = false
  const pattern = context.createPattern(tile, 'repeat')
  if (!pattern) return
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.fillStyle = pattern
  context.fillRect(0, 0, w, h)
}

const STIFFNESS = 70
const DAMPING_RATIO = .86
const DAMPING = 2 * DAMPING_RATIO * Math.sqrt(STIFFNESS)

function Ornament({ kind }: { kind: GradientCoverPattern }) {
  const id = useId().replace(/:/g, '')
  if (kind === 'none') return null
  const lines: ReactNode[] = []
  const paths: ReactNode[] = []
  const dots: ReactNode[] = []
  const ellipses: ReactNode[] = []
  if (kind === 'rays') {
    for (let a = 0; a < 360; a += 9) {
      const t = a * Math.PI / 180
      lines.push(<line key={a} x1={200 + Math.cos(t) * 10} y1={200 + Math.sin(t) * 10}
        x2={200 + Math.cos(t) * 350} y2={200 + Math.sin(t) * 350} />)
    }
  } else if (kind === 'contours') {
    for (let ring = 0; ring < 13; ring++) {
      const radius = 38 + ring * 23
      const d = Array.from({ length: 181 }, (_, step) => {
        const a = step / 180 * Math.PI * 2
        const wobble = Math.sin(a * 5 + ring * .24) * 5 + Math.sin(a * 8 - ring * .35) * 2.5
        return (step ? 'L' : 'M') + (200 + Math.cos(a) * (radius + wobble) * 1.17).toFixed(2)
          + ',' + (200 + Math.sin(a) * (radius + wobble) * .83).toFixed(2)
      }).join(' ')
      paths.push(<path key={ring} d={d} />)
    }
  } else if (kind === 'waves') {
    for (let i = 0; i < 23; i++) {
      const d: string[] = []
      for (let x = -20; x <= 420; x += 4) {
        const y = -30 + i * 21 + Math.sin(x * .027 + i * .26) * (12 + 7 * Math.sin(i * .3))
          + Math.sin(x * .05 + i) * 3
        d.push((x === -20 ? 'M' : 'L') + x + ',' + y.toFixed(2))
      }
      paths.push(<path key={i} d={d.join(' ')} />)
    }
  } else if (kind === 'dots') {
    for (let y = 12; y <= 400; y += 17) {
      for (let x = 12; x <= 400; x += 17) dots.push(<circle key={x + '-' + y} cx={x} cy={y} r={1.05} />)
    }
  } else if (kind === 'lens') {
    for (let r = 44; r < 380; r += 22) {
      ellipses.push(<ellipse key={'a' + r} cx={200} cy={200} rx={r * 1.13} ry={r * .64}
        transform="rotate(-26 200 200)" />)
    }
    for (let r = 63; r < 385; r += 35) {
      ellipses.push(<ellipse key={'b' + r} cx={236} cy={175} rx={r * .54} ry={r * 1.17}
        transform="rotate(27 236 175)" />)
    }
  }
  return (
    <svg className="tui-cover__ornament" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={'fade-' + id} cx="50%" cy="50%" r="71%">
          <stop offset="0%" stopColor="#000" /><stop offset="29%" stopColor="#000" />
          <stop offset="58%" stopColor="#888" /><stop offset="85%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" />
        </radialGradient>
        <mask id={'mask-' + id} maskContentUnits="userSpaceOnUse" style={{ maskType: 'luminance' }}>
          <rect width={400} height={400} fill={'url(#fade-' + id + ')'} />
        </mask>
      </defs>
      <g mask={'url(#mask-' + id + ')'} className={kind === 'dots' ? 'tui-cover__dots' : 'tui-cover__lines'}>
        {lines}{paths}{dots}{ellipses}
      </g>
    </svg>
  )
}

/** One image-free gradient card, safely SSR-rendered and animated only in the browser. */
export function GradientCoverCard({
  lines, palette = 'sunset', pattern = 'rays', motion = true, className = '', style,
}: GradientCoverCardProps) {
  const card = useRef<HTMLElement>(null)
  const grain = useRef<HTMLCanvasElement>(null)
  const colors = typeof palette === 'string' ? gradientCoverPalettes[palette] : palette
  const css = {
    '--tui-cover-top': colors.top,
    '--tui-cover-bottom': colors.bottom,
    '--tui-cover-orb1': colors.orb1,
    '--tui-cover-orb2': colors.orb2,
    '--tui-cover-orb3': colors.orb3,
    '--tui-cover-orb4': colors.orb4,
    ...style,
  } as CSSProperties

  useEffect(() => {
    const element = card.current
    const canvas = grain.current
    if (!element || !canvas) return
    let resizeFrame = 0
    const draw = () => {
      const rect = element.getBoundingClientRect()
      paintGradientCoverNoise(canvas, rect.width, rect.height, window.devicePixelRatio || 1)
    }
    const schedule = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(draw)
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    observer?.observe(element)
    window.addEventListener('resize', schedule, { passive: true })
    draw()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(resizeFrame)
    }
  }, [])

  useEffect(() => {
    const element = card.current
    if (!element) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let lastFrame = 0
    const spring = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }
    const write = () => {
      element.style.setProperty('--tui-cover-paint-x', spring.x.toFixed(3) + 'px')
      element.style.setProperty('--tui-cover-paint-y', spring.y.toFixed(3) + 'px')
      element.style.setProperty('--tui-cover-pattern-x', (-spring.x * .42).toFixed(3) + 'px')
      element.style.setProperty('--tui-cover-pattern-y', (-spring.y * .42).toFixed(3) + 'px')
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      raf = 0
      lastFrame = 0
      spring.x = spring.y = spring.vx = spring.vy = spring.tx = spring.ty = 0
      element.classList.remove('is-hovering')
      write()
    }
    const tick = (now: number) => {
      raf = 0
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 1 / 30) : 1 / 60
      lastFrame = now
      for (const axis of ['x', 'y'] as const) {
        const v = axis === 'x' ? 'vx' : 'vy'
        const target = axis === 'x' ? 'tx' : 'ty'
        spring[v] += ((spring[target] - spring[axis]) * STIFFNESS - spring[v] * DAMPING) * dt
        spring[axis] += spring[v] * dt
      }
      if (Math.abs(spring.tx - spring.x) + Math.abs(spring.ty - spring.y)
          + Math.abs(spring.vx) + Math.abs(spring.vy) < .065) {
        spring.x = spring.tx
        spring.y = spring.ty
        spring.vx = spring.vy = 0
        write()
        lastFrame = 0
        return
      }
      write()
      raf = requestAnimationFrame(tick)
    }
    const move = (event: PointerEvent) => {
      if (!motion || media.matches || event.pointerType === 'touch') return
      const rect = element.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2))
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2))
      spring.tx = x * 16
      spring.ty = y * 16
      element.style.setProperty('--tui-cover-glow-x', ((x + 1) * 50).toFixed(2) + '%')
      element.style.setProperty('--tui-cover-glow-y', ((y + 1) * 50).toFixed(2) + '%')
      element.classList.add('is-hovering')
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const leave = () => {
      element.classList.remove('is-hovering')
      spring.tx = spring.ty = 0
      if (!media.matches && motion && !raf) raf = requestAnimationFrame(tick)
    }
    const onMotion = () => { if (media.matches) reset() }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
        lastFrame = 0
      } else if (motion && !media.matches && (spring.x !== spring.tx || spring.y !== spring.ty)) {
        raf = requestAnimationFrame(tick)
      }
    }
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', leave)
    media.addEventListener?.('change', onMotion)
    document.addEventListener('visibilitychange', visibility)
    if (!motion || media.matches) reset()
    return () => {
      reset()
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      media.removeEventListener?.('change', onMotion)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [motion])

  return (
    <article className={['tui-cover', className].filter(Boolean).join(' ')}
      ref={card} style={css} data-motion={motion ? 'on' : 'off'} aria-label={lines.join(' ')}>
      <div className="tui-cover__paint" aria-hidden="true">
        <div className="tui-cover__base" />
        <div className="tui-cover__orb tui-cover__orb--a" />
        <div className="tui-cover__orb tui-cover__orb--b" />
        <div className="tui-cover__orb tui-cover__orb--c" />
        <div className="tui-cover__orb tui-cover__orb--d" />
      </div>
      <div className="tui-cover__shade" aria-hidden="true" />
      <canvas ref={grain} className="tui-cover__grain" aria-hidden="true" />
      <div className="tui-cover__glow" aria-hidden="true" />
      <Ornament kind={pattern} />
      <div className="tui-cover__type" aria-hidden="true"><span>{lines[0]}</span><span>{lines[1]}</span></div>
    </article>
  )
}

/** A responsive cover gallery; pass custom items or use the six curated defaults. */
export function GradientCoverWall({
  items = defaultGradientCovers, columns = 3, motion = true,
  label = 'Gradient cover collection', className = '', style,
}: GradientCoverWallProps) {
  const css = { '--tui-cover-columns': columns, ...style } as CSSProperties
  return (
    <section className={['tui-cover-wall', className].filter(Boolean).join(' ')} style={css} aria-label={label}>
      {items.map((item, index) => (
        <GradientCoverCard key={item.id ?? item.lines.join('-') + '-' + index}
          lines={item.lines} palette={item.palette} pattern={item.pattern} motion={motion} />
      ))}
    </section>
  )
}
