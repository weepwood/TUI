import { useState } from 'react'
import { SegmentedControl } from '../../packages/react/src'

/** Independent controlled examples for the documentation detail page. */
export default function SegmentedExamples() {
  const [view, setView] = useState('overview')
  const [period, setPeriod] = useState('week')
  const [density, setDensity] = useState('comfortable')
  return (
    <div className="ds-segment-examples">
      <div className="ds-segment-main">
        <span className="ds-segment-caption">VIEW MODE</span>
        <SegmentedControl
          label="内容展示方式"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'analytics', label: 'Analytics' },
            { value: 'activity', label: 'Activity' },
          ]}
        />
        <div className="ds-segment-result" aria-live="polite">
          {view === 'overview' ? '当前展示概览信息' : view === 'analytics' ? '当前展示分析视图' : '当前展示最新动态'}
        </div>
      </div>
      <div className="ds-segment-variations">
        <div><span className="ds-segment-caption">TIME RANGE</span>
          <SegmentedControl
            label="统计周期" value={period} onValueChange={setPeriod}
            options={[
              { value: 'day', label: 'Today' }, { value: 'week', label: '7 days' },
              { value: 'month', label: '30 days' },
            ]}
          />
        </div>
        <div><span className="ds-segment-caption">DENSITY</span>
          <SegmentedControl
            label="布局密度" value={density} onValueChange={setDensity}
            options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfort' }]}
          />
        </div>
      </div>
    </div>
  )
}
