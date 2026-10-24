# Weepwood UI

一个面向个人项目的 **React 通用组件库与设计系统**。从特定场景的视觉演示转型为简洁、中性、可复用的 UI 组件和交互实验室。

> 仓库路径暂保留为 weepwood/terminal-ui，包名暂保留为 @weepwood/terminal-ui，以免破坏已创建的 PR 和未来的包导入路径。页面品牌统一使用 **Weepwood UI**。当前仓库是私有仓库，组件包尚未发布到 npm。

## 设计方向

- **非业务主题**：不使用机场、登机、航班等行业概念，所有公开组件通过 Props 接收数据。
- **中性视觉**：浅色默认、深色可切换；灰阶背景、细边框、柔和阴影、蓝色强调色。
- **可自定义**：ThemeScope 局部主题 + --tui-* CSS Design Tokens；预览站支持蓝/紫/绿强调色。
- **组件优先**：独立 React + TypeScript 包，支持受控/非受控状态、基础键盘操作和无障碍属性。
- **展示即文档**：组件实时预览、分类搜索、API 使用代码与主题变量预览。

## 运行

```bash
npm ci
npm run dev           # 默认进入文档式组件详情页（参考 Planes 的信息结构）
                      # ?component=segmented-control 直接访问分段控制文档
                      # ?view=gallery 访问原有互动卡片总览
npm run check         # 组件站构建、独立包、类型声明和测试
npm run build:lib     # packages/react/dist
npm pack ./packages/react
```

两个入口（`/` 和 `/library.html`）均采用同一个应用，默认打开**文档式组件详情页**。侧栏按组件分类导航，中间包括演示、安装、使用示例、属性表、场景和相关组件。组件间切换使用 `?component=<slug>`，支持刷新与前后退；原卡片墙在 `?view=gallery` 保留。原专题演示源码仍保留在 src/App.tsx、src/components 和 src/styles/global.css 等文件中以便后续无损迁移，但已不再作为首页入口参与生产站点构建，也不包含在可安装组件包内。

## 独立视觉实验：柔和渐变封面墙

- 入口：[`examples/noise-gradient-cover-wall.html`](./examples/noise-gradient-cover-wall.html)，运行 `npm run dev` 后访问 `/examples/noise-gradient-cover-wall.html`。
- 不依赖 React、图片、外部 CSS 或 JS：单文件 HTML + CSS + Canvas + SVG，包含六组色彩、五种细线纹样、像素级噪点、弹簧悬停、降低动态偏好适配。
- 这是**自包含的视觉实验版本**，与 React 正式导出的渐变封面组件一起维护；独立页面已经加入 Vite 多页面构建，可直接复制单文件使用，另有 GradientCoverCard / GradientCoverWall 正式 React 公开组件。

## 当前组件

共 **26 个**：

| 分类 | 组件 |
| --- | --- |
| 基础 | Button, Badge, CopyButton, ThemeScope |
| 输入 | TextField, SegmentedControl, TagInput, OtpInput, Stepper, RangeSlider, UploadDropzone, Switch |
| 展示 | Progress, Skeleton, Marquee, FlipBoard, CountUp, GradientCoverCard, GradientCoverWall |
| 容器 | Card, Accordion, SpotlightCard, Tabs |

| 反馈 | Dialog, Tooltip, EmptyState |

FlipBoard 是通用数字/文字翻页效果，而非行业专用显示屏；不会额外捆绑业务状态或航班数据。

## 技术与文档

- React 18 + TypeScript + Vite；React 为独立包 peer dependency。
- 组件包不依赖展示站业务 Context、路由或者全局主题。
- [参考 Planes 的组件文档展示改造](./docs/DOCS_PRESENTATION.md)
- [社区组件库研究与迁移记录](./docs/COMMUNITY_RESEARCH.md)
- [组件包安装与 API](./packages/react/README.md)
- [设计规范与 Tokens](./docs/DESIGN_SYSTEM.md)
- [架构与迁移计划](./docs/ARCHITECTURE.md)
- [FlipBoard API](./docs/FLIPBOARD.md)

## 发布与审查

本项目的 React 包目前使用 UNLICENSED、尚未公开发行。所有变更通过独立 PR 审核，**不会自动合并、发布 npm 或部署站点**。历史组件中的特定业务文案仅作为尚未抽离的遗留源码保存；未来迁移新组件时必须移除这些业务耦合。
