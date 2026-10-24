import { StrictMode, useMemo, useState, type CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ThemeScope, Button, Badge, Card, TextField, Progress, SegmentedControl, Accordion, TagInput,
  SpotlightCard, Marquee, CopyButton, Skeleton,
  OtpInput, Stepper, RangeSlider, UploadDropzone, FlipBoard,
  Switch, Tabs, Tooltip, Dialog, EmptyState, CountUp,
} from '../packages/react/src'
import '../packages/react/src/styles.css'
import './styles/library-demo.css'

const categories = ['全部', '基础', '输入', '数据展示', '容器', '反馈', '动效'] as const
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
  { id: 'flip', name: 'FlipBoard', cn: '机械翻牌屏', group: '数据展示', description: '通用文字显示 · 3D 双面翻牌 · 动效降级', usage: '<FlipBoard value="HELLO UI" columns={10} />' },
  { id: 'switch', name: 'Switch', cn: '开关控件', group: '输入', description: '可访问状态 · 受控与非受控 · 禁用状态', usage: '<Switch label="通知" defaultChecked />', fresh: true },
  { id: 'tabs', name: 'Tabs', cn: '标签页', group: '容器', description: '可组合内容 · 方向键、Home / End 导航', usage: '<Tabs label="资料" items={items} />', fresh: true },
  { id: 'tooltip', name: 'Tooltip', cn: '悬浮提示', group: '反馈', description: '悬停、聚焦显示 · Escape 关闭 · ARIA', usage: '<Tooltip label="帮助" content="更多说明" />', fresh: true },
  { id: 'dialog', name: 'Dialog', cn: '对话框', group: '反馈', description: '焦点约束 · Escape / 遮罩关闭 · 轻量弹出动效', usage: '<Dialog open={open} onOpenChange={setOpen} title="设置">内容</Dialog>', fresh: true },
  { id: 'empty', name: 'EmptyState', cn: '空状态', group: '反馈', description: '无数据展示 · 图标 / 说明 / 自定义操作', usage: '<EmptyState title="暂无数据" description="创建第一个项目" />', fresh: true },
  { id: 'count', name: 'CountUp', cn: '数字动效', group: '动效', description: 'RAF 补间 · 数字变化 · 降低动态偏好', usage: '<CountUp value={total} duration={850} />', fresh: true },
  { id: 'theme', name: 'ThemeScope', cn: '主题容器', group: '基础', description: '局部暗色/亮色切换和 CSS Tokens', usage: '<ThemeScope theme="dark">...</ThemeScope>' },
] as const

function LibraryApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [accent, setAccent] = useState<'blue' | 'violet' | 'green'>('blue')
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(68)
  const [view, setView] = useState('grid')
  const [tags, setTags] = useState(['React', 'TypeScript'])
  const [otp, setOtp] = useState('')
  const [flipText, setFlipText] = useState('HELLO UI')
  const [quantity, setQuantity] = useState(3)
  const [rangeValue, setRangeValue] = useState(36)
  const [uploads, setUploads] = useState<File[]>([])
  const [projectName, setProjectName] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [tabKey, setTabKey] = useState('overview')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [countValue, setCountValue] = useState(1280)
  const [density, setDensity] = useState<'grid' | 'compact'>('grid')
  const [onlyNew, setOnlyNew] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const accents = {
    blue: { light: '#365de6', dark: '#90b0ff', ring: 'rgba(67,103,223,.24)' },
    violet: { light: '#7048ca', dark: '#b69cff', ring: 'rgba(130,89,214,.25)' },
    green: { light: '#11785c', dark: '#65d5b0', ring: 'rgba(42,152,113,.25)' },
  } as const
  const currentAccent = accents[accent]
  const themeStyle = {
    '--tui-accent': theme === 'dark' ? currentAccent.dark : currentAccent.light,
    '--tui-ring': currentAccent.ring,
  } as CSSProperties

  const visible = useMemo(() => catalog.filter(item =>
    (category === '全部' || item.group === category) &&
    (!onlyNew || 'fresh' in item) &&
    (item.name + item.cn + item.description).toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query, onlyNew])

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
        return <Accordion defaultValue="one" items={[{ id: 'one', title: '这个组件能在其他项目使用吗？', content: '可以。组件基于独立 Props 和局部样式，不依赖展示页面的 Context。' }, { id: 'two', title: '如何定制主题？', content: '在 ThemeScope 上选择 theme，再覆盖 --tui-accent 等 CSS 变量。' }, { id: 'three', title: '是否支持键盘操作？', content: '触发按钮支持 Tab、Enter 和 Space，并提供 aria-expanded 与关联面板。' }]} />
      case 'tags':
        return <TagInput label="技术栈标签" value={tags} onValueChange={setTags} maxTags={6} onError={reason => setToast(reason === 'duplicate' ? '标签已存在' : '最多添加 6 个标签')} />
      case 'progress':
        return <div className="lb-preview-stack"><Progress label="构建进度" value={progress} /><input aria-label="调整进度值" type="range" min="0" max="100" value={progress} onChange={event => setProgress(Number(event.target.value))} className="lb-range" /></div>
      case 'spotlight':
        return <SpotlightCard glowSize={300}><span className="lb-card-kicker">INTERACTIVE / LIGHT</span><h3 style={{margin:'8px 0'}}>Pointer spotlight</h3><p className="lb-meta">移动鼠标，让边缘光晕跟随你的指针。</p></SpotlightCard>
      case 'marquee':
        return <Marquee label="技术标签" items={['React', 'TypeScript', 'Vite', 'Accessible', 'Motion', 'Weepwood UI']} duration={18} />
      case 'copy':
        return <div className="lb-preview-stack"><span className="lb-meta">npm pack ./packages/react</span><CopyButton text="npm pack ./packages/react" onCopyError={() => setToast('请在安全环境中启用剪贴板权限')} /></div>
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
      case 'flip':
        return <div className="lb-preview-stack"><FlipBoard value={flipText.toUpperCase()} columns={10} align="center" label="展示文本" stagger={24} /><div className="lb-preview-row"><Button variant="secondary" size="sm" onClick={() => setFlipText('READY')}>READY</Button><Button variant="secondary" size="sm" onClick={() => setFlipText('DESIGN')}>DESIGN</Button><Button variant="secondary" size="sm" onClick={() => setFlipText('BUILD UI')}>BUILD UI</Button></div></div>
      case 'switch':
        return <div className="lb-preview-stack"><Switch label="消息通知" description="接收项目状态变化通知" checked={notifications} onCheckedChange={setNotifications} /><Switch label="自动更新" description="此示例已禁用" disabled defaultChecked /></div>
      case 'tabs':
        return <Tabs label="项目详情" value={tabKey} onValueChange={setTabKey} items={[
          { id: 'overview', label: '概览', content: <span>组件数量、版本信息和项目概况。</span> },
          { id: 'activity', label: '动态', content: <span>最近的设计调整和代码更新。</span> },
          { id: 'files', label: '文件', content: <span>设计资源与组件相关文件。</span> },
        ]} />
      case 'tooltip':
        return <div className="lb-preview-row"><Tooltip label="ⓘ 交互说明" content="支持鼠标悬停、Tab 聚焦和 Escape 关闭" /><Tooltip label="下面显示" content="提示层也支持底部布局" placement="bottom" /></div>
      case 'dialog':
        return <><div className="lb-preview-row"><Button onClick={() => setDialogOpen(true)}>打开设置弹窗 ↗</Button><span className="lb-meta">Escape 关闭 / Tab 切换</span></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="工作区设置" description="修改当前工作区的展示名称" footer={<><Button variant="secondary" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={() => { setDialogOpen(false); setToast('演示设置已保存') }}>保存更改</Button></>}><TextField label="工作区名称" defaultValue="Personal workspace" /></Dialog>
        </>
      case 'empty':
        return <EmptyState title="还没有项目" description="创建一个项目，开始整理组件和设计资源。" size="sm" action={<Button variant="secondary" size="sm" onClick={() => setToast('空状态操作已触发')}>创建项目</Button>} />
      case 'count':
        return <div className="lb-count-demo"><span className="lb-meta">ACTIVE COMPONENT VIEWS</span><CountUp value={countValue} label="浏览量" duration={900} className="lb-large-number" /><div className="lb-preview-row"><Button variant="secondary" size="sm" onClick={() => setCountValue(v => v + 128)}>+128</Button><Button variant="ghost" size="sm" onClick={() => setCountValue(1280)}>重置</Button></div></div>
      case 'theme':
        return <div className="lb-preview-stack"><span className="lb-meta">当前主题 / {theme}</span><Button variant="secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>切换到{theme === 'dark' ? '亮色' : '暗色'}主题</Button></div>
      default:
        return null
    }
  }

  return (
    <ThemeScope theme={theme} className="lb-root" style={themeStyle}>
      <header className="lb-header">
        <a className="lb-brand" href="/" aria-label="Weepwood UI 首页">
          <div className="lb-mark" aria-hidden="true">w<span>.</span></div>
          <div><strong>Weepwood <span>UI</span></strong><small>PERSONAL DESIGN SYSTEM</small></div>
        </a>
        <nav className="lb-topnav" aria-label="主导航">
          <a href="#components">组件</a>
          <a href="#tokens">设计变量</a>
          <a href="https://github.com/weepwood/terminal-ui" target="_blank" rel="noreferrer">GitHub ↗</a>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? '切换至浅色主题' : '切换至深色主题'}>
            {theme === 'dark' ? '☀' : '☾'} <span>{theme === 'dark' ? '浅色' : '深色'}</span>
          </button>
        </nav>
      </header>
      <main className="lb-main">
        <div className="lb-hero">
          <div className="lb-hero-content">
            <div className="lb-eyebrow"><span className="lb-pulse" /> WEEPWOOD / DESIGN SYSTEM</div>
            <h1>让界面设计<br /><em>更简单、更一致。</em></h1>
            <p>一套面向真实项目的 React 组件库。清晰的交互、克制的视觉、可配置的设计变量——无需依赖某一种业务或应用场景。</p>
            <div className="lb-hero-actions">
              <a className="lb-primary-link" href="#components">探索组件 <span aria-hidden="true">↗</span></a>
              <a className="lb-secondary-link" href="#tokens">查看设计变量 <span aria-hidden="true">→</span></a>
            </div>
            <div className="lb-hero-stats"><div><strong>24</strong><span>REUSABLE COMPONENTS</span></div><div><strong>02</strong><span>COLOR MODES</span></div><div><strong>03</strong><span>ACCENT PRESETS</span></div></div>
          </div>
          <div className="lb-hero-aside" aria-label="实时主题预览">
            <div className="lb-aside-head"><span className="lb-dot-grid" aria-hidden="true">✦</span> Appearance preview <Badge tone="success">Live</Badge></div>
            <div className="lb-sample-panel">
              <div className="lb-sample-title"><span>Workspace settings</span><Badge tone="accent">Active</Badge></div>
              <TextField label="项目名称" placeholder="My workspace" defaultValue="Personal workspace" />
              <div className="lb-sample-actions"><Button size="sm">保存更改</Button><Button size="sm" variant="secondary">取消</Button></div>
            </div>
            <div className="lb-aside-foot"><span>可复用组件</span><span>React · CSS Tokens</span></div>
          </div>
        </div>
        <div id="components" className="lb-controls"><div className="lb-filter-group" aria-label="组件分类">{categories.map(c => <button key={c} type="button" className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="lb-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索组件名称或用途..." /></label></div>
        <div className="lb-toolbar"><div className="lb-toolbar-left"><button type="button" className={onlyNew ? 'lb-chip is-selected' : 'lb-chip'} aria-pressed={onlyNew} onClick={() => setOnlyNew(v => !v)}>✦ 本次新增 6</button><span>参考社区实践 · 保持轻量 API</span></div><div className="lb-view-switch" aria-label="组件视图"><button type="button" aria-pressed={density === 'grid'} className={density === 'grid' ? 'is-active' : ''} onClick={() => setDensity('grid')}>▦ 网格</button><button type="button" aria-pressed={density === 'compact'} className={density === 'compact' ? 'is-active' : ''} onClick={() => setDensity('compact')}>≡ 紧凑</button></div></div>
        <div className="lb-list-title"><div><span className="lb-section-number">COMPONENT LIBRARY / 01</span><h2>组件目录 <small>Components</small></h2></div><span className="lb-counter">{visible.length} / {catalog.length} 个结果</span></div>
        <section className={density === 'compact' ? 'lb-grid is-compact' : 'lb-grid'} aria-label="组件预览">
          {visible.map((item, index) => <article className="lb-item" key={item.id}>
            <div className="lb-item-head"><span className="lb-item-number">{String(index + 1).padStart(2, '0')}</span><div className="lb-item-flags">{'fresh' in item && <span className="lb-new-flag">NEW</span>}<Badge tone="accent">{item.group}</Badge></div></div>
            <h3>{item.name}<small>{item.cn}</small></h3><p>{item.description}</p>
            <div className={item.id === 'tooltip' ? 'lb-preview lb-preview--overflow' : 'lb-preview'}>{renderPreview(item.id)}</div>
            <div className="lb-code"><code>{item.usage}</code><button type="button" onClick={() => copy(item.id, item.usage)} aria-label={'复制 ' + item.name + ' 用法'}>{copied === item.id ? '✓ 已复制' : '复制 ↗'}</button></div>
          </article>)}
          {visible.length === 0 && <div className="lb-empty">没有找到匹配的组件，请更换关键词。</div>}
        </section>
        <section id="tokens" className="lb-tokens" aria-label="设计变量">
          <div className="lb-token-heading">
            <div><span className="lb-section-number">FOUNDATIONS / 02</span><h2>设计变量 <small>Design tokens</small></h2><p>统一颜色、字体和圆角，主题切换只影响当前组件区域。</p></div>
            <div className="lb-theme-actions"><button type="button" className={theme === 'light' ? 'is-selected' : ''} onClick={() => setTheme('light')}>☀ 浅色</button><button type="button" className={theme === 'dark' ? 'is-selected' : ''} onClick={() => setTheme('dark')}>☾ 深色</button></div>
          </div>
          <div className="lb-tokens-grid">
            <div className="lb-token-card"><h3>语义色彩 <small>Color</small></h3>
              {[
                { name: 'Accent', token: '--tui-accent', color: 'var(--tui-accent)' },
                { name: 'Surface', token: '--tui-surface', color: 'var(--tui-surface)' },
                { name: 'Foreground', token: '--tui-text', color: 'var(--tui-text)' },
                { name: 'Border', token: '--tui-border', color: 'var(--tui-border)' },
              ].map(item => <div key={item.token} className="lb-token-line"><span className="lb-token-swatch" style={{ background: item.color }} /><span>{item.name}</span><code>{item.token}</code></div>)}
            </div>
            <div className="lb-token-card"><h3>强调色预设 <small>Accent</small></h3><p>选择强调色后，所有组件会同步更新。</p>
              <div className="lb-accent-options">{([
                { id: 'blue', title: '蓝色', color: '#365de6' },
                { id: 'violet', title: '紫色', color: '#7048ca' },
                { id: 'green', title: '绿色', color: '#11785c' },
              ] as const).map(item => <button key={item.id} type="button" className={accent === item.id ? 'is-selected' : ''} aria-pressed={accent === item.id} onClick={() => setAccent(item.id)}><span style={{ background: item.color }} />{item.title}</button>)}</div>
              <div className="lb-token-example"><code>--tui-accent</code><Button size="sm">主操作</Button><Badge tone="accent">选中</Badge></div>
            </div>
          </div>
        </section>
        <footer className="lb-footer"><span>© 2026 Weepwood UI · 个人组件设计系统</span><span>React · TypeScript · Design Tokens · Accessibility</span></footer>
      </main>
      {toast && <div className="lb-toast" role="status">{toast}<button onClick={() => setToast('')} aria-label="关闭提示">×</button></div>}
    </ThemeScope>
  )
}
createRoot(document.getElementById('root')!).render(<StrictMode><LibraryApp /></StrictMode>)
