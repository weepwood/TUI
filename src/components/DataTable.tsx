import { useMemo, useState } from 'react'
import { useToast } from '../state/app'

interface Member {
  name: string
  email: string
  initials: string
  color: string
  role: string
  spend: number
  status: 'Active' | 'Invited'
  updated: string
}

const members: Member[] = [
  { name: 'Olivia Rhye', email: 'olivia@untitledui.com', initials: 'OR', color: 'rose', role: 'Product Designer', spend: 240, status: 'Active', updated: '2 min ago' },
  { name: 'Phoenix Baker', email: 'phoenix@untitledui.com', initials: 'PB', color: 'violet', role: 'Engineering', spend: 180, status: 'Active', updated: '1 hour ago' },
  { name: 'Lana Steiner', email: 'lana@untitledui.com', initials: 'LS', color: 'blue', role: 'Marketing', spend: 120, status: 'Invited', updated: 'Yesterday' },
  { name: 'Demi Wilkinson', email: 'demi@untitledui.com', initials: 'DW', color: 'green', role: 'Product Manager', spend: 240, status: 'Active', updated: 'Mon, 9:41 AM' },
  { name: 'Candice Wu', email: 'candice@untitledui.com', initials: 'CW', color: 'amber', role: 'Design Lead', spend: 180, status: 'Active', updated: 'Mon, 8:22 AM' },
]

export default function DataTable() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All members' | 'Active' | 'Invited'>('All members')
  const [ascending, setAscending] = useState(true)
  const { toast } = useToast()
  const filtered = useMemo(() => members
    .filter(member => filter === 'All members' || member.status === filter)
    .filter(member => `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [query, filter, ascending])

  return (
    <div className="ui-showcase ui-table-card">
      <div className="ui-table-head">
        <div><div className="ui-table-title">Team members <span>5</span></div><p>Manage your team and their account permissions.</p></div>
        <button className="ui-button ui-button-primary ui-table-invite" onClick={() => toast('邀请链接已复制，发给队友即可加入', 'ok')}><span aria-hidden="true">＋</span> Invite member</button>
      </div>
      <div className="ui-table-tools">
        <div className="ui-table-filters" role="tablist" aria-label="Filter members">
          {(['All members', 'Active', 'Invited'] as const).map(item => <button role="tab" aria-selected={filter === item} className={filter === item ? 'on' : ''} key={item} onClick={() => setFilter(item)}>{item}<span>{item === 'All members' ? 5 : item === 'Active' ? 4 : 1}</span></button>)}
        </div>
        <label className="ui-table-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search members" aria-label="Search members" /></label>
      </div>
      <div className="ui-table-scroll">
        <table className="ui-table">
          <thead><tr><th><button className="ui-table-sort" onClick={() => setAscending(value => !value)}>Name <span aria-hidden="true">↕</span></button></th><th>Access</th><th>Status</th><th>Spend</th><th>Last active</th><th><span className="ui-sr-only">Actions</span></th></tr></thead>
          <tbody>
            {filtered.map(member => <tr key={member.email}>
              <td><div className="ui-member"><span className={`ui-avatar ui-avatar-${member.color}`}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td>
              <td><span className="ui-role">{member.role}</span></td>
              <td><span className={`ui-table-status ${member.status === 'Active' ? 'active' : 'invited'}`}><i />{member.status}</span></td>
              <td className="ui-table-spend">${member.spend}.00</td><td className="ui-table-date">{member.updated}</td>
              <td><button className="ui-table-more" aria-label={`More actions for ${member.name}`}>···</button></td>
            </tr>)}
            {!filtered.length && <tr><td colSpan={6} className="ui-table-empty">No members match “{query}”.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="ui-table-foot"><span>Showing <strong>{filtered.length ? 1 : 0}–{filtered.length}</strong> of {filtered.length} results</span><div><button disabled aria-label="Previous page">←</button><button className="current" aria-current="page">1</button><button disabled aria-label="Next page">→</button></div></div>
    </div>
  )
}
