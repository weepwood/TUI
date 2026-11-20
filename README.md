# UI / PLAYGROUND — 通用组件展示库

一个可交互的 React UI 展示与灵感项目，涵盖按钮、表单、导航、反馈、动效和微交互，共 **37 个组件演示**。每个组件都可以直接操作，页面即文档；机场翻牌屏保留为项目的动效名片。

基础控件强调语义、可访问性和常见状态；动效组件则展示更具表现力的交互。部分交互参考了 [Bencho](https://bencho.dev)、[Magic UI](https://magicui.design) 与 [ReactBits](https://reactbits.dev)，全部零依赖手工实现。

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

## GitHub Pages 部署

仓库通过 `.github/workflows/deploy-pages.yml` 自动构建并发布到 GitHub Pages：合并/推送到 `main` 后部署；Pull Request 会运行构建验证，手动运行可在 Actions 中选择 `Deploy UI Playground to GitHub Pages` 并点击 **Run workflow**。

首次启用时，在仓库 **Settings → Pages → Build and deployment** 将 **Source** 设为 **GitHub Actions**。构建会自动使用 `/TUI/` 作为仓库站点路径，部署成功后可从该页面查看站点地址。

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
    ├── RangeSlider.tsx     # C-20 滑杆（懒加载）
    ├── ProgressSteps.tsx   # C-21 登机步骤条（懒加载）
    ├── Accordion.tsx       # C-22 手风琴（Magic UI 风格，懒加载）
    ├── TagInput.tsx        # C-23 标签输入（懒加载）
    ├── UploadDropzone.tsx  # C-24 上传区（Magic UI FileUpload 参考，懒加载）
    ├── TextScramble.tsx    # C-25 乱码解码（ReactBits Decode Text 参考，懒加载）
    ├── StarRating.tsx      # C-26 星级评分（懒加载）
    ├── Checklist.tsx       # C-27 登机清单（描画对勾+划除，懒加载）
    ├── SpotlightCard.tsx   # C-28 聚光卡片（Magic UI Spotlight，懒加载）
    ├── CardSwap.tsx        # C-29 卡片堆叠（Bencho Card Swap，懒加载）
    ├── TimeScrubber.tsx    # C-30 起飞时间轴（Bencho Time Scrubber，懒加载）
    ├── DestCarousel.tsx    # C-31 目的地轮播（scroll-snap，懒加载）
    ├── ButtonShowcase.tsx # C-32 按钮变体与加载态
    ├── StatusShowcase.tsx # C-33 状态徽标与可关闭提示
    ├── TabsShowcase.tsx   # C-34 键盘可访问标签页
    ├── DialogShowcase.tsx # C-35 对话框与焦点返回
    ├── FormShowcase.tsx   # C-36 常见表单控件
    ├── Clock.tsx           # 独立时钟（隔离每秒重渲染）
    └── BoardingPass.tsx    # 登机牌页脚
```

## 通用 UI 基础组件

新增 FOUNDATIONS 分组，优先覆盖真实产品里最常用的界面构件：

- **Buttons**：语义变体、尺寸、加载状态与收藏交互
- **Badges & Alerts**：状态徽标、成功/信息/警告/错误提示和关闭行为
- **Tabs**：方向键切换、焦点管理与关联面板
- **Dialog**：Escape/遮罩关闭、语义标记与焦点回归
- **Form basics**：文本框、邮箱、下拉选择、复选框和提交状态

旧有的机场主题演示作为动效组件类别保留；整体入口现在默认展示完整组件库，便于快速浏览，而不是直接跳到单一的机场翻牌屏。

## 组件提示词与样式变体

- 每个组件都附带「AI 生成提示词」：点击区块头 `✦ 提示词` 按钮**一键复制**（按钮短暂变绿「✓ 已复制」），不展开任何面板
- **样式变体机制**：同一组件、不同提示词 → 不同样式。启用变体的组件（OTP、复制按钮、
  滑动确认、滑杆、步骤条、标签输入、星级、聚光卡片、卡片堆叠）可在 `经典 CLASSIC / 霓虹 NEON / 纸感 PAPER`
  之间切换——演示区挂作用域 class 重定义 CSS 变量组，子组件整体换装；
  复制的提示词会自动拼接当前变体的风格描述，让 AI 生成对应样式
- 新增变体只需在 `data.ts` 的 `VARIANTS` 里加一项（label + 作用域 class + 风格后缀），
  并在 `MULTI_VARIANT_IDS` 中启用目标组件

## 浏览模式

- **总览 GALLERY（默认）**：完整组件库按基础控件、文本、输入、反馈和动效分组展示，首屏从基础 UI 组件开始浏览
- **单页 PAGE**：侧边栏选择组件进入聚焦查看；`↑/↓`（或滚轮、底部按钮）切换组件，`←/→` 切换样式变体（仅有多样式的组件生效），`ESC` 返回总览；URL 同步为 `?view=c05`，可分享、可后退

## 组件提示词

每个组件都附带一段「AI 生成提示词」（描述交互与视觉的实现要点）：
区块标题旁的 `✦ 提示词` 按钮一键复制；单页查看器内同样可用。

## 性能要点

- 平滑滚动为 rAF 自实现，不依赖 CSS `scroll-behavior`
- 翻牌大屏滚出视口自动停翻（IntersectionObserver 门控）
- 跑马灯滚出视口自动暂停（`animation-play-state`）
- 长按登机的 rAF 循环空闲即停；百分比文字 ref 直写，不触发 React 渲染
- `.comp` 区块启用 `content-visibility: auto`，视口外跳过渲染与布局；导航定位前强制渲染保证落点精确
- 时钟隔离在 `<Clock />` 叶子组件内，每秒重渲染不再波及 Header / Hero
- C-10 及后续组件通过 `React.lazy` 代码分割（独立 chunk，主包解析后异步加载，不阻塞首屏渲染）
- 旋钮拖拽帧内只写 transform，整数变化才 setState
- 尊重 `prefers-reduced-motion`

## 跨组件通信

组件间通过 `window` CustomEvent 解耦：

| 事件                  | 方向                     | 作用             |
| --------------------- | ------------------------ | ---------------- |
| `terminal:speed`      | Segmented → Hero         | 切换大屏翻牌速度 |
| `terminal:flip-random`| CommandPalette → Hero    | 随机翻一句话     |
