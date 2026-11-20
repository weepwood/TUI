import { useState } from 'react'

const series = {
  week: { label: 'Last 7 days', value: '$24,780', change: '+12.8%', points: [22, 27, 25, 37, 32, 42, 38, 50, 46, 59, 53, 68, 63, 78, 72, 91] },
  month: { label: 'Last 30 days', value: '$98,420', change: '+18.4%', points: [18, 22, 20, 33, 29, 36, 32, 45, 40, 51, 47, 62, 57, 68, 64, 85] },
}

function chartPath(points: number[]) {
  return points.map((point, index) => `${index ? 'L' : 'M'} ${(index / (points.length - 1)) * 600} ${108 - point}`).join(' ')
}

export default function AnalyticsCard() {
  const [range, setRange] = useState<'week' | 'month'>('week')
  const data = series[range]
  const line = chartPath(data.points)
  return (
    <div className="ui-showcase ui-analytics-card">
      <div className="ui-analytics-header"><div><span className="ui-eyebrow">REVENUE OVERVIEW</span><div className="ui-analytics-value">{data.value}<span className="ui-analytics-change">↗ {data.change}</span></div><span className="ui-analytics-caption">Total revenue · {data.label}</span></div>
        <label className="ui-range-select"><span className="ui-sr-only">Chart date range</span><select value={range} onChange={event => setRange(event.target.value as 'week' | 'month')}><option value="week">Last 7 days</option><option value="month">Last 30 days</option></select><span aria-hidden="true">⌄</span></label>
      </div>
      <div className="ui-chart-wrap"><div className="ui-chart-ylabels"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div>
        <svg className="ui-chart" viewBox="0 0 600 120" role="img" aria-label={`${data.label} revenue trend, ${data.value}, increasing ${data.change}`} preserveAspectRatio="none">
          <defs><linearGradient id="ui-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--amber)" stopOpacity=".24"/><stop offset="1" stopColor="var(--amber)" stopOpacity="0"/></linearGradient></defs>
          {[15, 43, 71, 99].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} className="ui-chart-grid" />)}
          <path d={`${line} L 600 120 L 0 120 Z`} fill="url(#ui-chart-fill)" />
          <path d={line} className="ui-chart-line" />
          <circle cx="600" cy={108 - data.points[data.points.length - 1]} r="4" className="ui-chart-dot" />
        </svg>
      </div>
      <div className="ui-chart-xlabels">{(range === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Jun 1', 'Jun 5', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30']).map(label => <span key={label}>{label}</span>)}</div>
      <div className="ui-analytics-footer"><span><i className="ui-chart-legend" /> Revenue</span><span>Updated just now <b>·</b> Live</span></div>
    </div>
  )
}
