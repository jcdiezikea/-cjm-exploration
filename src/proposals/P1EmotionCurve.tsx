import { STAGES } from '../data/journeyData.ts'
import { JourneyChart } from '../JourneyChart.tsx'
import type { ProposalProps } from './types.ts'

export function P1EmotionCurve({ points }: ProposalProps) {
  return (
    <div>
      <h2 className="proposal-title">P1 — Emotion Curve</h2>
      <p className="proposal-desc">
        The classic starting point for any CJM session. Maps the emotional trajectory across all 7 stages as a single continuous line — making peaks and valleys immediately visible to any audience. Best for aligning stakeholders on where satisfaction breaks down before diving into solutions. Feature toggles let you animate the "before vs. after" in real time during a presentation.
      </p>
      <div className="proposal-card">
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" style={{ flexGrow: s.weight }}>
              {s.name}
            </div>
          ))}
        </div>
        <JourneyChart points={points} stages={STAGES.map((s) => s.name)} />
      </div>
    </div>
  )
}
