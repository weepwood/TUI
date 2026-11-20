import { useState, type KeyboardEvent } from 'react'

const tabs = [
  { id: 'overview', label: 'Overview', title: 'Everything in one place', text: 'A clear summary helps people understand what matters before they dive into the details.', metric: '12.8k', caption: 'Monthly visitors' },
  { id: 'activity', label: 'Activity', title: 'Recent activity', text: 'See the latest changes from your team, organized into a focused activity stream.', metric: '248', caption: 'Events this week' },
  { id: 'settings', label: 'Settings', title: 'Make it yours', text: 'Adjust preferences and make the experience work the way you do.', metric: '4', caption: 'Preferences enabled' },
]

export default function TabsShowcase() {
  const [active, setActive] = useState(tabs[0].id)
  const selected = tabs.find(tab => tab.id === active)!
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = tabs.findIndex(tab => tab.id === active)
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const next = (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
      setActive(tabs[next].id)
      document.getElementById(`ui-tab-${tabs[next].id}`)?.focus()
    }
  }

  return (
    <div className="ui-showcase ui-tabs-demo">
      <div className="ui-tabs" role="tablist" aria-label="Workspace details">
        {tabs.map(tab => <button key={tab.id} id={`ui-tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls="ui-tab-panel" tabIndex={active === tab.id ? 0 : -1} className={active === tab.id ? 'active' : ''} onClick={() => setActive(tab.id)} onKeyDown={onKeyDown}>{tab.label}</button>)}
      </div>
      <div className="ui-tab-panel" id="ui-tab-panel" role="tabpanel" aria-labelledby={`ui-tab-${active}`}>
        <div><span className="ui-eyebrow">YOUR WORKSPACE</span><h3>{selected.title}</h3><p>{selected.text}</p></div>
        <div className="ui-tab-metric"><strong>{selected.metric}</strong><span>{selected.caption}</span></div>
      </div>
    </div>
  )
}
