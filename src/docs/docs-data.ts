/** Public showcase metadata; never claims that this package is published to npm. */
export interface DocsItem {
  id: string
  name: string
  cn: string
  group: string
  description: string
  usage: string
  fresh?: boolean
}
export interface DocsProp {
  name: string
  type: string
  defaultValue: string
  description: string
}
export interface DocsDetail {
  intro: string
  props: readonly DocsProp[]
  useCases: readonly { title: string; detail: string }[]
  related: readonly string[]
}
const p = (name: string, type: string, defaultValue: string, description: string): DocsProp =>
  ({ name, type, defaultValue, description })

export const docsDetails: Record<string, DocsDetail> = {
  segmented: {
    intro: '在多个互斥选项间快速切换，选中背景平滑移动；同时保留单个 Tab 停靠点和方向键导航。',
    props: [
      p('label', 'string', '必填', '整组控件的无障碍名称'),
      p('options', 'SegmentedOption[]', '必填', '选项标签、值和禁用状态'),
      p('value', 'string', '—', '受控选中值'),
      p('defaultValue', 'string', '首个可用项', '非受控初始值'),
      p('onValueChange', '(value: string) => void', '—', '选择变化回调'),
      p('disabled', 'boolean', 'false', '禁用整组控件'),
    ],
    useCases: [
      { title: '内容视图', detail: '在网格、列表或紧凑布局之间切换，不改变当前页面路由。' },
      { title: '时间范围', detail: '在今天、最近一周与最近一个月之间切换分析数据。' },
      { title: '设置选项', detail: '在有限数量的互斥偏好之间即时切换。' },
    ],
    related: ['tabs', 'switch', 'range'],
  },
  button: { intro: '提供统一的操作层级、尺寸和加载反馈，适用于表单及工作台操作。', props: [
    p('variant', "'primary' | 'secondary' | 'ghost' | 'danger'", "'primary'", '强调程度与语义'),
    p('size', "'sm' | 'md' | 'lg'", "'md'", '按钮尺寸'), p('loading', 'boolean', 'false', '阻止点击并显示加载状态'),
    p('disabled', 'boolean', 'false', '禁用交互')
  ], useCases: [{ title:'主要操作',detail:'表单提交与创建内容。' },{title:'次级操作',detail:'取消、返回与轻量动作。'}],related:['copy','badge','dialog'] },
  badge: { intro:'通过克制的语义色呈现状态、分类和标记。',props:[p('tone',"'neutral' | 'accent' | 'success' | 'danger'","'neutral'",'语义色'),p('children','ReactNode','—','标签文字或图标')],useCases:[{title:'状态',detail:'待处理、成功或失败状态。'},{title:'分类',detail:'内容分类、版本标识。'}],related:['button','card','progress'] },
  card: { intro:'带边框和可选阴影的中性内容容器。',props:[p('elevated','boolean','false','增加轻阴影'),p('children','ReactNode','—','可组合内容'),p('className','string',"''",'自定义类名')],useCases:[{title:'工作台',detail:'展示聚合信息与指标。'}],related:['spotlight','empty','accordion'] },
  textfield: { intro:'原生输入框与标签、提示和验证错误的组合。',props:[p('label','string','必填','可访问标签'),p('hint','string','—','辅助说明'),p('error','string','—','错误消息'),p('value','string','—','受控值')],useCases:[{title:'表单',detail:'项目名称、关键字搜索和设置项。'}],related:['otp','tags','range'] },
  accordion: { intro:'将多个信息区域组织为可展开的标题与内容。',props:[p('items','AccordionItem[]','必填','面板数据'),p('value','string | null','—','受控展开项'),p('defaultValue','string | null','null','初始展开项'),p('onValueChange','function','—','面板切换回调')],useCases:[{title:'常见问题',detail:'隐藏长篇帮助信息。'}],related:['tabs','dialog','card'] },
  tags: { intro:'输入、添加和移除文本标签，并限制数量和重复项。',props:[p('label','string','必填','输入标签'),p('value','string[]','—','受控标签'),p('maxTags','number','6','标签数量限制'),p('onError','function','—','重复或数量上限回调')],useCases:[{title:'内容筛选',detail:'项目关键词与多项分类。'}],related:['textfield','upload','segmented'] },
  progress: { intro:'以进度条形式表达已完成比例。',props:[p('label','string','必填','进度语义标签'),p('value','number','必填','当前值'),p('max','number','100','进度最大值')],useCases:[{title:'后台任务',detail:'文件处理与导出进度。'}],related:['skeleton','count','badge'] },
  spotlight: { intro:'仅在指针经过时提供低强度光晕反馈的容器。',props:[p('glowSize','number','260','聚光范围'),p('children','ReactNode','—','容器内容')],useCases:[{title:'特色卡片',detail:'少量强调交互聚焦区域。'}],related:['card','marquee','count'] },
  marquee: { intro:'用无障碍重复文本实现可配置的循环滚动。',props:[p('items','string[]','必填','纯文本项'),p('duration','number','24','滚动秒数'),p('reverse','boolean','false','反向滚动'),p('pauseOnHover','boolean','true','悬停暂停')],useCases:[{title:'技术标签',detail:'展示支持的工具和产品能力。'}],related:['flip','count','spotlight'] },
  copy: { intro:'安全复制文本并反馈成功或失败。',props:[p('text','string','必填','要复制的字符串'),p('copiedLabel','string',"'已复制'",'成功文案'),p('onCopy','function','—','复制成功回调'),p('onCopyError','function','—','复制失败回调')],useCases:[{title:'代码片段',detail:'复制命令、引用或分享链接。'}],related:['button','tooltip','textfield'] },
  skeleton: { intro:'在内容加载期间保持布局与信息层级。',props:[p('lines','number','3','占位行数'),p('avatar','boolean','false','是否显示头像占位'),p('label','string','—','加载语义标签')],useCases:[{title:'加载状态',detail:'延迟显示卡片和个人资料。'}],related:['progress','empty','card'] },
  otp: { intro:'多位数字验证码输入，支持粘贴与方向键。',props:[p('label','string','必填','验证码名称'),p('length','number','6','位数 1–12'),p('value','string','—','受控值'),p('onComplete','function','—','输入完整时回调')],useCases:[{title:'登录验证',detail:'一次性数字码输入。'}],related:['textfield','stepper','segmented'] },
  stepper: { intro:'按固定步长改变数值，支持上下限和长按重复操作。',props:[p('label','string','必填','数值名称'),p('min / max','number','0 / 100','取值边界'),p('step','number','1','每次变化量'),p('repeatOnHold','boolean','true','长按自动重复')],useCases:[{title:'数量选择',detail:'调整任务数、显示密度或购物数量。'}],related:['range','segmented','count'] },
  range: { intro:'使用原生 range 提供鼠标、触控与键盘数值调节。',props:[p('label','string','必填','滑块名称'),p('min / max','number','0 / 100','范围'),p('step','number','1','调整粒度'),p('onValueChange','function','—','数值回调')],useCases:[{title:'连续参数',detail:'音量、透明度或字号控制。'}],related:['stepper','segmented','switch'] },
  upload: { intro:'无服务端依赖的文件选择和拖拽区域；不会自动上传。',props:[p('label','string','必填','选择区名称'),p('accept','string','—','文件 MIME 或扩展名'),p('maxFiles','number','5','文件数量上限'),p('onFilesChange','function','—','返回 File[]')],useCases:[{title:'表单附件',detail:'图片、PDF 或项目资源选择。'}],related:['empty','progress','button'] },
  flip: { intro:'用中性色机械翻页动画显示数字和短文本。',props:[p('value','string | string[]','必填','展示文本'),p('columns','number','自适应','每行列数'),p('duration','number','500','每个单元动画毫秒数'),p('stagger','number','28','列间延迟')],useCases:[{title:'状态看板',detail:'活动状态、实时计数与短标题。'}],related:['count','marquee','spotlight'] },
  switch: { intro:'通过单一开关切换布尔状态，采用原生按钮和 switch 语义。',props:[p('label','string','必填','可访问名称'),p('checked','boolean','—','受控状态'),p('defaultChecked','boolean','false','初始状态'),p('onCheckedChange','function','—','状态回调')],useCases:[{title:'偏好设置',detail:'通知、音效与自动更新。'}],related:['segmented','tabs','tooltip'] },
  tabs: { intro:'将相关内容划分为可切换的面板，并提供完整 Tab 键导航。',props:[p('label','string','必填','整个标签组名称'),p('items','TabItem[]','必填','标签标题和面板内容'),p('value','string','—','受控当前标签'),p('onValueChange','function','—','选中变化')],useCases:[{title:'详情视图',detail:'在概览、动态与文件之间切换。'}],related:['segmented','accordion','dialog'] },
  tooltip: { intro:'向鼠标和键盘使用者提供简短的上下文说明。',props:[p('label','string','必填','按钮内容'),p('content','string','必填','提示文字'),p('placement',"'top' | 'bottom'","'top'",'提示方向')],useCases:[{title:'辅助解释',detail:'图标按钮、快捷键与设置说明。'}],related:['dialog','button','copy'] },
  dialog: { intro:'受控对话框，提供关闭操作、键盘导航与关闭后焦点恢复。',props:[p('open','boolean','必填','是否打开'),p('onOpenChange','function','必填','关闭与状态回调'),p('title','string','必填','弹窗标题'),p('footer','ReactNode','—','底部操作区')],useCases:[{title:'设置面板',detail:'需要用户注意的独立交互。'}],related:['tooltip','button','tabs'] },
  empty: { intro:'表达当前没有内容或筛选结果，并允许用户直接采取操作。',props:[p('title','string','必填','主提示'),p('description','string','—','简短说明'),p('action','ReactNode','—','操作插槽'),p('size',"'sm' | 'md'","'md'",'占位密度')],useCases:[{title:'无数据',detail:'新用户首次进入与空搜索结果。'}],related:['skeleton','card','upload'] },
  count: { intro:'以流畅数值补间展示变化，支持 SSR 和减少动效设置。',props:[p('value','number','必填','目标数值'),p('duration','number','850','毫秒时长'),p('decimals','number','0','小数位数'),p('prefix / suffix','string','—','前缀与后缀')],useCases:[{title:'数据看板',detail:'统计指标与完成数量。'}],related:['progress','flip','marquee'] },
  covers: { intro: '真正可复用的 3×2 柔和渐变封面墙：Canvas 物理像素噪点、SVG 几何纹样和弹簧悬停反馈。', props: [p('items','GradientCoverItem[]','六张预设卡片','数组包含 id、lines、palette、pattern'),p('columns','2 | 3 | 4','3','桌面布局列数'),p('motion','boolean','true','开关动效，系统减少动画偏好优先'),p('label','string','Gradient cover collection','封面墙无障碍名称')],useCases:[{title:'品牌视觉实验',detail:'无需图片的系列封面。'},{title:'展示站点',detail:'六组配色的沉浸式画廊。'}],related:['cover','spotlight','marquee'] },
  cover: { intro:'可定制双行英文、六组预设或自定义调色板与五种 SVG 细线纹样。',props:[p('lines','readonly [string, string]','必填','两行标题'),p('palette','GradientCoverPreset | GradientCoverPalette',"'sunset'",'预设或自定义六个颜色'),p('pattern','rays | contours | waves | dots | lens | none',"'rays'",'几何纹样选择'),p('motion','boolean','true','关闭动效')],useCases:[{title:'系列封面',detail:'专栏、播客或专辑封面。'}],related:['covers','spotlight','card'] },
  theme: { intro:'在局部 DOM 子树中统一应用明暗主题和 CSS Design Tokens。',props:[p('theme',"'light' | 'dark'","'dark'",'主题模式'),p('className','string',"''",'额外主题类名'),p('style','CSSProperties','—','覆盖局部变量')],useCases:[{title:'微前端',detail:'同一页面内运行不同主题。'}],related:['card','button','segmented'] },
}
export const slugById: Record<string, string> = {
  button:'button',badge:'badge',card:'card',textfield:'text-field',segmented:'segmented-control',
  accordion:'accordion',tags:'tag-input',progress:'progress',spotlight:'spotlight-card',
  marquee:'marquee',copy:'copy-button',skeleton:'skeleton',otp:'otp-input',
  stepper:'number-stepper',range:'range-slider',upload:'file-dropzone',
  flip:'flip-board',switch:'switch',tabs:'tabs',tooltip:'tooltip',dialog:'dialog',
  empty:'empty-state',count:'count-up',covers:'gradient-cover-wall',cover:'gradient-cover-card',theme:'theme-scope',
}
export const idFromSlug = (slug: string): string | undefined =>
  Object.keys(slugById).find(id => slugById[id] === slug)
export const docsHref = (id: string) => '?component=' + (slugById[id] || id)
