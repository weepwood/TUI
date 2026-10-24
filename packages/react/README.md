# @weepwood/terminal-ui

个人通用 React 组件包，保留 TERMINAL/UI 的琥珀色、精细动效与轻量视觉设计。目前提供十八个组件，独立于航班数据和展示站状态运行。

> 版本 0.1.0 为首批可复用组件 API。尚未发布 npm；需要从本仓库构建并打包后本地安装。

## 使用

在仓库根目录执行：

```bash
npm ci
npm run build:lib
npm pack ./packages/react
```

在 React 项目中安装生成的 .tgz 文件，之后：

```tsx
import { ThemeScope, Button, Badge, TextField, SegmentedControl } from '@weepwood/terminal-ui'
import '@weepwood/terminal-ui/styles.css'

export function Example() {
  return (
    <ThemeScope theme="dark">
      <Badge tone="accent">TERMINAL/UI</Badge>
      <Button onClick={() => alert('Hello')}>开始</Button>
      <TextField label="项目名称" placeholder="输入项目名称" />
      <SegmentedControl
        label="视图类型"
        options={[{ value: 'grid', label: '网格' }, { value: 'list', label: '列表' }]}
        defaultValue="grid"
      />
    </ThemeScope>
  )
}
```

## API

| 组件 | 主要参数 | 用途 |
| --- | --- | --- |
| ThemeScope | theme: light/dark | 局部主题容器，不修改 html/body |
| Button | variant, size, loading | 四种按钮风格和忙碌状态 |
| Badge | tone | 状态标签 |
| Card | elevated | 通用内容容器 |
| TextField | label, hint, error | 可访问的输入与错误提示 |
| SegmentedControl | options, value/defaultValue, onValueChange | 受控/非受控选项切换 |
| Accordion | items, value/defaultValue, onValueChange | 可访问的单开折叠面板 |
| TagInput | value/defaultValue, onValueChange, maxTags | 标签输入与去重 |
| Progress | label, value, max | 带 ARIA 标记的进度条 |
| SpotlightCard | glowSize, onPointerMove | 指针聚光卡片 |
| Marquee | items, duration, reverse, pauseOnHover | 可配置纯文本循环跑马灯 |
| CopyButton | text, onCopy, onCopyError | 剪贴板复制和成功提示 |
| Skeleton | lines, avatar, label | 可访问的骨架占位 |
| OtpInput | length, value/defaultValue, onValueChange, onComplete | 自动跳格 / 粘贴 / 键盘输入 |
| Stepper | min, max, step, repeatOnHold | 长按连发的数值步进器 |
| RangeSlider | min, max, step, value/defaultValue | 基于原生 range 的滑块 |
| UploadDropzone | accept, maxFiles, value/defaultValue, onFilesChange, onReject | 纯本地文件选择及校验 |
| FlipBoard | value, columns, align, duration, stagger, label | 通用 split-flap 机械翻牌屏 |

CopyButton 依赖安全上下文中的 Clipboard API，失败时触发 onCopyError，不会假装成功。Marquee 的 items 为纯文本，避免克隆可交互元素造成重复 Tab 焦点。

OTP 的 `onComplete` 仅代表填写了所有数字，不代表服务端校验通过。可通过 `value` 和 `onValueChange` 重置或受控输入。步进器的长按只在指针设备上启用，键盘可以通过原生按钮点击操作。

UploadDropzone **不执行上传**，只返回浏览器 `File[]` 给调用方；`accept` 检查同样适用于拖入文件。请在应用侧处理文件上传、大小限制和安全扫描。浏览器对 MIME 的报告可能为空，建议设置扩展名过滤作为补充。

所有 CSS 使用 tui- 前缀，不注入全局 reset，不依赖展示站的 Context。主题通过 CSS 变量覆盖：

```css
.my-terminal-theme {
  --tui-accent: #60a5fa;
  --tui-radius: 16px;
}
```

将该 class 应用于 ThemeScope 即可。默认采用暗色风格，所有组件尽可能提供原生键盘操作及可访问标签。

详细翻牌 API 和使用示例见 [FlipBoard 指南](../../docs/FLIPBOARD.md)。

## 版本政策

- React 18/19 peer dependency；构建时不会把 React 打入组件包。
- 主站原有 32 个演示组件暂时是展厅代码，**不能**认为都已提取为公共 API。
- 后续逐步迁移动效组件；每个迁移必须完成数据/事件解耦、键盘与 ARIA、样式隔离、类型与测试。
- 因私有仓库尚未声明可再分发的开源许可，当前包标记 UNLICENSED。发布前应明确授权方案。
