import { useState } from 'react'

const notices = [
  { type: 'success', icon: '✓', title: 'Changes saved', body: 'Your workspace is up to date.' },
  { type: 'info', icon: 'i', title: 'New version available', body: 'Refresh to get the latest improvements.' },
  { type: 'warning', icon: '!', title: 'Storage almost full', body: 'You have used 85% of your available space.' },
  { type: 'error', icon: '×', title: 'Could not connect', body: 'Check your connection and try again.' },
]

export default function StatusShowcase() {
  const [dismissed, setDismissed] = useState<string[]>([])
  return (
    <div className="ui-showcase ui-status">
      <div className="ui-badge-row" aria-label="Badge examples">
        <span className="ui-badge">Default</span><span className="ui-badge ui-badge-primary">Featured</span>
        <span className="ui-badge ui-badge-success">● Active</span><span className="ui-badge ui-badge-warning">In review</span>
        <span className="ui-badge ui-badge-danger">3 issues</span><span className="ui-badge ui-badge-outline">v2.4.0</span>
      </div>
      <div className="ui-notice-list">
        {notices.filter(item => !dismissed.includes(item.type)).map(item => (
          <div className={`ui-notice ui-notice-${item.type}`} role="status" key={item.type}>
            <span className="ui-notice-icon" aria-hidden="true">{item.icon}</span>
            <div><strong>{item.title}</strong><p>{item.body}</p></div>
            <button className="ui-notice-close" onClick={() => setDismissed(current => [...current, item.type])} aria-label={`Dismiss ${item.type} notice`}>×</button>
          </div>
        ))}
        {dismissed.length > 0 && <button className="ui-reset" onClick={() => setDismissed([])}>Reset dismissed alerts</button>}
      </div>
    </div>
  )
}
