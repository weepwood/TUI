import { useState } from 'react'

const plans = [
  { name: 'Starter', description: 'For individuals and side projects.', monthly: 0, yearly: 0, cta: 'Get started', featured: false, features: ['Up to 3 projects', 'Basic analytics', 'Community support'] },
  { name: 'Studio', description: 'For teams building together.', monthly: 24, yearly: 19, cta: 'Start free trial', featured: true, features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Team workspaces'] },
  { name: 'Scale', description: 'For organizations at every scale.', monthly: 59, yearly: 49, cta: 'Talk to sales', featured: false, features: ['Everything in Studio', 'Custom permissions', 'Dedicated success manager'] },
]

export default function PricingShowcase() {
  const [yearly, setYearly] = useState(true)
  const [selected, setSelected] = useState('')
  return (
    <div className="ui-showcase ui-pricing-demo">
      <div className="ui-pricing-intro"><span className="ui-eyebrow">SIMPLE, TRANSPARENT PRICING</span><h3>Plans that grow with you</h3><p>Start free, then choose the right fit for your next chapter.</p>
        <div className="ui-billing-toggle" aria-label="Billing period"><button aria-pressed={!yearly} className={!yearly ? 'on' : ''} onClick={() => setYearly(false)}>Monthly</button><button aria-pressed={yearly} className={yearly ? 'on' : ''} onClick={() => setYearly(true)}>Yearly <span>−20%</span></button></div>
      </div>
      <div className="ui-pricing-cards">
        {plans.map(plan => <article key={plan.name} className={`ui-plan-card${plan.featured ? ' featured' : ''}`}>
          {plan.featured && <span className="ui-plan-ribbon">MOST POPULAR</span>}
          <div className="ui-plan-name">{plan.name}{plan.featured && <span className="ui-plan-spark">✦</span>}</div>
          <p className="ui-plan-desc">{plan.description}</p>
          <div className="ui-plan-price"><strong>{plan.monthly === 0 ? '$0' : `$${yearly ? plan.yearly : plan.monthly}`}</strong><span>/ month</span></div>
          {yearly && plan.monthly > 0 && <div className="ui-plan-billed">Billed annually · save ${(plan.monthly - plan.yearly) * 12}/year</div>}
          <button className={`ui-button ${plan.featured ? 'ui-button-primary' : 'ui-button-outline'} ui-plan-cta`} onClick={() => setSelected(plan.name)}>{selected === plan.name ? '✓ Selected' : plan.cta}<span aria-hidden="true">→</span></button>
          <div className="ui-plan-rule" /><span className="ui-plan-includes">WHAT'S INCLUDED</span>
          <ul>{plan.features.map(feature => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
        </article>)}
      </div>
      <p className="ui-pricing-footnote">All plans include a 14-day free trial. No credit card required.</p>
    </div>
  )
}
