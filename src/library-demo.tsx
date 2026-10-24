import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ThemeScope, Button, Badge, Card, TextField, Progress, SegmentedControl, Accordion, TagInput,
  SpotlightCard, Marquee, CopyButton, Skeleton,
  OtpInput, Stepper, RangeSlider, UploadDropzone,
} from '../packages/react/src'
import '../packages/react/src/styles.css'
import './styles/library-demo.css'

const categories = ['全部', '基础', '输入', '数据展示', '容器'] as const
type Category = typeof categories[number]
const catalog = [
  { id: 'button', name: 'Button', cn: '按钮', group: '基础', description: '四种风格 · 三种尺寸 · Loading 与原生按钮属性', usage: '<Button variant="primary">创建项目</Button>' },
  { id: 'badge', name: 'Badge', cn: '状态标签', group: '基础', description: '状态层级和语义色彩', usage: '<Badge tone="success">Ready</Badge>' },
  { id: 'card', name: 'Card', cn: '内容卡片', group: '容器', description: '独立内容容器与悬浮层次', usage: '<Card elevated>Content</Card>' },
  { id: 'textfield', name: 'TextField', cn: '文本输入', group: '输入', description: '表单标签、说明、校验错误与 aria 属性', usage: '<TextField label="项目名称" hint="最多 32 字" />' },
  { id: 'segmented', name: 'SegmentedControl', cn: '分段控制', group: '输入', description: '受控/非受控切换与方向键导航', usage: '<SegmentedControl label="视图" options={options} />' },
  { id: 'accordion', name: 'Accordion', cn: '手风琴', group: '容器', description: '可访问的单开面板 · 可受控', usage: '<Accordion items={items} defaultValue="one" />' },
  { id: 'tags', name: 'TagInput', cn: '标签输入', group: '输入', description: 'Enter 添加 · 去重 · 最大数量限制', usage: '<TagInput label="标签" maxTags={6} />' },
  { id: 'progress', name: 'Progress', cn: '进度条', group: '数据展示', description: '进度反馈 · 范围约束 · aria-progressbar', usage: '<Progress label="构建进度" value={75} />' },
  { id: 'spotlight', name: 'SpotlightCard', cn: '聚光卡片', group: '容器', description: '指针追踪 · 光晕渐隐 · 零 React 重渲染', usage: '<SpotlightCard>内容</SpotlightCard>' },
  { id: 'marquee', name: 'Marquee', cn: '跑马灯', group: '数据展示', description: '循环滚动 · 悬停暂停 · 减少动效偏好', usage: '<Marquee label="工具" items={["React", "Vite"]} />' },
  { id: 'copy', name: 'CopyButton', cn: '复制按钮', group: '基础', description: '异步复制 · 状态反馈 · 失败回调', usage: '<CopyButton text="npm install">复制命令</CopyButton>' },
  { id: 'skeleton', name: 'Skeleton', cn: '骨架屏', group: '数据展示', description: '可配置头像/行数 · Shimmer 占位效果', usage: '<Skeleton lines={3} avatar />' },
  { id: 'otp', name: 'OtpInput', cn: '验证码输入', group: '输入', description: '输入自动推进 · 粘贴分发 · 完成事件 · 方向键', usage: '<OtpInput label="验证码" length={6} onComplete={verify} />' },
  { id: 'stepper', name: 'Stepper', cn: '数字步进器', group: '输入', description: '上下限 · 可配置步长 · 按住连续增减', usage: '<Stepper label="数量" min={0} max={20} />' },
  { id: 'range', name: 'RangeSlider', cn: '数值滑块', group: '输入', description: '原生 range · 键盘友好 · 可配置范围', usage: '<RangeSlider label="音量" defaultValue={36} />' },
  { id: 'upload', name: 'UploadDropzone', cn: '拖拽文件', group: '输入', description: '类型过滤 · 重复检测 · 文件列表（不上传）', usage: '<UploadDropzone label="附件" accept=".png,.pdf" />' },
  { id: 'theme', name: 'ThemeScope', cn: '主题容器', group: '基础', description: '局部暗色/亮色切换和 CSS Tokens', usage: '<ThemeScope theme="dark">...</ThemeScope>' },
] as const

function LibraryApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(68)
  const [view, setView] = useState('grid')
  const [tags, setTags] = useState(['React', 'TypeScript'])
  const [otp, setOtp] = useState('')
  const [quantity, setQuantity] = useState(3)
  const [rangeValue, setRangeValue] = useState(36)
  const [uploads, setUploads] = useState<File[]>([])
  const [projectName, setProjectName] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const visible = useMemo(() => catalog.filter(item =>
    (category === '全部' || item.group === category) &&
    (item.name + item.cn + item.description).toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query])

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(id)
    } catch {
      setToast('浏览器未授予剪贴板权限，请手动复制代码')
    }
  }

  const renderPreview = (id: string) => {
    switch (id) {
      case 'button':
        return <div className="lb-preview-row"><Button onClick={() => setToast('Button 点击成功')}>创建项目 ↗</Button><Button variant="secondary" onClick={() => setToast('Secondary 点击成功')}>次要操作</Button><Button variant="ghost" size="sm">Ghost</Button><Button variant="danger" size="sm">Delete</Button><Button loading={busy} variant="secondary" onClick={() => setBusy(true)}>Loading</Button><Button size="sm" variant="ghost" onClick={() => setBusy(false)}>复位</Button></div>
      case 'badge':
        return <div className="lb-preview-row"><Badge>Draft</Badge><Badge tone="accent">Featured</Badge><Badge tone="success">Published</Badge><Badge tone="danger">Failed</Badge></div>
      case 'card':
        return <div className="lb-preview-card"><Card elevated><span className="lb-card-kicker">PROJECT / 001</span><strong>Personal Design System</strong><p>统一组件、交互、视觉与设计规范。</p><Badge tone="success">Active</Badge></Card></div>
      case 'textfield':
        return <TextField label="项目名称" placeholder="输入你的项目名称" value={projectName} onChange={event => setProjectName(event.target.value)} hint="一个可复用的 React 组件库" error={projectName.length > 20 ? '名称不能超过 20 字符' : undefined} />
      case 'segmented':
        return <div className="lb-preview-stack"><SegmentedControl label="布局方式" value={view} onValueChange={setView} options={[{ value: 'grid', label: '网格 Grid' }, { value: 'list', label: '列表 List' }, { value: 'compact', label: '紧凑 Compact' }]} /><span className="lb-meta">当前选择 / {view}</span></div>
      case 'accordion':
        return <Accordion defaultValue="one" items={[{ id: 'one', title: '这个组件能在其他项目使用吗？', content: '可以。它不依赖航班数据、站点 Context，也不会覆盖全局 CSS。' }, { id: 'two', title: '如何定制主题？', content: '在 ThemeScope 上选择 theme，再覆盖 --tui-accent 等 CSS 变量。' }, { id: 'three', title: '是否支持键盘操作？', content: '触发按钮支持 Tab、Enter 和 Space，并提供 aria-expanded 与关联面板。' }]} />
      case 'tags':
        return <TagInput label="技术栈标签" value={tags} onValueChange={setTags} maxTags={6} onError={reason => setToast(reason === 'duplicate' ? '标签已存在' : '最多添加 6 个标签')} />
      case 'progress':
        return <div className="lb-preview-stack"><Progress label="构建进度" value={progress} /><input aria-label="调整进度值" type="range" min="0" max="100" value={progress} onChange={event => setProgress(Number(event.target.value))} className="lb-range" /></div>
      case 'spotlight':
        return <SpotlightCard glowSize={300}><span className="lb-card-kicker">INTERACTIVE / LIGHT</span><h3 style={{margin:'8px 0'}}>Pointer spotlight</h3><p className="lb-meta">移动鼠标，让边缘光晕跟随你的指针。</p></SpotlightCard>
      case 'marquee':
        return <Marquee label="技术标签" items={['React', 'TypeScript', 'Vite', 'Accessible', 'Motion', 'Terminal UI']} duration={18} />
      case 'copy':
        return <div className="lb-preview-stack"><span className="lb-meta">npm install @weepwood/terminal-ui</span><CopyButton text="npm install @weepwood/terminal-ui" onCopyError={() => setToast('请在安全环境中启用剪贴板权限')} /></div>
      case 'skeleton':
        return <Skeleton avatar lines={3} />
      case 'otp':
        return <div className="lb-preview-stack"><OtpInput label="六位数字验证码" length={6} value={otp} onValueChange={setOtp} onComplete={code => setToast('输入已完成：' + code + '（仅演示，不执行验证）')} /><Button size="sm" variant="ghost" onClick={() => setOtp('')}>清空输入</Button></div>
      case 'stepper':
        return <div className="lb-preview-stack"><Stepper label="数量" min={1} max={9} value={quantity} onValueChange={setQuantity} /><span className="lb-meta">支持鼠标长按，限制 1–9</span></div>
      case 'range':
        return <RangeSlider label="音量" value={rangeValue} onValueChange={setRangeValue} />
      case 'upload':
        return <UploadDropzone label="项目附件" value={uploads} onFilesChange={setUploads} maxFiles={3} accept=".png,.jpg,.pdf" onReject={reason => setToast(reason === 'limit' ? '最多 3 个文件' : reason === 'type' ? '仅支持 PNG / JPG / PDF' : '文件重复')} />
      case 'theme':
        return <div className="lb-preview-stack"><span className="lb-meta">当前主题 / {theme}</span><Button variant="secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>切换到{theme === 'dark' ? '亮色' : '暗色'}主题</Button></div>
      default:
        return null
    }
  }

  return (
    <ThemeScope theme={theme} className="lb-root">
      <header className="lb-header">
        <div className="lb-brand"><div className="lb-mark">T<span>U</span></div><div><strong>TERMINAL<span>/UI</span></strong><small>PERSONAL COMPONENT LIBRARY</small></div></div>
        <nav className="lb-topnav"><a href="/">← 返回原始动效展厅</a><a href="https://github.com/weepwood/terminal-ui">GITHUB ↗</a><button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="切换主题">{theme === 'dark' ? '☀' : '☾'} <span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button></nav>
      </header>
      <main className="lb-main">
        <div className="lb-hero">
          <div className="lb-eyebrow"><span className="lb-pulse" /> THE COMPONENT WORKSHOP · 001</div>
          <h1>Build once.<br /><em>Use everywhere.</em></h1>
          <p>把喜欢的设计变成真正能复用的组件。独立 React 包、清晰 API、可访问交互与可定制的设计变量。</p>
          <div className="lb-hero-stats"><div><strong>17</strong><span>PUBLIC COMPONENTS</span></div><div><strong>02</strong><span>THEME MODES</span></div><div><strong>0</strong><span>UI DEPENDENCIES</span></div></div>
        </div>
        <div className="lb-controls"><div className="lb-filter-group" aria-label="组件分类">{categories.map(c => <button key={c} type="button" className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="lb-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索组件 / Search" /></label></div>
        <div className="lb-list-title"><div><span className="lb-section-number">01 / CATALOG</span><h2>Component collection</h2></div><span className="lb-counter">{visible.length} / {catalog.length} SHOWN</span></div>
        <section className="lb-grid" aria-label="组件预览">
          {visible.map((item, index) => <article className="lb-item" key={item.id}>
            <div className="lb-item-head"><span className="lb-item-number">{String(index + 1).padStart(2, '0')}</span><Badge tone="accent">{item.group}</Badge></div>
            <h3>{item.name}<small>{item.cn}</small></h3><p>{item.description}</p>
            <div className="lb-preview">{renderPreview(item.id)}</div>
            <div className="lb-code"><code>{item.usage}</code><button type="button" onClick={() => copy(item.id, item.usage)} aria-label={'复制 ' + item.name + ' 用法'}>{copied === item.id ? '✓ 已复制' : '复制 ↗'}</button></div>
          </article>)}
          {visible.length === 0 && <div className="lb-empty">没有找到匹配的组件，请更换关键词。</div>}
        </section>
        <footer className="lb-footer"><span>TERMINAL/UI © 2026 · HANDCRAFTED FOR REUSE</span><span>React · TypeScript · Scoped CSS · Accessible by default</span></footer>
      </main>
      {toast && <div className="lb-toast" role="status">{toast}<button onClick={() => setToast('')} aria-label="关闭提示">×</button></div>}
    </ThemeScope>
  )
}
createRoot(document.getElementById('root')!).render(<StrictMode><LibraryApp /></StrictMode>)
