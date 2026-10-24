import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Button, Badge, Card, ThemeScope, TextField, Progress, SegmentedControl, Accordion, TagInput, SpotlightCard, Marquee, CopyButton, Skeleton,
} from '../packages/react/dist/index.js'

const render = (component, props) => renderToStaticMarkup(createElement(component, props))

test('exports all public components with server-renderable markup', () => {
  for (const Comp of [Button, Badge, Card, ThemeScope]) {
    assert.equal(typeof Comp, 'object') // forwardRef components
  }
  assert.match(render(ThemeScope, { theme: 'light', children: 'hello' }), /data-tui-theme="light"/)
  assert.match(render(Badge, { tone: 'success', children: 'Ready' }), /tui-badge--success/)
})

test('button defaults to type button, blocks interaction when loading', () => {
  assert.match(render(Button, { loading: true, children: 'Saving' }), /disabled/)
  assert.match(render(Button, { children: 'Save' }), /type="button"/)
  assert.match(render(Button, { loading: true, children: 'Saving' }), /aria-busy="true"/)
})

test('text field associates label, hint and invalid state', () => {
  const html = render(TextField, { label: 'Name', error: 'Required', id: 'name' })
  assert.match(html, /for="name"/)
  assert.match(html, /aria-invalid="true"/)
  assert.match(html, /aria-describedby="name-help"/)
})

test('progress values clamp to valid range', () => {
  const html = render(Progress, { label: 'Build', value: 180 })
  assert.match(html, /aria-valuenow="100"/)
  assert.match(html, /width:100%/)
})

test('segmented options expose radiogroup state', () => {
  const html = render(SegmentedControl, {
    label: 'View', defaultValue: 'list',
    options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }],
  })
  assert.match(html, /role="radiogroup"/)
  assert.match(html, /aria-checked="true"/)
})

test('accordion hides non-expanded panels', () => {
  const html = render(Accordion, {
    items: [{ id: 'a', title: 'Question', content: 'Answer' }],
    defaultValue: null,
  })
  assert.match(html, /aria-expanded="false"/)
  assert.match(html, /hidden=""/)
})

test('tag input renders controlled values and labels', () => {
  const html = render(TagInput, { label: 'Tags', value: ['React'], maxTags: 3 })
  assert.match(html, /React/)
  assert.match(html, /aria-label="移除 React"/)
})

test('package exports point at actual built JS, declarations, and stylesheet', async () => {
  const packageUrl = new URL('../packages/react/package.json', import.meta.url)
  const { readFileSync, existsSync } = await import('node:fs')
  const manifest = JSON.parse(readFileSync(packageUrl, 'utf8'))
  const exportsToVerify = [
    manifest.exports['.'].import,
    manifest.exports['.'].types,
    manifest.exports['./styles.css'],
  ]
  for (const relativePath of exportsToVerify) {
    assert.ok(existsSync(new URL(relativePath, packageUrl)), relativePath + ' must exist')
  }
})

test('motion primitives render without browser globals', () => {
  assert.match(render(SpotlightCard, { children: 'Glow' }), /tui-spotlight/)
  assert.match(render(Marquee, { label: 'Logos', items: ['React', 'Vite'] }), /aria-hidden="true"/)
  assert.match(render(CopyButton, { text: 'npm install' }), /tui-copy/)
  assert.match(render(Skeleton, { avatar: true, lines: 3 }), /aria-busy="true"/)
})
