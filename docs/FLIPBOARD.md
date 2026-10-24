# FlipBoard — 通用翻牌显示组件

将原展厅的“机场航显板”视觉语言抽象成一般文本动画；组件并不绑定机票、航班或状态数据。

## 使用示例

```tsx
import { useState } from 'react'
import { FlipBoard, ThemeScope } from '@weepwood/terminal-ui'
import '@weepwood/terminal-ui/styles.css'

function Demo() {
  const [value, setValue] = useState('READY')
  return (
    <ThemeScope theme="dark">
      <FlipBoard value={value} columns={12} align="center" label="设备状态" duration={500} stagger={28} />
      <button onClick={() => setValue('RUNNING')}>切换状态</button>
    </ThemeScope>
  )
}
```

## API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| value | string 或 readonly string[] | 必填 | 普通文本，换行或数组形成多行 |
| columns | number | 最长行的长度 | 每行列数，1–32 |
| align | left/center/right | left | 较短行的填充方式 |
| duration | number | 500 | 单格翻牌毫秒数，0 禁用动效 |
| stagger | number | 28 | 列间错峰毫秒数 |
| label | string | 无 | 屏幕阅读器读出文字的语境 |
| className | string | '' | 容器附加样式 |

- 最多展示 12 行，每行 32 个 Unicode code points，超出部分裁剪，避免巨量 DOM。
- 每格翻牌由 CSS 3D 上/下半叶配合完成，父组件文本立即更新 aria-label；不依赖自定义全局事件。
- prefers-reduced-motion: reduce 时立即呈现新文字；SSR 直接显示当前内容。
- 动画是视觉呈现，不提供完成时精确计时 API。若需要与业务计时同步，应在调用方单独建模状态。
- 复杂 Unicode 字形（例如组合附加符号及 emoji ZWJ）可能占据多个 cell，下一步可使用 Intl.Segmenter 进行 grapheme 分段。
