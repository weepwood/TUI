# Weepwood UI 组件文档体验改造

**参考**：[Planes / Segmented Control](https://useplanes.com/components/segmented-control)，研究日期 2026-10-25。

这次参考的是文档信息架构与交互节奏，不是 1:1 复制 Plane 的品牌、视觉资源或受限组件源码。目标是让 Weepwood UI 从“多卡片演示墙”变成可以检索、深入阅读和直接体验的**通用组件文档站**。

## 参考页面的结构

- 左侧：持续可见的类别导航与组件名称列表；按 Controls、Text 等类别组织。
- 内容：组件名称、付费/免费信息、实时演示、安装命令、Usage/Props、适用场景、相关组件。原始页面来源见 [useplanes.com](https://useplanes.com/components/segmented-control)。
- 对单个组件提供详细使用方式、适合的操作模式，而不只提供一个短的代码片段。

## 本仓库的实际实现

| 内容 | 实现方式 |
| --- | --- |
| 左侧搜索与分类 | DocsExplorer 的按组目录、搜索框、当前项高亮，支持 Cmd/Ctrl+K 聚焦 |
| 主区 | 独立详情页 + 页内锚点：预览、安装、用法、Props、场景、相关 |
| 即时演示 | 复用现有各组件的交互状态；SegmentedControl 新增独立的三组状态演示 |
| Live Preview / Code | 显示可交互控件或代码片段；复制操作明确反馈 |
| 导航 | \`?component=segmented-control\` 等查询路由；后退/前进 \`popstate\` 同步 |
| 卡片总览 | \`?view=gallery\`，完整保留原来 24 个组件墙及设计变量区 |
| 布局适配 | 三栏（分类/内容/TOC），窄屏两栏，手机折叠目录 |
| 组件效果 | SegmentedControl 改为可动选中背景；CSS 和键盘语义兼容原 API |
| 实际安装 | 目前未发布 npm，安装区只给出真实可执行的本地 \`npm pack\` 步骤 |

## 外观设计

继续保持 Weepwood UI 的灰阶、蓝色强调和暗/亮色主题，使用自主设计的分割线、卡片、代码块和点阵预览画布。文档站采用克制的字号层级和足够留白；独立组件预览使用局部 CSS 变量，与业务页面解耦。

## 验收

执行 \`npm run check\` 和 \`npm pack --dry-run ./packages/react\`。静态测试确认 24 组件导航、查询路由、文档区块、安装真实情况、SegmentedControl ARIA 与选中动画样式。

**尚不构成完整浏览器验收**：后续需增加 Playwright 对移动目录、后退路由、对话框焦点、分段滑动动画和跨主题对比度进行端到端验证。

## 后续可考虑

- 单组件的完整可执行代码片段和可编辑 Props 面板；
- registry 安装、独立子路径导入、Storybook 和自动截图回归；
- JSON 元数据自动生成文档，减少当前 catalog 与 docs-data 的双处编辑。

仓库保持私有；不会自动发布 npm 或部署公开文档。
