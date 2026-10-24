# TERMINAL/UI — 组件航站楼

像机场航显板一样翻动的 React 动效组件展示厅。每一个组件都是可交互的活演示，页面即文档。

## 技术栈

- **React 18** + **TypeScript**（strict）+ **Vite 5**
- 零运行时依赖（除 react/react-dom）
- 样式为单份全局 CSS（CSS 变量驱动的昼夜双主题）
- 默认主题跟随系统外观（`prefers-color-scheme`，首帧前内联脚本设定避免闪烁）；系统切换时实时跟随，用户手动切换一次后尊重手动选择

## 快速开始

```bash
npm install
npm run dev       # 开发服务器
npm run build     # 类型检查 + 生产构建（输出 dist/）
npm run preview   # 预览生产构建
```

## 目录结构

```
src/
├── main.tsx                # 入口
├── App.tsx                 # 布局装配 + scrollspy + 导航状态
├── styles/global.css       # 全局样式（双主题变量 + 全部组件样式）
├── lib/
│   ├── data.ts             # 组件元数据（侧边栏 / 指令面板共用）
│   ├── flap.ts             # 翻牌引擎（FlapCell / FlapBoardEngine，纯 DOM）
│   ├── scroll.ts           # rAF 平滑滚动 / 导航锁 / 剪贴板工具
│   └── hooks.ts            # useReveal（入场揭示）/ useClock
├── state/
│   └── app.tsx             # Theme / Toast Context
└── components/
    ├── Header.tsx          # 顶栏
    ├── Sidebar.tsx         # 左侧目录（分组 + 状态点 + 高亮）
    ├── Hero.tsx            # 翻牌大屏（C-00）+ 控制台
    ├── CompSection.tsx     # 组件展示块统一骨架
    ├── Odometer.tsx        # C-01 里程表
    ├── Marquee.tsx         # C-02 跑马灯（离屏自动暂停）
    ├── OtpInput.tsx        # C-03 验证码输入
    ├── Stepper.tsx         # C-04 数字步进器（长按连发）
    ├── Segmented.tsx       # C-05 分段控制（联动大屏速度）
    ├── PaletteCard.tsx     # C-06 演示卡
    ├── CommandPalette.tsx  # C-06 指令面板浮层（⌘K）
    ├── CopyButton.tsx      # C-07 复制按钮
    ├── ThemeSwitch.tsx     # C-08 主题开关
    ├── HoldToBoard.tsx     # C-09 长按登机（rAF 进度环）
    ├── SeatMap.tsx         # C-10 座位图（懒加载）
    ├── Autocomplete.tsx    # C-11 机场联想输入（懒加载）
    ├── DetentDrawer.tsx    # C-12 阻尼抽屉（卡点吸附，懒加载）
    ├── RotaryKnob.tsx      # C-13 旋转旋钮（懒加载）
    ├── SkeletonLoader.tsx  # C-14 骨架屏（懒加载）
    ├── SlideToConfirm.tsx  # C-15 滑动确认（懒加载）
    ├── TiltCard.tsx        # C-16 倾斜卡片（懒加载）
    ├── EscapeButton.tsx    # C-17 逃跑按钮（懒加载）
    ├── MagnifyingDock.tsx  # C-18 放大坞栏（懒加载）
    ├── ReactionBurst.tsx   # C-19 点赞爆裂（懒加载）
    ├── Clock.tsx           # 独立时钟（隔离每秒重渲染）
    └── BoardingPass.tsx    # 登机牌页脚
```

## 性能要点

- 平滑滚动为 rAF 自实现，不依赖 CSS `scroll-behavior`
- 翻牌大屏滚出视口自动停翻（IntersectionObserver 门控）
- 跑马灯滚出视口自动暂停（`animation-play-state`）
- 长按登机的 rAF 循环空闲即停；百分比文字 ref 直写，不触发 React 渲染
- `.comp` 区块启用 `content-visibility: auto`，视口外跳过渲染与布局；导航定位前强制渲染保证落点精确
- 时钟隔离在 `<Clock />` 叶子组件内，每秒重渲染不再波及 Header / Hero
- C-10 ~ C-14 通过 `React.lazy` 代码分割（独立 chunk，主包解析后异步加载，不阻塞首屏渲染）
- 旋钮拖拽帧内只写 transform，整数变化才 setState
- 尊重 `prefers-reduced-motion`

## 跨组件通信

组件间通过 `window` CustomEvent 解耦：

| 事件                  | 方向                     | 作用             |
| --------------------- | ------------------------ | ---------------- |
| `terminal:speed`      | Segmented → Hero         | 切换大屏翻牌速度 |
| `terminal:flip-random`| CommandPalette → Hero    | 随机翻一句话     |
