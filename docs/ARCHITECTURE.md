# TERMINAL/UI 组件库演进规划

## 目标

从「一次性演示」迁移为「可以安装、调用、换肤、测试和升级的个人组件库」。保留原展示站，不破坏现有 32 个实验组件。

## 仓库结构

- packages/react/src：公共 React 组件实现与统一设计 Tokens，不能 import src/state、src/lib/data 或 src/styles/global.css。
- packages/react/dist：独立组件构建的 ESM / CSS / TypeScript 声明（构建产物，不提交）。
- src/components：旧动效展示站（示范用途；多数组件包含机场数据或展示站依赖）。
- src/library-demo.tsx + library.html：公共 API 独立预览。
- src/App.tsx + index.html：原有组件展厅。
- scripts/library.test.mjs：公共导出 SSR 烟测，CI 自动执行。

## 第一阶段已纳入公共 API

ThemeScope、Button、Badge、Card、TextField、Progress、SegmentedControl、Accordion、TagInput。

### 公共组件的准入要求

1. 不包含机场等业务语义或固定演示数据。
2. props 显式声明，交互状态支持外部控制或合理默认。
3. 无对 window CustomEvent 或展示站 Context 的强制依赖。
4. CSS 只作用于本组件；不得引入通配的 html/body/button reset。
5. 支持键盘操作、label/aria 关系和 reduced-motion。
6. 完成 npm 包的生产构建和最小渲染测试。
7. 对修改公共 props 的升级遵守语义化版本。

## 后续迁移优先级（待实施）

- P1 输入与反馈：OtpInput、RangeSlider、Stepper、CopyButton、UploadDropzone、StarRating、Checklist。
- P2 动效组件：Marquee、Odometer、TextScramble、TiltCard、SpotlightCard、MagnifyingDock、CardSwap。
- P3 复杂交互：CommandPalette、DetentDrawer、TimeScrubber、SeatMap、DestCarousel、RotaryKnob。
- P4 split-flap：拆解 src/lib/flap.ts 为可配置引擎 + React 包装层，移除机场文案硬编码。
- 未来可加单独 packages/vue，但不应把 React 包简单包装为 Vue 组件。

## 测试与发布

- npm run check 在本地运行站点构建、独立组件构建和 SSR 回归。
- .github/workflows/ci.yml 对 PR 自动运行相同验证及 npm pack dry-run。
- 首次生产发布前再增加交互测试（React Testing Library/Vitest）、视觉回归、无障碍自动检测与 Changesets 版本管理。
- 没有自动 npm publish 或 GitHub Pages 部署动作，以避免对私有代码意外公开。
