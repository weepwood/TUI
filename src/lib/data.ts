/* 组件清单与常量：侧边栏、指令面板、演示共用同一份元数据 */

export type Status = 'BOARDING' | 'ON TIME' | 'DELAYED'

export interface CompMeta {
  id: string | null
  no: string
  en: string
  cn: string
  gate: string
  st: Status
  /** AI 生成提示词：描述该组件的交互与视觉，供一键复制 */
  prompt: string
}

export const COMPONENTS: CompMeta[] = [
  {
    id: 'c00', no: 'TR-101', en: 'SPLIT-FLAP BOARD', cn: '翻牌大屏', gate: 'TEXT', st: 'BOARDING',
    prompt: '用 React 实现机场航显板风格的机械翻牌屏：13 块翻牌单元，每格分上下两半页，翻转时旧字符上半页落下（渐暗）、新字符下半页合上（渐亮），用 CSS 3D rotateX + WAAPI；字符沿字轮逐格前进、逐列 62ms 错峰级联；支持输入自定义短语、多短语循环轮播、速度切换；深色面板、米白 Barlow Condensed 字符、琥珀点缀、扫描线质感。',
  },
  {
    id: 'c32', no: 'UI-201', en: 'BUTTONS', cn: '按钮', gate: 'ACTIONS', st: 'BOARDING',
    prompt: '实现通用按钮组件展示：primary、secondary、outline、ghost、destructive 五种语义变体，以及 small/default/large 尺寸；展示悬停、按下、键盘焦点、加载中状态。使用原生 button，保持清晰对比度与可访问焦点样式。',
  },
  {
    id: 'c33', no: 'UI-202', en: 'BADGES & ALERTS', cn: '徽标与提示', gate: 'FEEDBACK', st: 'BOARDING',
    prompt: '实现通用状态徽标与提示消息：default/primary/success/warning/error/outline 徽标；成功、信息、警告、错误四种 alert，图标、标题、说明和可关闭操作；语义色采用低饱和背景与高对比文字。',
  },
  {
    id: 'c34', no: 'UI-203', en: 'TABS', cn: '标签页', gate: 'NAVIGATION', st: 'BOARDING',
    prompt: '实现 accessible tabs 标签页组件：role=tablist/tab/tabpanel，选中态下划线动画，方向键切换并管理 tabIndex，aria-controls 与 aria-labelledby 正确关联；面板展示有层级的标题、文案与数据指标。',
  },
  {
    id: 'c35', no: 'UI-204', en: 'DIALOG', cn: '对话框', gate: 'OVERLAY', st: 'BOARDING',
    prompt: '实现可访问对话框：按钮打开居中弹层与遮罩，Escape 和点击遮罩关闭，关闭后焦点回到触发按钮；添加 aria-modal、标题和描述关联，提供取消与主操作。包含轻量淡入缩放动画。',
  },
  {
    id: 'c36', no: 'UI-205', en: 'FORM BASICS', cn: '表单基础', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现通用表单基础控件展示：带 label 的文本输入、email 输入、select、checkbox；精细的 focus/hover/checked 状态、分组布局、辅助说明和提交成功反馈；控件可键盘操作且 label 正确关联。',
  },
  {
    id: 'c01', no: 'TR-102', en: 'ODOMETER', cn: '里程表', gate: 'TEXT', st: 'ON TIME',
    prompt: '实现滚动数字里程表组件：每位数字一根垂直「字轴」（0-9 纵排），改变数值时用 transform: translateY 滚动到目标位，逐位错峰（右到左每位延迟 70ms），cubic-bezier 缓动 1.1s；六位数带千分位逗号；进入视口时从 000000 滚到目标值，按钮可随机加数再滚。',
  },
  {
    id: 'c02', no: 'TR-103', en: 'MARQUEE', cn: '跑马灯', gate: 'TEXT', st: 'ON TIME',
    prompt: '实现双行反向无缝跑马灯：内容复制两份首尾相接，CSS translateX(-50%) 无限循环，第二行 animation-direction: reverse；两侧 linear-gradient mask 淡出，hover 暂停；条目间用飞机符号分隔，明暗交替；离开视口时用 IntersectionObserver 暂停动画省电。',
  },
  {
    id: 'c03', no: 'TR-104', en: 'OTP INPUT', cn: '验证码输入', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现 6 位验证码输入组件：inputmode=numeric 唤起数字键盘；输入自动跳下一格，退格空格回跳上一格，整段粘贴自动分发；填满即校验，通过时格子变绿并显示成功提示；只允许数字。',
  },
  {
    id: 'c04', no: 'TR-105', en: 'NUMBER STEPPER', cn: '数字步进器', gate: 'INPUT', st: 'ON TIME',
    prompt: '实现数字步进器：+/- 圆按钮点按单步、长按 420ms 后进入 90ms 连发（pointer 事件 + 定时器）；数值变化带 scale 弹跳动画；下方一排座位灯随数值点亮，范围 1-9。',
  },
  {
    id: 'c05', no: 'TR-106', en: 'SEGMENTED CONTROL', cn: '分段控制', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现分段控制器：3 个选项共一个绝对定位滑块指示器，切换时 translateX 弹性过渡（cubic-bezier 回弹）；选中项琥珀高亮；指示器真的联动控制页面顶部翻牌大屏的轮播间隔。',
  },
  {
    id: 'c06', no: 'TR-107', en: 'COMMAND PALETTE', cn: '指令面板', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现 ⌘K 指令面板浮层：毛玻璃遮罩 + 居中面板；输入即时模糊过滤（多关键词 AND 匹配，中英文均可），↑↓ 键盘导航高亮，回车执行，ESC 关闭；条目分组（跳转/操作），跳转直达页面对应组件并短暂高亮闪烁。',
  },
  {
    id: 'c07', no: 'TR-108', en: 'COPY BUTTON', cn: '复制按钮', gate: 'FEEDBACK', st: 'ON TIME',
    prompt: '实现复制按钮：点击写入 navigator.clipboard，失败自动回退 execCommand；成功后图标从「复制」切换为绿色对勾、文案变「已复制」，1.8s 后复原；常与等宽字体命令展示框搭配。',
  },
  {
    id: 'c08', no: 'TR-109', en: 'THEME SWITCH', cn: '主题开关', gate: 'FEEDBACK', st: 'BOARDING',
    prompt: '实现主题开关：药丸轨道 + 圆形旋钮，切换时旋钮 cubic-bezier 回弹滑动，内部图标在太阳/月亮间切换；真实切换整站 data-theme（深色航站楼 ⇄ 米色纸质登机牌两套 CSS 变量），默认跟随系统 prefers-color-scheme。',
  },
  {
    id: 'c09', no: 'TR-110', en: 'HOLD TO BOARD', cn: '长按登机', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现长按充能按钮：SVG 圆环进度用 rAF 驱动 stroke-dashoffset，按住 0.9s 充满，中途松手 260ms 回弹；充满后变绿、放行一架飞机图标横穿卡片并弹 toast；空闲时 rAF 自动停转省电。',
  },
  {
    id: 'c10', no: 'TR-113', en: 'SEAT MAP', cn: '座位图', gate: 'INPUT', st: 'ON TIME',
    prompt: '实现机舱座位图：5 排 × 7 列（A-G，C/D 之间走道分隔）网格按钮；四种状态——可选（描边）、已选（琥珀填充+阴影+上浮）、占用（斜纹+禁用）、尊享排（右上角琥珀点）；最多选 3 座超限提示，图例 + 已选清单 + 一键清空。',
  },
  {
    id: 'c11', no: 'TR-114', en: 'AIRPORT LOOKUP', cn: '机场联想输入', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现机场联想输入：输入即时过滤 26 座机场（代码/中文城市/英文名 includes 匹配）；下拉候选项带代码徽章，↑↓ 导航、回车选中、ESC 收起；用 onMouseDown + preventDefault 防止输入失焦吞掉选中；选中后显示琥珀回显胶囊。',
  },
  {
    id: 'c12', no: 'TR-115', en: 'DETENT DRAWER', cn: '阻尼抽屉', gate: 'MOTION', st: 'BOARDING',
    prompt: '实现阻尼抽屉：三个高度卡点（收起/半开/全开）；pointer 拖拽直接改高度，越界时按 0.3 系数橡皮筋衰减；释放时若速度 >0.45px/ms 按方向吸附到下一个卡点，否则吸附最近卡点，ease-out 300ms 内完成；卡点胶囊按钮可直达。',
  },
  {
    id: 'c13', no: 'TR-116', en: 'ROTARY KNOB', cn: '旋转旋钮', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现旋转旋钮：指针拖拽时用 atan2 计算相对中心的角度（0°=正上方），映射到 -135°~135°、值 0-100；旋钮 transform 直接 ref 写入，仅整数变化才 setState；外圈 11 个刻度随值点亮，配大号等宽读数和 10 段电量条；支持方向键微调。',
  },
  {
    id: 'c14', no: 'TR-117', en: 'SKELETON LOADER', cn: '骨架屏', gate: 'FEEDBACK', st: 'ON TIME',
    prompt: '实现骨架屏加载：圆形头像 + 三行不同宽度占位条，300% 背景尺寸的渐变用 background-position 无限扫动（shimmer）；1.6s 后切换为真实内容卡片并以淡入上浮进场；按钮可反复触发。',
  },
  {
    id: 'c15', no: 'TR-119', en: 'SLIDE TO CONFIRM', cn: '滑动确认', gate: 'FEEDBACK', st: 'BOARDING',
    prompt: '实现滑动确认轨道：飞机图标滑块 pointer 拖拽，轨道下方 9 个跑道灯刻度随进度逐个点亮；拖过 85% 松手判定成功（变绿显示 CLEARED），否则弹性回位；成功后 1.8s 自动复位。',
  },
  {
    id: 'c16', no: 'TR-120', en: 'TILT CARD', cn: '倾斜卡片', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现 3D 倾斜卡片：指针位置映射 rotateX/rotateY（±10°，perspective 700px），高光用 radial-gradient + CSS 变量 --gx/--gy 跟随指针；指针离开时弹性复位；全程 rAF 批量 ref 直写，零 React 重渲染。卡片本体做成登机牌（航线 PEK→LAX、条码副券、打孔虚线）。',
  },
  {
    id: 'c17', no: 'TR-121', en: 'ESCAPE BUTTON', cn: '逃跑按钮', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现逃跑按钮：游乐场区域内「取消航班」按钮在 mouseenter 时随机瞬移（translate 过渡 0.28s 回弹），躲满 5 次后「累瘫」可被点中；配嘲讽文案轮换和 DODGE 计数；键盘用户 Tab+Enter 直接生效，保证可达性。',
  },
  {
    id: 'c18', no: 'TR-122', en: 'MAGNIFYING DOCK', cn: '放大坞栏', gate: 'MOTION', st: 'BOARDING',
    prompt: '实现 macOS 风格放大坞栏：一排图标 tile，指针移动时按与光标的距离衰减放大（最大 1.6 倍）并上浮，接近的 tile 描边点亮；rAF 批量直写 transform，离开时 0.35s 弹性复位。',
  },
  {
    id: 'c19', no: 'TR-123', en: 'REACTION BURST', cn: '点赞爆裂', gate: 'FEEDBACK', st: 'ON TIME',
    prompt: '实现点赞爆裂按钮：每次点击生成 12 颗随机角度/距离/大小/配色的粒子，飞行终点用 CSS 变量 --tx/--ty 注入 keyframes，0.72s 后自动清理；按钮按下缩放回弹，计数累加。',
  },
  {
    id: 'c20', no: 'TR-124', en: 'RANGE SLIDER', cn: '滑杆', gate: 'INPUT', st: 'ON TIME',
    prompt: '实现自定义滑杆：轨道 + 琥珀→绿渐变填充 + 翻牌质感圆点，拖拽时圆点放大并弹出数值气泡；11 个刻度随值点亮；role=slider 全键盘可达（方向键 ±2、HOME/END 到两端）。',
  },
  {
    id: 'c21', no: 'TR-125', en: 'PROGRESS STEPS', cn: '登机步骤条', gate: 'MOTION', st: 'BOARDING',
    prompt: '实现步骤条（值机→安检→登机→起飞）：节点圆圈三态——完成（绿描边打勾）、当前（琥珀脉冲光环）、未到（灰）；连接线 scaleX 从左展开「注液」并逐段延迟；支持上一步/下一步与点击节点跳转。',
  },
  {
    id: 'c22', no: 'TR-126', en: 'ACCORDION', cn: '手风琴', gate: 'TEXT', st: 'ON TIME',
    prompt: '实现手风琴 FAQ：展开动画用 grid-template-rows: 0fr → 1fr + overflow hidden（无需测量高度）；右侧 ＋ 号旋转 45° 变 ×；单开模式互斥；条目带 Q1/Q2 等宽编号，展开项描边点亮。',
  },
  {
    id: 'c23', no: 'TR-127', en: 'TAG INPUT', cn: '标签输入', gate: 'INPUT', st: 'BOARDING',
    prompt: '实现标签输入：回车或逗号提交、输入为空时退格删除最后一枚、点 × 移除；去重 + 上限校验并 toast 提示；芯片入场淡入动画；配建议胶囊一键添加。',
  },
  {
    id: 'c24', no: 'TR-128', en: 'UPLOAD DROPZONE', cn: '上传区', gate: 'INPUT', st: 'ON TIME',
    prompt: '实现拖拽上传区：虚线区域 dragover 时描边点亮 + 微放大，drop 或点击选择后生成文件芯片（文件名 + 体积格式化 + 移除按钮），去重 + 4 份上限；纯前端演示不真正上传。',
  },
  {
    id: 'c25', no: 'TR-129', en: 'TEXT SCRAMBLE', cn: '乱码解码', gate: 'TEXT', st: 'BOARDING',
    prompt: '实现乱码解码文字效果：目标短语逐位定格，正在解码的字符每 2 帧换一个随机字形（!<>-_\\/[]{}=+*^?#），从左到右推进；解码完停留 1.8s 切下一句循环；rAF 驱动、离开视口自动暂停；大号 Barlow Condensed 琥珀字 + 微光晕。',
  },
  {
    id: 'c26', no: 'TR-130', en: 'STAR RATING', cn: '星级评分', gate: 'INPUT', st: 'ON TIME',
    prompt: '实现星级评分组件：5 颗 SVG 星星，悬停时预览点亮到该星级、移开还原，点击确认评分；选中的星星带 scale 回弹动画和辉光；下方文案随档位变化（糟糕/一般/舒适/尊享/完美）；支持方向键调节。',
  },
  {
    id: 'c27', no: 'TR-131', en: 'CHECKLIST', cn: '登机清单', gate: 'FEEDBACK', st: 'BOARDING',
    prompt: '实现待办清单组件：自定义方形复选框，勾选时对勾用 SVG stroke-dashoffset 描画动画；文字用伪元素横线 scaleX 展开划除；底部进度条随完成度填充，全部完成时变绿并弹出祝贺提示。条目示例：护照/签证/充电宝/颈枕/常旅客卡。',
  },
  {
    id: 'c28', no: 'TR-132', en: 'SPOTLIGHT CARD', cn: '聚光卡片', gate: 'MOTION', st: 'BOARDING',
    prompt: '实现聚光边框卡片（Magic UI Spotlight 风格）：卡片外层 1px 容器内放置 radial-gradient 光斑层，位置由 CSS 变量 --gx/--gy 跟随指针，悬停时边框光晕亮起、离开淡出；内部为实底内容层。卡片内容做成登机口信息面板。',
  },
  {
    id: 'c29', no: 'TR-133', en: 'CARD SWAP', cn: '卡片堆叠', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现卡片堆叠切换（Bencho Card Swap 风格）：3 张卡片绝对定位堆叠，第 1 张在前（原位），后两张依次下移、缩小并左右微旋；点击卡片或按钮时顺序轮转，所有卡片用弹性 transform 过渡到新位置；卡片内容为三张不同航线的登机牌。',
  },
  {
    id: 'c30', no: 'TR-134', en: 'TIME SCRUBBER', cn: '起飞时间轴', gate: 'MOTION', st: 'ON TIME',
    prompt: '实现时间轴拖拽组件（Bencho Time Scrubber 风格）：横向时间轴分四个航段（滑行/爬升/巡航/下降），可拖拽的飞机指针沿轴移动，指针下方光点标记当前位置；实时换算飞行经过时间（总时长 11h30m）并高亮当前航段名称；支持点击跳转与方向键微调。',
  },
  {
    id: 'c31', no: 'TR-135', en: 'DEST CAROUSEL', cn: '目的地轮播', gate: 'TEXT', st: 'BOARDING',
    prompt: '实现滚动吸附轮播：横向 scroll-snap 容器展示目的地卡片，支持指针拖拽滚动（pointer 捕获 + scrollTo）、左右按钮按卡片宽度翻页；底部圆点指示器随滚动位置联动；每张卡片不同的渐变底色 + 大号压缩字体城市名 + 机场代码徽章。',
  },
  {
    id: 'c37', no: 'UI-206', en: 'DATA TABLE', cn: '数据表格', gate: 'DATA', st: 'BOARDING',
    prompt: '实现可交互数据表格：成员头像与邮箱双行单元格、状态胶囊、筛选标签联动计数、搜索过滤、按名称排序、空结果状态、分页脚注；表头细描边、行悬停高亮，窄屏横向滚动不破版。',
  },
  {
    id: 'c38', no: 'UI-207', en: 'TOOLTIP & POPOVER', cn: '提示浮层', gate: 'OVERLAY', st: 'ON TIME',
    prompt: '实现提示与浮层组件：悬停/聚焦出现的 tooltip 带延迟与小箭头，键盘可达；点击展开的 share popover 含标题、说明、复制链接与成员头像堆叠，复制后按钮短暂反馈「Copied」，点击外部或 Escape 关闭。',
  },
  {
    id: 'c39', no: 'UI-208', en: 'AVATAR & TEAM', cn: '头像与团队卡', gate: 'DATA', st: 'ON TIME',
    prompt: '实现头像体系与团队卡片：sm/md/lg 三档尺寸、渐变底色首字母、在线状态圆点、重叠头像堆叠带 +N；团队卡包含品牌标记、认证徽章、简介、项目/关注/成员三项指标与可切换的 Follow 按钮。',
  },
  {
    id: 'c40', no: 'UI-209', en: 'PRICING', cn: '价格方案', gate: 'MARKETING', st: 'BOARDING',
    prompt: '实现价格方案区：月付/年付切换（年付显示 −20% 与节省金额，数字过渡不跳动）、三档方案卡、中间方案高亮并带 MOST POPULAR 角标、功能清单打勾、CTA 点击后变为已选状态。',
  },
  {
    id: 'c41', no: 'UI-210', en: 'ANALYTICS CARD', cn: '数据看板', gate: 'DATA', st: 'ON TIME',
    prompt: '实现数据看板卡片：大号数值与同比涨幅、时间范围下拉切换数据集、SVG 面积折线图带渐变填充与端点圆点、横向网格线、Y 轴刻度、X 轴日期标签和图例；数值与路径随范围平滑更新。',
  },
  { id: null, no: 'TR-112', en: 'SHADER ROWS', cn: '着色器行', gate: 'VISUAL', st: 'DELAYED', prompt: '' },
  { id: null, no: 'TR-118', en: 'MORSE TICKER', cn: '摩尔特尘', gate: 'TEXT', st: 'DELAYED', prompt: '' },
]

