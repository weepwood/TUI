interface Props {
  onOpen: () => void
}

/** 指令面板的展示台卡片：假输入框邀请 + 快捷键说明 */
export default function PaletteCard({ onOpen }: Props) {
  return (
    <div className="pal-card-demo">
      <button className="pal-fake" onClick={onOpen}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        搜索组件、执行操作……
        <span className="arrow">↵</span>
      </button>
      <div className="pal-keys">
        <span>⌘K / CTRL+K 唤起</span>
        <span>↑↓ 选择</span>
        <span>ENTER 执行</span>
        <span>ESC 关闭</span>
      </div>
    </div>
  )
}
