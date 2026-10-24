/* 组件清单与常量：侧边栏、指令面板、演示共用同一份元数据 */

export type Status = 'BOARDING' | 'ON TIME' | 'DELAYED'

export interface CompMeta {
  id: string | null
  no: string
  en: string
  cn: string
  gate: string
  st: Status
}

export const COMPONENTS: CompMeta[] = [
  { id: 'c00', no: 'TR-101', en: 'SPLIT-FLAP BOARD', cn: '翻牌大屏', gate: 'TEXT', st: 'BOARDING' },
  { id: 'c01', no: 'TR-102', en: 'ODOMETER', cn: '里程表', gate: 'TEXT', st: 'ON TIME' },
  { id: 'c02', no: 'TR-103', en: 'MARQUEE', cn: '跑马灯', gate: 'TEXT', st: 'ON TIME' },
  { id: 'c03', no: 'TR-104', en: 'OTP INPUT', cn: '验证码输入', gate: 'INPUT', st: 'BOARDING' },
  { id: 'c04', no: 'TR-105', en: 'NUMBER STEPPER', cn: '数字步进器', gate: 'INPUT', st: 'ON TIME' },
  { id: 'c05', no: 'TR-106', en: 'SEGMENTED CONTROL', cn: '分段控制', gate: 'INPUT', st: 'BOARDING' },
  { id: 'c06', no: 'TR-107', en: 'COMMAND PALETTE', cn: '指令面板', gate: 'INPUT', st: 'BOARDING' },
  { id: 'c07', no: 'TR-108', en: 'COPY BUTTON', cn: '复制按钮', gate: 'FEEDBACK', st: 'ON TIME' },
  { id: 'c08', no: 'TR-109', en: 'THEME SWITCH', cn: '主题开关', gate: 'FEEDBACK', st: 'BOARDING' },
  { id: 'c09', no: 'TR-110', en: 'HOLD TO BOARD', cn: '长按登机', gate: 'MOTION', st: 'ON TIME' },
  { id: 'c10', no: 'TR-113', en: 'SEAT MAP', cn: '座位图', gate: 'INPUT', st: 'ON TIME' },
  { id: 'c11', no: 'TR-114', en: 'AIRPORT LOOKUP', cn: '机场联想输入', gate: 'INPUT', st: 'BOARDING' },
  { id: 'c12', no: 'TR-115', en: 'DETENT DRAWER', cn: '阻尼抽屉', gate: 'MOTION', st: 'BOARDING' },
  { id: 'c13', no: 'TR-116', en: 'ROTARY KNOB', cn: '旋转旋钮', gate: 'MOTION', st: 'ON TIME' },
  { id: 'c14', no: 'TR-117', en: 'SKELETON LOADER', cn: '骨架屏', gate: 'FEEDBACK', st: 'ON TIME' },
  { id: 'c15', no: 'TR-119', en: 'SLIDE TO CONFIRM', cn: '滑动确认', gate: 'FEEDBACK', st: 'BOARDING' },
  { id: 'c16', no: 'TR-120', en: 'TILT CARD', cn: '倾斜卡片', gate: 'MOTION', st: 'ON TIME' },
  { id: 'c17', no: 'TR-121', en: 'ESCAPE BUTTON', cn: '逃跑按钮', gate: 'MOTION', st: 'ON TIME' },
  { id: 'c18', no: 'TR-122', en: 'MAGNIFYING DOCK', cn: '放大坞栏', gate: 'MOTION', st: 'BOARDING' },
  { id: 'c19', no: 'TR-123', en: 'REACTION BURST', cn: '点赞爆裂', gate: 'FEEDBACK', st: 'ON TIME' },
  { id: null, no: 'TR-112', en: 'SHADER ROWS', cn: '着色器行', gate: 'VISUAL', st: 'DELAYED' },
  { id: null, no: 'TR-118', en: 'MORSE TICKER', cn: '摩斯特尘', gate: 'TEXT', st: 'DELAYED' },
]

export interface Group {
  label: string
  ids: string[]
}

export const GROUPS: Group[] = [
  { label: '开始 · START', ids: ['c00'] },
  { label: '文本 · TEXT', ids: ['c01', 'c02'] },
  { label: '输入 · INPUT', ids: ['c03', 'c04', 'c05', 'c06', 'c10', 'c11'] },
  { label: '反馈 · FEEDBACK', ids: ['c07', 'c08', 'c14', 'c15', 'c19'] },
  { label: '动效 · MOTION', ids: ['c09', 'c12', 'c13', 'c16', 'c17', 'c18'] },
]

export const MQ_ITEMS = [
  'GATE 24 — NOW BOARDING',
  'FLIP · MOTION · DETAIL',
  'TERMINAL/UI v2.6',
  '20 LIVE COMPONENTS',
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

export const INSTALL_CMD = 'npx @terminal-ui/react add split-flap-board'
