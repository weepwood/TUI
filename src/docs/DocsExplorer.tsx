import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { docsDetails, docsHref, type DocsItem } from './docs-data'
import SegmentedExamples from './SegmentedExamples'

interface DocsExplorerProps {
  catalog: readonly DocsItem[]
  selectedId: string
  onSelect: (id: string) => void
  onGallery: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  renderPreview: (id: string) => ReactNode
}
const sections = [
  { id: 'preview', text: '实时预览' },
  { id: 'installation', text: '安装' },
  { id: 'usage', text: '使用示例' },
  { id: 'props', text: '组件属性' },
  { id: 'use-cases', text: '适用场景' },
  { id: 'related', text: '相关组件' },
]
const INSTALL = 'npm ci\nnpm run build:lib\nnpm pack ./packages/react'

function onLinkClick(event: MouseEvent<HTMLAnchorElement>, callback: () => void) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  callback()
}

export default function DocsExplorer({
  catalog, selectedId, onSelect, onGallery, theme, onToggleTheme, renderPreview,
}: DocsExplorerProps) {
  const [search, setSearch] = useState('')
  const [codeTab, setCodeTab] = useState<'preview' | 'code'>('preview')
  const [installTab, setInstallTab] = useState<'npm' | 'pnpm'>('npm')
  const [copied, setCopied] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const item = catalog.find(entry => entry.id === selectedId) ?? catalog.find(entry => entry.id === 'segmented') ?? catalog[0]
  const detail = docsDetails[item.id]
  const index = catalog.findIndex(entry => entry.id === item.id)
  const filtered = useMemo(() => catalog.filter(entry =>
    [entry.name, entry.cn, entry.group, entry.description].join(' ').toLowerCase().includes(search.trim().toLowerCase())
  ), [catalog, search])
  const groups = [...new Set(catalog.map(entry => entry.group))]
  const source = item.id === 'covers' ? [
    "import { ThemeScope, GradientCoverWall } from '@weepwood/terminal-ui'",
    "import '@weepwood/terminal-ui/styles.css'",
    '',
    '<ThemeScope theme="light">',
    '  <GradientCoverWall />',
    '</ThemeScope>',
  ].join('\n') : item.id === 'cover' ? [
    "import { GradientCoverCard } from '@weepwood/terminal-ui'",
    "import '@weepwood/terminal-ui/styles.css'",
    '',
    '<GradientCoverCard lines={["SOFT", "LIGHT"]} palette="sunset" pattern="rays" />',
  ].join('\n') : item.id === 'segmented'
    ? [
      "import { useState } from 'react'",
      "import { SegmentedControl } from '@weepwood/terminal-ui'",
      "import '@weepwood/terminal-ui/styles.css'",
      '',
      'export function SegmentedDemo() {',
      "  const [view, setView] = useState('overview')",
      '  return (',
      '    <SegmentedControl',
      '      label="当前视图"',
      '      value={view}',
      '      onValueChange={setView}',
      '      options={[',
      "        { label: 'Overview', value: 'overview' },",
      "        { label: 'Activity', value: 'activity' },",
      '      ]}',
      '    />',
      '  )',
      '}',
    ].join('\n')
    : [
      '// 组件使用示意；需要根据实际应用提供 props 与状态',
      "import { " + item.name + " } from '@weepwood/terminal-ui'",
      "import '@weepwood/terminal-ui/styles.css'",
      '',
      item.usage,
    ].join('\n')
  const install = installTab === 'pnpm' ? 'pnpm install\npnpm run build:lib\nnpm pack ./packages/react' : INSTALL

  useEffect(() => { setCodeTab('preview'); setNavOpen(false); setCopied('') }, [selectedId])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
        setNavOpen(true)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
    } catch {
      setCopied('failed')
    }
  }
  const navTo = (id: string) => {
    onSelect(id)
    setNavOpen(false)
  }

  return (
    <div className="ds-frame">
      <header className="ds-topbar">
        <div className="ds-topbrand">
          <a href="?component=segmented-control" className="ds-mark" aria-label="Weepwood UI 文档首页"
            onClick={event => onLinkClick(event, () => navTo('segmented'))}>w<span>.</span></a>
          <a href="?component=segmented-control" className="ds-brand-copy"
            onClick={event => onLinkClick(event, () => navTo('segmented'))}>Weepwood <span>UI</span><small>COMPONENT LIBRARY</small></a>
          <span className="ds-brand-version">v0.2</span>
        </div>
        <nav className="ds-toplinks" aria-label="站点导航">
          <a href="?component=segmented-control" className="is-current"
            onClick={event => onLinkClick(event, () => navTo('segmented'))}>组件</a>
          <a href="?view=gallery" onClick={event => onLinkClick(event, onGallery)}>全部预览</a>
          <a href="./examples/noise-gradient-cover-wall.html">渐变封面 ↗</a>
          <a href="https://github.com/weepwood/terminal-ui" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="ds-actions">
          <button type="button" className="ds-theme-toggle" onClick={onToggleTheme} aria-label={theme === 'dark' ? '切换浅色主题' : '切换深色主题'} title="切换主题">{theme === 'dark' ? '☀' : '☾'}</button>
          <button type="button" className="ds-mobile-menu" onClick={() => setNavOpen(v => !v)} aria-expanded={navOpen} aria-controls="docs-sidebar">☰ <span>目录</span></button>
        </div>
      </header>

      <div className="ds-body">
        {navOpen && <button type="button" className="ds-mobile-backdrop" aria-label="关闭目录" onClick={() => setNavOpen(false)}/>}
        <aside className={navOpen ? 'ds-sidebar is-open' : 'ds-sidebar'} id="docs-sidebar" aria-label="组件分类与导航">
          <div className="ds-sidebar-heading">LIBRARY <span>{catalog.length} components</span></div>
          <label className="ds-sidebar-search"><span aria-hidden="true">⌕</span>
            <input ref={searchRef} value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索组件..." aria-label="搜索组件" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="ds-sidebar-scroll">
            {filtered.length === 0 && <div className="ds-empty-search">没有匹配的组件</div>}
            {groups.map(group => {
              const entries = filtered.filter(entry => entry.group === group)
              if (!entries.length) return null
              return <div className="ds-side-group" key={group}>
                <h2>{group}<span>{entries.length}</span></h2>
                <div>{entries.map(entry =>
                  <a key={entry.id} href={docsHref(entry.id)} aria-current={item.id === entry.id ? 'page' : undefined}
                    className={item.id === entry.id ? 'ds-side-link is-active' : 'ds-side-link'}
                    onClick={event => onLinkClick(event, () => navTo(entry.id))}>
                    <span className="ds-link-name">{entry.name}</span>
                    {'fresh' in entry && <span className="ds-side-new">NEW</span>}
                  </a>
                )}</div>
              </div>
            })}
          </div>
          <div className="ds-sidebar-foot"><span className="ds-sidebar-foot-dot"/> React · TypeScript · 26 components</div>
        </aside>

        <main className="ds-main" id="main-content">
          <div className="ds-breadcrumb"><span>Components</span><span aria-hidden="true">/</span><span>{item.group}</span><span aria-hidden="true">/</span><strong>{item.name}</strong></div>
          <div className="ds-page-heading">
            <div className="ds-title-copy">
              <div className="ds-title-meta"><span className="ds-category-label">{item.group}</span>{'fresh' in item && <span className="ds-label-new">NEW</span>}<span className="ds-label-free">INCLUDED</span></div>
              <h1>{item.name}</h1>
              <p>{detail?.intro ?? item.description}</p>
            </div>
            <a className="ds-view-all" href="?view=gallery" onClick={event => onLinkClick(event, onGallery)}>全部组件 <span aria-hidden="true">↗</span></a>
          </div>

          <section className="ds-section ds-section--first" id="preview">
            <div className="ds-section-heading"><h2>Preview <span>实时预览</span></h2><span className="ds-section-hint">在这里体验组件交互</span></div>
            <div className="ds-preview-shell">
              <div className="ds-preview-toolbar">
                <div className="ds-preview-tabs" role="group" aria-label="预览模式">
                  <button type="button" className={codeTab === 'preview' ? 'is-active' : ''} aria-pressed={codeTab === 'preview'} onClick={() => setCodeTab('preview')}>◫ Preview</button>
                  <button type="button" className={codeTab === 'code' ? 'is-active' : ''} aria-pressed={codeTab === 'code'} onClick={() => setCodeTab('code')}>⌘ Code</button>
                </div>
                <span className="ds-preview-state"><span/> Interactive demo</span>
              </div>
              {codeTab === 'preview'
                ? <div className={item.id === 'tooltip' ? 'ds-preview-canvas ds-preview-canvas--tooltip' : 'ds-preview-canvas'} key={item.id}>
                    <div className="ds-preview-pattern" aria-hidden="true"/>
                    <div className="ds-preview-content">

                      {item.id === 'segmented' ? <SegmentedExamples /> : renderPreview(item.id)}

                    </div>
                  </div>
                : <div className="ds-code-stage"><pre><code>{source}</code></pre><button type="button" onClick={() => copy(source, 'preview')} className="ds-floating-copy">{copied === 'preview' ? '✓ 已复制' : '复制代码'}</button></div>}
              <div className="ds-preview-footer"><span>React / TypeScript</span><span>无额外 UI 运行时依赖</span></div>
            </div>
          </section>

          <section className="ds-section" id="installation">
            <div className="ds-section-heading"><h2>Installation <span>安装</span></h2><span className="ds-section-hint">本地构建 · 尚未公开发布</span></div>
            <p className="ds-section-description">组件包当前位于私有仓库，尚未发布至 npm。请先在仓库根目录执行构建与打包，再将生成的 .tgz 安装到其他 React 项目。</p>
            <div className="ds-code-box">
              <div className="ds-code-header"><span>Terminal</span><div className="ds-install-tabs"><button type="button" className={installTab === 'npm' ? 'is-active' : ''} onClick={() => setInstallTab('npm')}>npm</button><button type="button" className={installTab === 'pnpm' ? 'is-active' : ''} onClick={() => setInstallTab('pnpm')}>pnpm</button></div><button type="button" className="ds-copy" onClick={() => copy(install, 'install')}>{copied === 'install' ? '✓ 已复制' : '⧉ 复制'}</button></div>
              <pre><code>{install}</code></pre>
            </div>
          </section>

          <section className="ds-section" id="usage">
            <div className="ds-section-heading"><h2>Usage <span>使用示例</span></h2></div>
            <p className="ds-section-description">保留原有组件 API；下面 SegmentedControl 示例可直接运行；其他组件为简化的 API 片段，实际使用时需提供业务状态与必填属性。</p>
            <div className="ds-code-box">
              <div className="ds-code-header"><span>Example.tsx</span><button type="button" className="ds-copy" onClick={() => copy(source, 'usage')}>{copied === 'usage' ? '✓ 已复制' : '⧉ 复制'}</button></div>
              <pre><code>{source}</code></pre>
            </div>
          </section>

          <section className="ds-section" id="props">
            <div className="ds-section-heading"><h2>Props <span>组件属性</span></h2></div>
            <div className="ds-props-table-wrap"><table className="ds-props-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
              {(detail?.props ?? []).map(prop => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.defaultValue}</td><td>{prop.description}</td></tr>)}
            </tbody></table></div>
          </section>

          <section className="ds-section" id="use-cases">
            <div className="ds-section-heading"><h2>Use cases <span>适用场景</span></h2></div>
            <div className="ds-use-case-grid">{(detail?.useCases ?? []).map((caseItem, n) => <article className="ds-use-case" key={caseItem.title}><span className="ds-use-case-index">{String(n + 1).padStart(2, '0')}</span><h3>{caseItem.title}</h3><p>{caseItem.detail}</p></article>)}</div>
          </section>

          <section className="ds-section ds-section--related" id="related">
            <div className="ds-section-heading"><h2>Related components <span>相关组件</span></h2></div>
            <div className="ds-related-list">{(detail?.related ?? []).map(id => {
              const entry = catalog.find(x => x.id === id)
              if (!entry) return null
              return <a key={entry.id} href={docsHref(entry.id)}
                onClick={event => onLinkClick(event, () => navTo(entry.id))}><span><strong>{entry.name}</strong><small>{entry.cn} · {entry.group}</small></span><span aria-hidden="true">↗</span></a>
            })}</div>
          </section>
          <div className="ds-pagination">
            {index > 0 ? <a href={docsHref(catalog[index - 1].id)} onClick={event => onLinkClick(event, () => navTo(catalog[index - 1].id))}><small>← 上一个组件</small><strong>{catalog[index - 1].name}</strong></a> : <span/>}
            {index < catalog.length - 1 ? <a href={docsHref(catalog[index + 1].id)} onClick={event => onLinkClick(event, () => navTo(catalog[index + 1].id))}><small>下一个组件 →</small><strong>{catalog[index + 1].name}</strong></a> : <span/>}
          </div>
          <footer className="ds-footer">Weepwood UI · 独立设计系统 <a href="https://github.com/weepwood/terminal-ui" target="_blank" rel="noreferrer">View source ↗</a></footer>
        </main>

        <aside className="ds-toc" aria-label="本页目录">
          <span className="ds-toc-title">ON THIS PAGE</span>
          <nav>{sections.map(section => <a key={section.id} href={'#' + section.id}>{section.text}</a>)}</nav>
          <div className="ds-toc-note"><span>✦</span> 26 个组件可交互预览，样式通过本地 CSS 变量定制。</div>
        </aside>
      </div>
      {copied === 'failed' && <div className="ds-copy-error" role="status">复制失败：请允许浏览器访问剪贴板</div>}
    </div>
  )
}
