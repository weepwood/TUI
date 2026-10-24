import { readFileSync } from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8')

test('homepage and library alias both mount the generic component explorer', () => {
  const home = read('index.html')
  const alias = read('library.html')
  for (const html of [home, alias]) {
    assert.match(html, /src\/library-demo\.tsx/)
    assert.doesNotMatch(html, /src\/main\.tsx/)
    assert.doesNotMatch(html, /机场|航显|登机|航班|TERMINAL\/UI/)
  }
  assert.match(home, /Weepwood UI/)
})

test('published React package uses neutral palette and scoped tokens', () => {
  const css = read('packages/react/src/styles.css')
  assert.match(css, /--tui-accent:\s*#365de6/)
  assert.match(css, /--tui-bg:\s*#f6f8fb/)
  assert.match(css, /data-tui-theme="light"/)
  assert.doesNotMatch(css, /#ffb02e|rgba\(255,176,46/)
  assert.doesNotMatch(css, /^\s*(?:html|body|\*)\s*\{/m)
})

test('component explorer keeps category, token and theme controls', () => {
  const jsx = read('src/library-demo.tsx')
  for (const token of ['id="components"', 'id="tokens"', 'setTheme', 'setAccent', 'catalog.filter']) {
    assert.ok(jsx.includes(token), 'missing ' + token)
  }
  assert.doesNotMatch(jsx, /机场|登机|航班|航显|TERMINAL\/UI/)
})


test('component catalog includes all six new reusable primitives and density controls', () => {
  const jsx = read('src/library-demo.tsx')
  for (const name of ['Switch', 'Tabs', 'Tooltip', 'Dialog', 'EmptyState', 'CountUp']) {
    assert.ok(jsx.includes("name: '" + name + "'"), name + ' must have a catalog card')
  }
  for (const term of ['onlyNew', 'setDensity', 'is-compact', 'lb-new-flag']) {
    assert.ok(jsx.includes(term), term + ' must remain present')
  }
})


test('Planes-inspired documentation includes browseable details, prop reference and safe install instructions', () => {
  const jsx = read('src/docs/DocsExplorer.tsx')
  const data = read('src/docs/docs-data.ts')
  const entry = read('src/library-demo.tsx')
  for (const name of ['Preview', 'Installation', 'Usage', 'Props', 'Use cases', 'Related components']) {
    assert.ok(jsx.includes(name), 'documentation section missing: ' + name)
  }
  for (const id of ['segmented', 'button', 'tooltip', 'dialog', 'count']) {
    assert.ok(data.includes(id + ':'), 'missing metadata for ' + id)
  }
  assert.match(jsx, /npm pack \.\/packages\/react/)
  assert.doesNotMatch(jsx, /npm install @weepwood\/terminal-ui\b/)
  assert.match(entry, /idFromSlug/)
  assert.match(entry, /popstate/)
  assert.match(entry, /view=gallery/)
  assert.match(entry, /<DocsExplorer/)
})

test('segmented control retains radiogroup API while animating the selected pill', () => {
  const component = read('packages/react/src/components/SegmentedControl.tsx')
  const css = read('packages/react/src/styles.css')
  assert.match(component, /role="radiogroup"/)
  assert.match(component, /aria-checked=/)
  assert.match(component, /tui-segment-index/)
  assert.match(css, /tui-segmented::before/)
  assert.match(css, /prefers-reduced-motion:reduce/)
})


test('standalone gradient cover wall ships as a self-contained image-free HTML entry', () => {
  const html = read('examples/noise-gradient-cover-wall.html')
  const vite = read('vite.config.ts')
  const docs = read('src/docs/DocsExplorer.tsx')
  assert.match(vite, /gradientCovers: 'examples\/noise-gradient-cover-wall\.html'/)
  assert.match(docs, /examples\/noise-gradient-cover-wall\.html/)
  assert.equal((html.match(/<article class="cover"/g) ?? []).length, 6)
  assert.equal((html.match(/<canvas class="grain"/g) ?? []).length, 6)
  assert.equal((html.match(/<svg class="ornament"/g) ?? []).length, 5)
  for (const token of ['mix-blend-mode: overlay', 'opacity: .4', 'TILE = 128',
      'devicePixelRatio', 'STIFFNESS = 70', 'DAMPING_RATIO = .86',
      'prefers-reduced-motion: reduce', 'pointermove']) {
    assert.ok(html.includes(token), token + ' must appear in the single-file demo')
  }
  assert.doesNotMatch(html, /<img\b|<script\b[^>]*\bsrc=|<link\b[^>]*\bhref=/i)
  // The SVG namespace URI is an identifier, not a remote dependency.
  assert.doesNotMatch(html.replaceAll("http://www.w3.org/2000/svg", ""), /https?:\/\//i)
})

test('gradient cover components are included in both public package and documentation catalog', () => {
  const index = read('packages/react/src/index.ts')
  const catalog = read('src/library-demo.tsx')
  const docs = read('src/docs/docs-data.ts')
  const css = read('packages/react/src/styles.css')
  for (const name of ['GradientCoverCard', 'GradientCoverWall']) {
    assert.match(index, new RegExp(name))
    assert.match(catalog, new RegExp("name: '" + name + "'"))
  }
  for (const name of ['covers', 'cover']) {
    assert.ok(docs.includes(name + ':'))
  }
  for (const token of ['tui-cover-wall', 'tui-cover__grain', 'tui-cover__ornament',
    'mix-blend-mode:overlay', 'opacity:.4', 'prefers-reduced-motion:reduce']) {
    assert.ok(css.includes(token), 'missing reusable style: ' + token)
  }
  assert.match(read('packages/react/package.json'), /"version": "0\.3\.0"/)
})
