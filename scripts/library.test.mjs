import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Button, Badge, Card, ThemeScope, TextField, Progress, SegmentedControl, Accordion, TagInput, SpotlightCard, Marquee, CopyButton, Skeleton,
  OtpInput, Stepper, RangeSlider, UploadDropzone, acceptsFile, pickFiles,
  FlipBoard, formatFlipRows,
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


test('OTP is controlled, numeric-only and exposes named cells', () => {
  const html = render(OtpInput, { label: 'One time code', value: '9a4-12', length: 4 })
  assert.equal((html.match(/class="tui-otp__cell/g) || []).length, 4)
  assert.match(html, /value="9"/)
  assert.match(html, /value="4"/)
  assert.match(html, /value="1"/)
  assert.match(html, /value="2"/)
  assert.match(html, /aria-label="One time code/)
})

test('Stepper clamps controlled values and disables boundary buttons', () => {
  const html = render(Stepper, { label: 'Seats', value: 20, min: 1, max: 9 })
  assert.match(html, /class="tui-stepper__value"/)
  assert.match(html, />9<\/output>/)
  assert.match(html, /aria-label="增加 Seats" disabled=""/)
})

test('RangeSlider uses an accessible native input and clamps value', () => {
  const html = render(RangeSlider, { label: 'Volume', value: -20, min: 0, max: 100 })
  assert.match(html, /type="range"/)
  assert.match(html, /value="0"/)
  assert.match(html, /<label for="/)
})

test('UploadDropzone exposes a native picker and does not upload', () => {
  const html = render(UploadDropzone, { label: 'Attachments', accept: '.png', maxFiles: 3 })
  assert.match(html, /type="file"/)
  assert.match(html, /accept="\.png"/)
  assert.match(html, /0\/3/)
})

test('file filtering checks extension and MIME, rejects duplicates and limits', () => {
  const pdf = { name: 'report.PDF', type: 'application/pdf', size: 10, lastModified: 1 }
  const other = { name: 'script.js', type: 'application/javascript', size: 11, lastModified: 2 }
  const png = { name: 'chart.png', type: 'image/png', size: 12, lastModified: 3 }
  assert.equal(acceptsFile(pdf, '.pdf,image/*'), true)
  assert.equal(acceptsFile(other, '.pdf,image/*'), false)
  assert.equal(acceptsFile(png, 'image/*'), true)
  const result = pickFiles([pdf], [pdf, other, png], 2, '.pdf,image/*')
  assert.equal(result.files.length, 2)
  assert.deepEqual(result.rejected.map(x => x.reason), ['duplicate', 'type'])
  const overflow = pickFiles([pdf, png], [{ name: 'another.pdf', type: 'application/pdf', size: 8, lastModified: 0 }], 2)
  assert.deepEqual(overflow.rejected.map(x => x.reason), ['limit'])
})


test('flip board formats rows for alignment and fixed width', () => {
  assert.deepEqual(formatFlipRows(['ABC', 'B'], 5, 'center').map(x => x.join('')), [' ABC ', '  B  '])
  assert.equal(formatFlipRows('ABCDEFGHIJK', 4)[0].join(''), 'ABCD')
  assert.equal(formatFlipRows('', 4)[0].join(''), '    ')
})

test('flip board renders SSR current text and a single accessible label', () => {
  const html = render(FlipBoard, { value: ['READY', 'GO'], columns: 5, label: 'Status', duration: 0 })
  assert.match(html, /role="img"/)
  assert.match(html, /aria-label="Status: READY \/ GO"/)
  assert.equal((html.match(/tui-flip__cell/g) || []).length, 10)
  assert.match(html, /aria-hidden="true"/)
})


test('disabled leading segmented option is skipped by roving tabindex', () => {
  const html = render(SegmentedControl, {
    label: 'Mode', options: [
      { value: 'legacy', label: 'Legacy', disabled: true },
      { value: 'modern', label: 'Modern' },
    ],
  })
  assert.match(html, /disabled="" tabIndex="-1"/)
  assert.match(html, /aria-checked="true"[^>]*tabIndex="0"/)
})
