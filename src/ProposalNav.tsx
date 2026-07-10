import { useMemo, useState } from 'react'
import { BASE_POINTS, FEATURES, type FeatureDefinition, type JourneyPoint } from './data/journeyData.ts'
import { P1EmotionCurve } from './proposals/P1EmotionCurve.tsx'
import { P2SwimlaneMap } from './proposals/P2SwimlaneMap.tsx'
import { P3HorizonOverlay } from './proposals/P3HorizonOverlay.tsx'
import { P4BusinessKPI } from './proposals/P4BusinessKPI.tsx'
import { P5ServiceBlueprint } from './proposals/P5ServiceBlueprint.tsx'
import { P6OpportunityMatrix } from './proposals/P6OpportunityMatrix.tsx'
import { P7PersonaOverlay } from './proposals/P7PersonaOverlay.tsx'
import { P8RoleDashboard } from './proposals/P8RoleDashboard.tsx'
import { P9StoryMap } from './proposals/P9StoryMap.tsx'
import { P10Heatmap } from './proposals/P10Heatmap.tsx'
import { P11EmotionCurvePhases } from './proposals/P11EmotionCurvePhases.tsx'
import { P12CoworkerOverlay } from './proposals/P12CoworkerOverlay.tsx'

const PROPOSALS = [
  { id: 1, label: 'P1 · Emotion Curve', component: P1EmotionCurve },
  { id: 2, label: 'P2 · Swimlane Map', component: P2SwimlaneMap },
  { id: 3, label: 'P3 · Horizon Overlay', component: P3HorizonOverlay },
  { id: 4, label: 'P4 · Business KPI', component: P4BusinessKPI },
  { id: 5, label: 'P5 · Service Blueprint', component: P5ServiceBlueprint },
  { id: 6, label: 'P6 · Opportunity Matrix', component: P6OpportunityMatrix },
  { id: 7, label: 'P7 · Persona Overlay', component: P7PersonaOverlay },
  { id: 8, label: 'P8 · Role Dashboard', component: P8RoleDashboard },
  { id: 9, label: 'P9 · Story Map', component: P9StoryMap },
  { id: 10, label: 'P10 · Heatmap', component: P10Heatmap },
  { id: 11, label: 'P11 · Phase Filters', component: P11EmotionCurvePhases },
  { id: 12, label: 'P12 · Customer & Co-worker', component: P12CoworkerOverlay },
]

function applyFeatures(base: JourneyPoint[], activeFeatures: FeatureDefinition[]): JourneyPoint[] {
  const pts = base.map((p) => ({ ...p }))
  for (const f of activeFeatures) {
    for (const [id, change] of Object.entries(f.pointChanges)) {
      const idx = pts.findIndex((p) => p.id === id)
      if (idx >= 0) pts[idx] = { ...pts[idx], ...change }
    }
  }
  return pts
}

export function ProposalNav() {
  const [active, setActive] = useState(1)
  const [activeFeatureIds, setActiveFeatureIds] = useState<string[]>([])

  function toggleFeature(id: string) {
    setActiveFeatureIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    )
  }

  const activeFeatures = useMemo(
    () => FEATURES.filter((f) => activeFeatureIds.includes(f.id)),
    [activeFeatureIds],
  )

  const journeyPoints = useMemo(
    () => applyFeatures(BASE_POINTS, activeFeatures),
    [activeFeatures],
  )

  const CurrentProposal = PROPOSALS.find((p) => p.id === active)!.component

  return (
    <div className="nav-shell">
      <nav className="proposal-nav">
        {PROPOSALS.map((p) => (
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

      <div className="feature-bar">
        <span className="feature-bar-label">Features:</span>
        {FEATURES.map((f) => (
          <label key={f.id} className={`feature-chip ${activeFeatureIds.includes(f.id) ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={activeFeatureIds.includes(f.id)}
              onChange={() => toggleFeature(f.id)}
            />
            {f.name}
          </label>
        ))}
      </div>

      <div className="proposal-body">
        <CurrentProposal points={journeyPoints} activeFeatureIds={activeFeatureIds} />
      </div>
    </div>
  )
}
