import { STAGES, STAGE_METRICS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const STAGE_CONTENT: Record<string, Record<string, string>> = {
  Connect: {
    Actions: 'Customers plan and buy across channels with connected tools',
    Thoughts: '"I can start on my phone and finish in-store — my progress is always saved"',
    Channels: 'IKEA.com · App · In-store kiosk · GPC · Configurators',
    'Pain Points': 'Disconnected omnichannel journeys; system furniture missing from space planning',
    KPIs: 'Planning-to-purchase conversion · Omnichannel NPS · Planning session completion',
    Features: 'System furniture in space planning · Home Planning Hub · Omni-channel continuity',
  },
  Build: {
    Actions: 'Teams develop shared AI, 3D, and data capabilities powering all planners',
    Thoughts: '"Every planning tool feels coherent, intelligent, and consistent"',
    Channels: 'IMC · IKG · Kreativ · Configurators · AI inference layer',
    'Pain Points': 'Parallel 3D pipelines; fragmented product data; no shared AI or recommendation layer',
    KPIs: '3D model coverage · Planner-driven revenue (~€6B) · AI feature adoption rate',
    Features: 'Unified 3D Pipeline · NextGen AI (Decora, gen AI) · Shared knowledge platform',
  },
  Empower: {
    Actions: 'Co-workers use Commercial Planning; data tracks impact and drives re-engagement',
    Thoughts: '"I have the right tools and data to advise customers faster and more confidently"',
    Channels: 'Commercial Planning · GPC · Analytics dashboards · IKEA Family',
    'Pain Points': 'Revit dependency for store planning; low co-worker adoption; no HFK data product',
    KPIs: 'Revit replacement rate · Co-worker NPS · HFK data revenue (€TBD)',
    Features: 'Commercial Planning rollout · HFK data product · Re-engagement flows',
  },
  Govern: {
    Actions: 'Joint governance forum runs; legal, architecture, and comms frameworks in place',
    Thoughts: '"Ingka and Inter are aligned and moving as one joined-up organisation"',
    Channels: 'Home Planning Forum · Legal DAA · Integrated roadmap · P&C',
    'Pain Points': 'Overlapping ownership; unclear accountability; slow cross-org decision-making',
    KPIs: 'Home Planning Forum adoption · DAA signed · Integrated roadmap published',
    Features: 'Joint Home Planning Forum · Architecture North Star · Home Planning Taxonomy',
  },
}

const SWIMLANES = ['Actions', 'Thoughts', 'Channels', 'Pain Points', 'KPIs', 'Features']
const ROW_COLORS = ['#f0f7ff', '#f7f0ff', '#f0fff4', '#fff0f0', '#fafbfc', '#fff8e1']

export function P2SwimlaneMap(_props: ProposalProps) {
  return (
    <div>
      <h2 className="proposal-title">P2 — Swimlane Journey Map</h2>
      <p className="proposal-desc">
        Organises the journey into horizontal layers (Actions, Thoughts, Channels, Pain Points, KPIs, Features) so every role can find their layer of interest instantly. Design teams see what customers think and feel; commerce teams see KPIs; product teams see which features are mapped to each stage. The NPS badge per stage header anchors each column in business reality.
      </p>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 960, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 110, background: '#111', color: '#fff', padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', position: 'sticky', left: 0, zIndex: 2 }}>
                Layer
              </th>
              {STAGES.map((s) => {
                const m = STAGE_METRICS.find((x) => x.stage === s.name)!
                const nc = m.nps >= 10 ? '#149238' : m.nps >= 0 ? '#ed6f2c' : '#d2001f'
                return (
                  <th
                    key={s.name}
                    style={{ background: '#111', color: '#fff', padding: '0.6rem', textAlign: 'center', fontSize: '0.78rem', borderLeft: '1px solid #333', minWidth: 148 }}
                  >
                    <div>{s.name}</div>
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '1px 8px', borderRadius: 999, background: nc, fontSize: '0.7rem', fontWeight: 700 }}>
                      NPS {m.nps > 0 ? '+' : ''}{m.nps}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {SWIMLANES.map((lane, li) => (
              <tr key={lane}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', color: '#47607d', background: ROW_COLORS[li], borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>
                  {lane}
                </td>
                {STAGES.map((s) => (
                  <td
                    key={s.name}
                    style={{ padding: '0.5rem 0.6rem', fontSize: '0.76rem', color: '#2f3237', borderLeft: '1px solid #e2e8f0', background: ROW_COLORS[li], lineHeight: 1.4, verticalAlign: 'top' }}
                  >
                    {STAGE_CONTENT[s.name]?.[lane] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
