import { STAGES, STAGE_METRICS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const STAGE_CONTENT: Record<string, Record<string, string>> = {
  Recognising: {
    Actions: 'Discovers IKEA home planning via the Hub, Find My Fit, and AI inspiration tools',
    Thoughts: '"I didn\'t know IKEA could help me plan my whole home like this"',
    Channels: 'IKEA.com · Home Planning Hub · App · Social media',
    'Pain Points': 'Planning tool awareness is low; Find My Fit not yet live; inactive customers not re-engaged',
    KPIs: 'Planning tool awareness rate · Hub traffic · Re-engagement rate',
    Features: 'Home Planning Hub · System furniture imagination (Find My Fit) · Re-engagement flows · Decora AI',
  },
  Exploring: {
    Actions: 'Browses range, scans room, creates space layout, gets AI-powered design ideas',
    Thoughts: '"The AI suggestions and room scanner make it so much easier to get started"',
    Channels: 'App · Kreativ · Blinka / Smarta · GPC · Website',
    'Pain Points': 'Room creation too technical; visual inconsistency across tools; no shared AI recommendation layer',
    KPIs: 'Exploration depth · Room creation rate · AI recommendation adoption',
    Features: 'Room scanning · Visual consistency UX · Smart Furnishing platform · Shared planning knowledge',
  },
  Choosing: {
    Actions: 'Configures system furniture, plans kitchen, generates shopping list with accurate 3D visuals',
    Thoughts: '"I need to know this will actually fit and look right in my space"',
    Channels: 'GPC · Kreativ · New Kitchen Planner · PAX / METOD configurators',
    'Pain Points': 'System furniture missing from space planning; parallel 3D pipelines; new ranges not yet supported',
    KPIs: 'Planning session completion · Config-to-cart conversion · 3D model coverage',
    Features: 'System furniture in space planner · New Kitchen Planner · Unified 3D ecosystem · Planera · Gen AI planning',
  },
  Committing: {
    Actions: 'Edits design from any device, finalises configuration, adds to cart and checks out',
    Thoughts: '"I started on my phone — I need to be able to finish this in-store seamlessly"',
    Channels: 'IKEA.com · App · In-store kiosk · GPC',
    'Pain Points': 'Omnichannel design editing not yet available; new range support lagging behind launches',
    KPIs: 'Omnichannel conversion rate · Average order value · Cart abandonment rate',
    Features: 'Omni-channel design editing · INKÖPARE range support · Standardised data sharing',
  },
  Receiving: {
    Actions: 'Tracks delivery, receives products; planning data feeds analytics and future recommendations',
    Thoughts: '"I hope everything fits as well as it looked in the planner"',
    Channels: 'Delivery service · Click & collect · IKEA Family',
    'Pain Points': 'No planning data linked to fulfilment outcomes; HFK data not yet productised',
    KPIs: 'On-time delivery NPS · Planning-to-fulfilment accuracy · HFK data activation',
    Features: 'Harmonised analytics · HFK data product · Store planning data tracking',
  },
  Integrating: {
    Actions: 'Co-worker assists with store design via Commercial Planning; IDS team supports complex projects',
    Thoughts: '"My co-worker has the right tools — no more waiting for a Revit specialist"',
    Channels: 'Commercial Planning · GPC · Interior Design Services',
    'Pain Points': 'Revit dependency blocks store design; co-worker tools underfunded; IDS workflow disconnected',
    KPIs: 'Revit replacement rate · Co-worker NPS · IDS conversion rate',
    Features: 'Commercial Planning rollout · IDS home planning integration · Co-worker collaboration tools',
  },
  Living: {
    Actions: 'Governance forum meets; roadmap aligned; legal and architecture frameworks confirmed',
    Thoughts: '"Ingka and Inter move as one organisation with a clear, shared direction"',
    Channels: 'Home Planning Forum · Legal DAA · Architecture blueprints · P&C',
    'Pain Points': 'Overlapping Ingka/Inter ownership; no shared taxonomy; slow cross-org decision-making',
    KPIs: 'Forum adoption rate · DAA signed · Integrated roadmap published · Taxonomy agreed',
    Features: 'Joint Home Planning Forum · Architecture North Star · Home Planning Taxonomy · P&C transition',
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
