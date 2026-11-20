import { useState } from 'react'

export default function FormShowcase() {
  const [marketing, setMarketing] = useState(true)
  const [plan, setPlan] = useState('pro')
  const [submitted, setSubmitted] = useState(false)
  return (
    <form className="ui-showcase ui-form-demo" onSubmit={event => { event.preventDefault(); setSubmitted(true) }}>
      <div className="ui-form-heading"><div><span className="ui-eyebrow">PROFILE</span><h3>Personalize your workspace</h3></div><span className="ui-form-step">STEP 2 OF 3</span></div>
      <div className="ui-form-grid">
        <label className="ui-field">Display name<input defaultValue="Alex Morgan" /></label>
        <label className="ui-field">Email address<input type="email" defaultValue="alex@example.com" /></label>
        <label className="ui-field ui-field-full">Plan<select value={plan} onChange={event => setPlan(event.target.value)}><option value="starter">Starter · Free</option><option value="pro">Pro · $12/month</option><option value="team">Team · $28/month</option></select></label>
      </div>
      <label className="ui-check-row"><input type="checkbox" checked={marketing} onChange={event => setMarketing(event.target.checked)} /><span className="ui-check-custom" /><span><strong>Product updates</strong><small>Occasional tips and feature announcements.</small></span></label>
      <div className="ui-form-footer"><span className={submitted ? 'ui-form-success' : 'ui-form-hint'}>{submitted ? '✓ Preferences saved' : 'All fields are editable'}</span><button className="ui-button ui-button-primary" type="submit">Save preferences <span aria-hidden="true">→</span></button></div>
    </form>
  )
}
