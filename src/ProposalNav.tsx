import { useMemo, useState } from 'react'
import { BASE_POINTS, FEATURES, type FeatureDefinition, type JourneyPoint } from './data/journeyData.ts'
import { P2SwimlaneMap } from './proposals/P2SwimlaneMap.tsx'
import { P5ServiceBlueprint } from './proposals/P5ServiceBlueprint.tsx'
import { P7PersonaOverlay } from './proposals/P7PersonaOverlay.tsx'
import { P8RoleDashboard } from './proposals/P8RoleDashboard.tsx'
import { P9StoryMap } from './proposals/P9StoryMap.tsx'
import { P10Heatmap } from './proposals/P10Heatmap.tsx'
import { P11EmotionCurvePhases } from './proposals/P11EmotionCurvePhases.tsx'
import { P12CoworkerOverlay } from './proposals/P12CoworkerOverlay.tsx'
import { Others } from './proposals/Others.tsx'
import { InsightStrip } from './components/InsightStrip.tsx'
import { StageDrawer } from './components/StageDrawer.tsx'

const PROPOSALS = [
  { id: 1, label: 'P1 · Swimlane Map', component: P2SwimlaneMap },
  { id: 2, label: 'P2 · Service Blueprint', component: P5ServiceBlueprint },
  { id: 3, label: 'P3 · Persona Overlay', component: P7PersonaOverlay },
  { id: 4, label: 'P4 · Role Dashboard', component: P8RoleDashboard },
  { id: 5, label: 'P5 · Story Map', component: P9StoryMap },
  { id: 6, label: 'P6 · Heatmap', component: P10Heatmap },
  { id: 7, label: 'P7 · Phase Filters', component: P11EmotionCurvePhases },
  { id: 8, label: 'P8 · Customer & Co-worker', component: P12CoworkerOverlay },
  { id: 9, label: 'Others', component: Others },
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
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

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

      <InsightStrip />

      <div className="proposal-body">
        <CurrentProposal
          points={journeyPoints}
          activeFeatureIds={activeFeatureIds}
          onStageClick={setSelectedStage}
        />
      </div>

      <StageDrawer stageName={selectedStage} onClose={() => setSelectedStage(null)} />
    </div>
  )
}
