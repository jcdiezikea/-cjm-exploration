import { useState } from 'react'
import { P1EmotionCurve } from './P1EmotionCurve.tsx'
import { P2SwimlaneMap } from './P2SwimlaneMap.tsx'
import { P4BusinessKPI } from './P4BusinessKPI.tsx'
import { P6OpportunityMatrix } from './P6OpportunityMatrix.tsx'
import { P7PersonaOverlay } from './P7PersonaOverlay.tsx'
import { P12CoworkerOverlay } from './P12CoworkerOverlay.tsx'
import type { ProposalProps } from './types.ts'

const SUB = [
  { id: 'p1', label: 'Swimlane Map', component: P2SwimlaneMap },
  { id: 'p3', label: 'Persona Overlay', component: P7PersonaOverlay },
  { id: 'p8', label: 'Customer & Co-worker', component: P12CoworkerOverlay },
  { id: 'ec', label: 'Emotion Curve', component: P1EmotionCurve },
  { id: 'p4', label: 'Business KPI', component: P4BusinessKPI },
  { id: 'p6', label: 'Opportunity Matrix', component: P6OpportunityMatrix },
]

export function Others({ points, activeFeatureIds, onStageClick }: ProposalProps) {
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
      <Current points={points} activeFeatureIds={activeFeatureIds} onStageClick={onStageClick} />
    </div>
  )
}