export interface Group {
  label: string
  ids: string[]
}

export const GROUPS: Group[] = [
  { label: '开始 · START', ids: ['c00'] },
  { label: '基础 · FOUNDATIONS', ids: ['c32', 'c33', 'c34', 'c35', 'c36'] },
  { label: '复合 · COMPOSITES', ids: ['c37', 'c38', 'c39', 'c40', 'c41'] },
  { label: '文本 · TEXT', ids: ['c01', 'c02', 'c22', 'c25', 'c31'] },
  { label: '输入 · INPUT', ids: ['c03', 'c04', 'c05', 'c06', 'c10', 'c11', 'c20', 'c23', 'c24', 'c26'] },
  { label: '反馈 · FEEDBACK', ids: ['c07', 'c08', 'c14', 'c15', 'c19', 'c27'] },
  { label: '动效 · MOTION', ids: ['c09', 'c12', 'c13', 'c16', 'c17', 'c18', 'c21', 'c28', 'c29', 'c30'] },
]

export const MQ_ITEMS = [
  'GATE 24 — NOW BOARDING',
  'FLIP · MOTION · DETAIL',
  'UI / PLAYGROUND v3.0',
  '42 LIVE COMPONENTS',
  'ZERO DEPENDENCIES',
  'REACT + VITE + TS',
  'SLIDE · TILT · BURST',
  'SHIP FASTER',
]

