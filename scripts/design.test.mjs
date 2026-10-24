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
