# Weepwood UI — 设计系统规范

## 基本原则

- 视觉足够中性，适合效率工具、桌面客户端管理面板、工作台、后台和个人网站。
- 保持舒适的留白和易区分的内容层级；少用高饱和大面积色块。
- 默认浅色（可切换深色），强调色用于关键操作、当前状态和焦点，不是页面背景装饰。
- 只在表达状态变化时使用动效；遵守 prefers-reduced-motion。

## 主色与灰阶

| Token | 浅色 | 深色 |
| --- | --- | --- |
| --tui-bg | #f6f8fb | #111821 |
| --tui-surface | #ffffff | #1b2531 |
| --tui-surface-raised | #eef2f8 | #263241 |
| --tui-text | #182335 | #f0f4fb |
| --tui-muted | #64748a | #aab8cc |
| --tui-accent | #365de6 | #90b0ff |
| --tui-success | #158261 | #6adeb1 |
| --tui-danger | #ca4154 | #fb8e99 |

- --tui-border、--tui-ring、--tui-shadow 为依主题自动切换的半透明 Token。
- --tui-accent-text 为强调色上的文本色，浅色主题使用白色，深色主题使用深蓝色。
- --tui-radius 默认 12px，组件可在局部覆盖。
- 组件库预览可把强调色切换成紫色或绿色，不影响公共 API。

## 使用建议

```tsx
import { ThemeScope, Button, Card } from '@weepwood/terminal-ui'
import '@weepwood/terminal-ui/styles.css'

export function Panel() {
  return (
    <ThemeScope theme="light" className="my-theme">
      <Card><Button>保存</Button></Card>
    </ThemeScope>
  )
}
```

```css
.my-theme {
  --tui-accent: #7048ca;
  --tui-ring: rgba(112, 72, 202, .24);
  --tui-radius: 14px;
}
```

只修改 CSS Tokens 即可整体调色；不要覆盖页面级 html、body 或跨项目的全局 button 等选择器。若修改强调色需自行确保文本与焦点对比度。