export const PHRASES = [
  'SHIP FASTER',
  'MOTION FIRST',
  'DESIGN SYSTEM',
  'GATE 24 OPEN',
  'PRESS CTRL K',
  'MADE TO MOVE',
]

/** 翻牌字轮：空格在最前，其余顺序即翻转顺序 */
export const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.:/+'

export const INSTALL_CMD = 'npm install && npm run dev'

/* ============ 样式变体：同一组件在不同提示词下生成不同样式 ============ */

export interface Variant {
  id: string
  label: string
  /** 挂在演示区上的作用域 class（重定义 CSS 变量组） */
  cls: string
  /** 拼接在组件基础提示词之后的风格描述 */
  promptSuffix: string
}

export const VARIANTS: Variant[] = [
  {
    id: 'classic',
    label: '经典 CLASSIC',
    cls: '',
    promptSuffix:
      '视觉风格：深色航站楼——近黑背景 #121216、琥珀 #ffb02e 主色、米白文字、等宽字体点缀、发丝级半透明描边、克制的辉光。',
  },
  {
    id: 'neon',
    label: '霓虹 NEON',
    cls: 'v-neon',
    promptSuffix:
      '视觉风格：赛博霓虹——深蓝黑背景 #0a1626、青色 #22d3ee 主色并带明显辉光（box-shadow 光晕）、淡天蓝文字、紫罗兰点缀、细发光描边，整体像深夜机坪的霓虹指示牌。',
  },
  {
    id: 'paper',
    label: '纸感 PAPER',
    cls: 'v-paper',
    promptSuffix:
      '视觉风格：纸质登机牌——米白纸底 #f6f1e4、赭石 #b45309 主色、墨色文字、暖灰辅助、白色输入面、虚线打孔元素，像一张攥在手里的老式机票。',
  },
]

/** 启用多变体切换的组件 id（其余组件只有「经典」一个变体） */
export const MULTI_VARIANT_IDS = new Set(['c03', 'c07', 'c15', 'c20', 'c21', 'c23', 'c26', 'c28', 'c29'])
