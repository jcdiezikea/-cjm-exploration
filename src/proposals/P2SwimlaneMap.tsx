import { STAGES, STAGE_METRICS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const STAGE_CONTENT: Record<string, Record<string, string>> = {
  Recognising: {
    Actions: 'Discovers via social, store visits, word of mouth',
    Thoughts: '"Where do I even start with a new room?"',
    Channels: 'Instagram · YouTube · IKEA.com · Store',
    'Pain Points': 'Missing local + personalized inspiration',
    KPIs: 'Awareness rate · Organic traffic',
    Features: 'Personalized feed · Room style quiz',
  },
  Exploring: {
    Actions: 'Browses range, uses planning tools, compares products',
    Thoughts: '"There are too many options, I feel overwhelmed"',
    Channels: 'IKEA App · Website · In-store',
    'Pain Points': 'Choice overload · No range coordination guide',
    KPIs: 'Engagement rate · Time on site',
    Features: 'Range wizard · Coordination helper',
  },
  Choosing: {
    Actions: 'Plans room layout, configures products, saves wishlists',
    Thoughts: '"I\'m not sure this will actually work in my space"',
    Channels: 'IKEA Planning tool · App · Store consultant',
    'Pain Points': 'Blank-page paralysis · Omnichannel disconnect',
    KPIs: 'Planning session completion · Saved lists',
    Features: 'Starter templates · Omnichannel cart',
  },
  Committing: {
    Actions: 'Books planning appointment, adds to cart, checks out',
    Thoughts: '"The wait for an appointment is too long"',
    Channels: 'Website · Store · Phone',
    'Pain Points': 'Long appointment waits · Delivery cost perception',
    KPIs: 'Conversion rate · Average order value',
    Features: 'Instant slots · Delivery cost estimator',
  },
  Receiving: {
    Actions: 'Tracks delivery, receives and inspects products',
    Thoughts: '"The long guarantee was a pleasant surprise"',
    Channels: 'Delivery service · Click & collect',
    'Pain Points': 'Delivery cost still perceived as high',
    KPIs: 'On-time delivery rate · Receiving NPS',
    Features: 'Real-time tracking',
  },
  Integrating: {
    Actions: 'Assembles furniture, sets up the room',
    Thoughts: '"This is taking much longer than I expected"',
    Channels: 'Assembly guide · Customer service · YouTube',
    'Pain Points': 'Assembly time and skills underestimated',
    KPIs: 'Assembly NPS · Support contact rate',
    Features: 'Assembly effort estimator',
  },
  Living: {
    Actions: 'Uses the room daily, shares photos, considers repurchase',
    Thoughts: '"IKEA doesn\'t check in — I feel forgotten"',
    Channels: 'IKEA Family · Social media · App',
    'Pain Points': 'Low post-purchase engagement from IKEA',
    KPIs: 'Repeat purchase rate · Retention score',
    Features: 'Care nudges · Re-engagement missions',
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
