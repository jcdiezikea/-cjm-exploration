import { useState } from 'react'
import { BASE_POINTS } from './data/journeyData.ts'
import { Intro } from './proposals/Intro.tsx'
import { P5ServiceBlueprint } from './proposals/P5ServiceBlueprint.tsx'
import { P8RoleDashboard } from './proposals/P8RoleDashboard.tsx'
import { P13ScrollStory } from './proposals/P13ScrollStory.tsx'
import { P10Heatmap } from './proposals/P10Heatmap.tsx'
import { P11EmotionCurvePhases } from './proposals/P11EmotionCurvePhases.tsx'
import { Others } from './proposals/Others.tsx'
import { Survey } from './proposals/Survey.tsx'
import { InsightStrip } from './components/InsightStrip.tsx'
import { StageDrawer } from './components/StageDrawer.tsx'
import { ChatPanel } from './components/ChatPanel.tsx'

const PROPOSALS = [
  { id: 1, label: 'P1 · Service Blueprint', component: P5ServiceBlueprint },
  { id: 2, label: 'P2 · Role Dashboard', component: P8RoleDashboard },
  { id: 3, label: 'P3 · Heatmap', component: P10Heatmap },
  { id: 4, label: 'P4 · Phase Filters', component: P11EmotionCurvePhases },
  { id: 5, label: 'P5 · Story', component: P13ScrollStory },
  { id: 6, label: 'Others', component: Others },
  { id: 7, label: '📋 Survey', component: Survey },
]

export function ProposalNav() {
  const [started, setStarted] = useState(false)
  const [active, setActive] = useState(1)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  if (!started) {
    return <Intro onStart={() => setStarted(true)} />
  }

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

      <InsightStrip />

      <div className="proposal-body">
        <CurrentProposal
          points={BASE_POINTS}
          activeFeatureIds={[]}
          onStageClick={setSelectedStage}
        />
      </div>

      <StageDrawer stageName={selectedStage} onClose={() => setSelectedStage(null)} />
      <ChatPanel />
    </div>
  )
}
