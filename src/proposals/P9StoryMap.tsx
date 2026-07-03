import { STAGES, BACKLOG_ITEMS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const HORIZONS = ['T1', 'T2', 'T3'] as const
const HORIZON_LABEL: Record<string, string> = { T1: 'T1 — Now', T2: 'T2 — Next', T3: 'T3 — Future' }
const HORIZON_BG: Record<string, string> = { T1: '#f0fff4', T2: '#fff8f0', T3: '#f5f7fa' }
const PRIORITY_COLOR: Record<string, string> = { 'must-have': '#d2001f', 'nice-to-have': '#ed6f2c', 'like-to-have': '#aab0b8' }
const PRIORITY_BG: Record<string, string> = { 'must-have': '#ffeaea', 'nice-to-have': '#fff3e8', 'like-to-have': '#f0f4f8' }

export function P9StoryMap(_props: ProposalProps) {
  return (
    <div>
      <h2 className="proposal-title">P9 — User Story Map</h2>
      <p className="proposal-desc">
        Brings the Patton story-mapping format into the CJM context: columns are journey stages, rows are delivery horizons (T1 Now / T2 Next / T3 Future). Each card represents a backlog item coloured by priority tier. This view answers the key planning question: "Are we solving the right problems in the right order?" It makes sequencing trade-offs visible and helps Engineering Managers spot stages that are over- or under-invested across horizons.
      </p>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 1020, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 110, background: '#111', color: '#fff', padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', position: 'sticky', left: 0, zIndex: 2 }}>Horizon</th>
              {STAGES.map((s) => (
                <th key={s.name} style={{ background: '#111', color: '#fff', padding: '0.6rem', textAlign: 'center', fontSize: '0.78rem', borderLeft: '1px solid #333', minWidth: 148 }}>
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORIZONS.map((h) => (
              <tr key={h}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.78rem', background: HORIZON_BG[h], borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1, verticalAlign: 'top' }}>
                  {HORIZON_LABEL[h]}
                </td>
                {STAGES.map((s) => {
                  const items = BACKLOG_ITEMS.filter((b) => b.stage === s.name && b.horizon === h)
                  return (
                    <td key={s.name} style={{ padding: '0.4rem', borderLeft: '1px solid #e2e8f0', background: HORIZON_BG[h], verticalAlign: 'top', minHeight: 64 }}>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{ marginBottom: 5, padding: '0.4rem 0.5rem', borderRadius: 8, background: '#fff', border: `2px solid ${PRIORITY_COLOR[item.priority]}44`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                        >
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2f3237', lineHeight: 1.25 }}>{item.title}</div>
                          <div style={{ marginTop: 5, display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ padding: '1px 6px', borderRadius: 999, background: PRIORITY_BG[item.priority], color: PRIORITY_COLOR[item.priority], fontSize: '0.65rem', fontWeight: 700 }}>{item.priority}</span>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{item.team} · {item.storyPoints}sp</span>
                          </div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '0.6rem 1rem', display: 'flex', gap: 14, borderTop: '1px solid #f0f4f8' }}>
          {Object.entries(PRIORITY_COLOR).map(([p, c]) => (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.74rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
