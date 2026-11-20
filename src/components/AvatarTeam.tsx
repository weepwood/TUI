import { useState } from 'react'

const people = [
  { initials: 'OR', name: 'Olivia Rhye', role: 'Design lead', color: 'rose' },
  { initials: 'PB', name: 'Phoenix Baker', role: 'Product engineer', color: 'violet' },
  { initials: 'DW', name: 'Demi Wilkinson', role: 'Product manager', color: 'green' },
  { initials: 'CW', name: 'Candice Wu', role: 'Visual designer', color: 'blue' },
]

export default function AvatarTeam() {
  const [following, setFollowing] = useState(false)
  return (
    <div className="ui-showcase ui-team-showcase">
      <div className="ui-team-card">
        <div className="ui-team-top"><span className="ui-team-kicker">DESIGN STUDIO</span><button className="ui-team-menu" aria-label="More team actions">···</button></div>
        <div className="ui-team-brand"><span className="ui-team-mark">a</span><div><strong>Atlas Studio</strong><span>Product design team</span></div><span className="ui-team-check" aria-label="Verified team">✓</span></div>
        <p className="ui-team-bio">A small team crafting thoughtful digital experiences for people and products.</p>
        <div className="ui-team-divider" />
        <div className="ui-team-meta"><span><strong>24</strong> projects</span><span><strong>8.4k</strong> followers</span><span><strong>4</strong> members</span></div>
        <div className="ui-team-bottom"><div className="ui-avatar-stack" aria-label="Team members">{people.map(person => <span key={person.initials} className={`ui-avatar ui-avatar-${person.color}`} title={person.name}>{person.initials}</span>)}<span className="ui-avatar ui-avatar-more">+2</span></div><button className={`ui-button ${following ? 'ui-button-secondary' : 'ui-button-primary'}`} aria-pressed={following} onClick={() => setFollowing(value => !value)}>{following ? 'Following ✓' : '＋ Follow team'}</button></div>
      </div>
      <div className="ui-avatar-scale"><span className="ui-overlay-caption">AVATAR SIZES</span><span className="ui-avatar ui-avatar-sm ui-avatar-amber">AM</span><span className="ui-avatar ui-avatar-md ui-avatar-blue">JD</span><span className="ui-avatar ui-avatar-lg ui-avatar-violet">SK</span><span className="ui-avatar ui-avatar-online" aria-label="Online user">OR<i /></span></div>
    </div>
  )
}
