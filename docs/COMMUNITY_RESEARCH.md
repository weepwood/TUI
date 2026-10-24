# Weepwood UI · X 与 GitHub 组件库调研（2026-10-25）

本次只借鉴公开项目的**交互模式、呈现方式与 API 设计思想**。新组件均重新编写，未复制第三方组件源码，也没有引入其代码版权文件。此研究不构成授权审查；将来复制代码或资源时必须逐项核对许可证。

| 参考 | 平台 | 值得学习的设计 | 对 Weepwood UI 的应用 |
| --- | --- | --- | --- |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | GitHub | 开放可编辑的组合式 API、主题变量和 registry 规范 | 保留模块化 TSX、独立 types、ThemeScope；规划未来 registry |
| [Radix Primitives](https://github.com/radix-ui/primitives) / [文档](https://www.radix-ui.com/primitives/docs/overview/introduction) | GitHub | aria 模式、键盘导航、焦点恢复、受控和非受控状态 | 新建 Tabs、Switch、Dialog、Tooltip；仍需浏览器测试 |
| [Origin UI](https://github.com/shadcn/originui) | GitHub | 聚焦表单和应用型 UI、丰富的输入控件变体 | 新建通用开关、标签页、反馈组件，延续中性配色 |
| [React Bits](https://github.com/DavidHDev/react-bits) | GitHub | 交互演示与预设驱动的动效展示 | 新增 CountUp，展示页可实时修改数值 |
| [Magic UI](https://github.com/magicuidesign/magicui) | GitHub | 动效分层、一个区域一个视觉锚点、减少动态偏好 | 避免全面叠加发光效果；仅为交互反馈使用轻动效 |
| [Kibo UI](https://github.com/shadcnblocks/kibo) | GitHub | 将复合交互拆分为可复用构建块 | 标签/对话框的状态和内容分离，今后扩展复合控件 |

## X 上的设计师/社区信号

- [shadcn 发布 CLI v4 和主题预览能力](https://x.com/shadcn/status/2029974151427989567)：配色、圆角、字体的修改需要在真实组件样式上立即反馈，而非只有调色板。
- [Magic UI 创建者 Dillion 的组件库介绍](https://x.com/dillionverma/status/1793401212114801097)：动效应作为独立、可选择的 UI 增强，不应成为每个控件的强制行为。
- [Origin UI 创建者关于底层组件的讨论](https://x.com/pacovitiello/status/1887097217393070112)：共享基础控件与设计变量比复制表面样式更易于持续演进。
- [社区分享 React Bits 动画组件](https://x.com/madewith_react/status/1895061324322812010)：独立可交互的效果卡片便于用户判断动画的实际适用场景。
- [21st.dev 的社区组件展示](https://x.com/21st_dev)：可参考发现、筛选、预览工作流，而不是无差别安装所有组件。

这些 X 来源为公开贴文与摘要，并非覆盖所有讨论的定量统计；不能据此推断全网流行度排序。

## 本轮实施：从 18 至 24 个

| 新组件 | 关键能力 | UI 使用场景 |
| --- | --- | --- |
| Switch | role=switch、aria-checked、受控/非受控、禁用 | 桌面设置、偏好面板 |
| Tabs | role=tablist/tab/tabpanel、方向键、Home/End、禁用 | 工作台内容分区 |
| Tooltip | hover、focus、Escape、aria-describedby | 图标说明、快捷键提示 |
| Dialog | Escape、模态焦点循环、关闭恢复焦点、footer 插槽 | 表单、确认、设置 |
| EmptyState | 自定义图标、描述、操作插槽 | 列表空结果 |
| CountUp | rAF 数值过渡、SSR 初始值、reduced-motion | 仪表盘 KPI |

## 展示站改善

- **新增筛选**：一键查看本轮六个新组件；组件卡片明确标识 NEW。
- **紧凑视图**：网格和紧凑密度一键切换；响应式列数按宽度调整。
- **统一动效尺度**：卡片轻微浮现、Modal 进场及数字补间；减少动态偏好时跳过装饰动画。
- **预览可操作**：开关、标签页、对话框、空状态和数字补间都能实际点击操作。

## 下一轮优先级

1. 使用 Playwright + axe-core 做浏览器键盘/焦点/视觉回归，不再只靠 SSR 烟测；先为 Dialog、Tabs、Switch 加交互测试。
2. 为 Dialog 补多模态叠加、嵌套容器和滚动锁计数处理；Tooltip 补复杂边界定位。
3. 在单独 package 或 story 环境补 Storybook/MDX 文档、属性编辑器和组件截图，而不是在主站写过重交互逻辑。
4. 考虑可选 registry（参考 shadcn 结构），同时保留当前稳定的 npm 包发布路径。

## 明确的边界

本轮保持 React 18、TypeScript、原生 CSS Tokens，不增加新运行时依赖；保留已有私有仓库和 UNLICENSED，**不自动合并、不发布 npm**。
