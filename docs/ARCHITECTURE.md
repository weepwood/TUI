# Weepwood UI — 组件库架构

## 当前分层

1. src/library-demo.tsx — 正式交互式组件目录；index.html 与 library.html 均加载它。
2. src/styles/library-demo.css — 仅展示应用样式；不属于可发布组件。
3. packages/react/src — 18 个正式 React 公共组件和中性的 `tui-*` CSS Tokens。
4. packages/react/dist — 独立 ESM、样式和类型声明（生成文件，不提交）。
5. src/App.tsx、src/components、src/lib、src/styles/global.css、src/state — 历史专题展示代码，保留迁移价值，但已退出生产页面入口。

## 核心约束

- 统一视觉品牌为 Weepwood UI；展示页不出现垂直行业的视觉符号。
- 中性的公共属性与事件，例如 value/onValueChange，不编码场景术语。
- 已存在的 CSS 类名 tui- 和包名 @weepwood/terminal-ui 暂时保留以维护 API 兼容性；面向用户的视觉身份与包命名解耦。
- 所有组件样式受 ThemeScope 局部作用域约束，不给宿主页面注入通配 reset。
- 浅色、深色、语义色、间距与圆角通过 Tokens 控制，并遵守 reduced-motion。
- 数据和展示分离：预览站例子必须是一般项目场景，不能重新把专题数据引入组件包。

## 后续计划

- StarRating、Checklist、Odometer、TextScramble、TiltCard、MagnifyingDock、CardSwap 等历史效果，逐个抽成通用组件。
- 增加浏览器交互测试、键盘导航测试、Storybook，以及色彩对比度/视觉回归检测。
- 若需跨框架复用，独立 packages/vue；避免以 React 包装 Vue。
- 需要更名 npm 包时，通过明确的迁移版本和兼容导出进行，不静默中断旧路径。

## 质量门槛

```bash
npm run check
npm pack --dry-run ./packages/react
```

GitHub Actions 在 PR 中运行构建、SSR 测试和静态风格回归断言。静态检查只保证入口和变量没有倒退，不能代替浏览器截图/交互测试。

## 安全与发布

继续保留仓库私有和包 UNLICENSED，不自动 npm 发布，不自动合并 PR。
