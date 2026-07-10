import { useState } from 'react'
import { P1EmotionCurve } from './P1EmotionCurve.tsx'
import { P4BusinessKPI } from './P4BusinessKPI.tsx'
import { P6OpportunityMatrix } from './P6OpportunityMatrix.tsx'
import type { ProposalProps } from './types.ts'

const SUB = [
  { id: 'p1', label: 'P1 · Emotion Curve', component: P1EmotionCurve },
  { id: 'p4', label: 'P4 · Business KPI', component: P4BusinessKPI },
  { id: 'p6', label: 'P6 · Opportunity Matrix', component: P6OpportunityMatrix },
]

export function Others({ points, activeFeatureIds }: ProposalProps) {
  const [active, setActive] = useState('p1')
  const Current = SUB.find((p) => p.id === active)!.component

  return (
    <div>
      <nav className="proposal-nav" style={{ marginBottom: 0 }}>
        {SUB.map((p) => (
          <button
            key={p.id}
            type="button"
            className={active === p.id ? 'active' : ''}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </nav>
      <Current points={points} activeFeatureIds={activeFeatureIds} />
    </div>
  )
}
