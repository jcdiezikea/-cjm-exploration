import { STAGES, BACKLOG_ITEMS } from '../data/journeyData.ts'
import { JourneyChart } from '../JourneyChart.tsx'
import type { ProposalProps } from './types.ts'

const HC: Record<string, string> = { T1: '#149238', T2: '#ed6f2c', T3: '#aab0b8' }

export function P3HorizonOverlay({ points }: ProposalProps) {
  return (
    <div>
      <h2 className="proposal-title">P3 — Delivery Horizon Overlay</h2>
      <p className="proposal-desc">
        Connects the emotional journey directly to the delivery roadmap. The T1/T2/T3 rail below the curve shows which backlog items land in which stage and when — making it easy to see if the biggest pain points are addressed in the nearest horizon. Ideal for Engineering Managers and Roadmap leaders who need to link feature scheduling to customer impact.
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

        <div style={{ borderTop: '2px dashed #e2e8f0', padding: '0.75rem 1rem 1.1rem' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#47607d' }}>Delivery Rail</span>
            {(['T1', 'T2', 'T3'] as const).map((h) => (
              <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 700 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: HC[h], display: 'inline-block' }} />
                {h === 'T1' ? 'T1 Now' : h === 'T2' ? 'T2 Next' : 'T3 Future'}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {STAGES.map((s) => {
              const items = BACKLOG_ITEMS.filter((b) => b.stage === s.name)
              return (
                <div
                  key={s.name}
                  style={{ flexGrow: s.weight, minHeight: 56, background: '#f7f9fb', borderRadius: 8, padding: '0.35rem', display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      title={`${item.title} · ${item.priority} · ${item.team} · ${item.storyPoints}sp`}
                      style={{ background: HC[item.horizon], color: item.horizon === 'T3' ? '#444' : '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {item.horizon} · {item.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
