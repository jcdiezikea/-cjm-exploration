import { STAGES, BACKLOG_ITEMS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const CX_DATA: Record<string, Record<'action' | 'thought' | 'channel', string>> = {
  Recognising: { action: 'Discovers IKEA via social/store/WOM', thought: '"I need to redesign my room"', channel: 'Instagram · Store · IKEA.com' },
  Exploring: { action: 'Browses range and planning tools', thought: '"Too many options, I feel lost"', channel: 'App · Website · Store' },
  Choosing: { action: 'Plans room layout, configures products', thought: '"Will this actually fit and match?"', channel: 'Planning tool · App · Consultant' },
  Committing: { action: 'Books appointment and checks out', thought: '"The wait and cost are frustrating"', channel: 'Website · Store · Phone' },
  Receiving: { action: 'Tracks and receives delivery', thought: '"The guarantee is a pleasant surprise"', channel: 'Delivery · Click & collect' },
  Integrating: { action: 'Assembles and sets up room', thought: '"This took much longer than expected"', channel: 'Assembly guide · Support · YouTube' },
  Living: { action: 'Uses room daily, shares online', thought: '"IKEA never checks in after purchase"', channel: 'Social · IKEA Family · App' },
}

const BS_DATA: Record<string, Record<'team' | 'system' | 'process', string>> = {
  Recognising: { team: 'Marketing', system: 'CMS / CDP', process: 'Audience segmentation + content targeting' },
  Exploring: { team: 'Digital Product', system: 'IKEA App / Website', process: 'Personalization engine + range data sync' },
  Choosing: { team: 'Planning Tools', system: 'Planning tool / Cart service', process: 'Config validation + availability check' },
  Committing: { team: 'Commerce + Logistics', system: 'OMS + Appointment system', process: 'Order processing + slot allocation' },
  Receiving: { team: 'Logistics + Fulfilment', system: 'WMS + Delivery tracking', process: 'Pick-pack-ship + last-mile routing' },
  Integrating: { team: 'Customer Service', system: 'Support platform', process: 'Assembly support + return processing' },
  Living: { team: 'CRM + Loyalty', system: 'CRM / IKEA Family', process: 'Re-engagement campaigns + loyalty rewards' },
}

export function P5ServiceBlueprint(_props: ProposalProps) {
  const colCount = STAGES.length + 1

  return (
    <div>
      <h2 className="proposal-title">P5 — Service Blueprint</h2>
      <p className="proposal-desc">
        Extends the swimlane map across the Line of Visibility — separating what customers experience (Actions, Thoughts, Channels) from what happens backstage (Team, System, Process). This is the most complete view for cross-functional alignment: it shows which internal teams and systems are responsible for each customer moment, and maps backlog items to their operational context. Ideal for Engineering Managers and service design workshops.
      </p>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 1020, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 125, background: '#111', color: '#fff', padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', position: 'sticky', left: 0, zIndex: 2 }}>Layer</th>
              {STAGES.map((s) => (
                <th key={s.name} style={{ background: '#111', color: '#fff', padding: '0.6rem', textAlign: 'center', fontSize: '0.78rem', borderLeft: '1px solid #333', minWidth: 145 }}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Customer-facing rows */}
            {([
              { key: 'action' as const, label: '👤 Customer action', bg: '#f0f7ff' },
              { key: 'thought' as const, label: '💭 Thought / feeling', bg: '#f7f0ff' },
              { key: 'channel' as const, label: '📱 Channel', bg: '#f0fff4' },
            ] as const).map(({ key, label, bg }) => (
              <tr key={key}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', background: bg, borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>{label}</td>
                {STAGES.map((s) => (
                  <td key={s.name} style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#2f3237', borderLeft: '1px solid #e2e8f0', background: bg, lineHeight: 1.4, verticalAlign: 'top' }}>
                    {CX_DATA[s.name]?.[key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Line of visibility */}
            <tr>
              <td colSpan={colCount} style={{ padding: '0.4rem', background: '#ffc800', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', color: '#111' }}>
                ── Line of Visibility ──
              </td>
            </tr>

            {/* Backstage rows */}
            {([
              { key: 'team' as const, label: '🏢 Team responsible', bg: '#fafbfc' },
              { key: 'system' as const, label: '⚙️ System / tool', bg: '#f5f7fa' },
              { key: 'process' as const, label: '🔄 Process', bg: '#fafbfc' },
            ] as const).map(({ key, label, bg }) => (
              <tr key={key}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', background: bg, borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>{label}</td>
                {STAGES.map((s) => (
                  <td key={s.name} style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#47607d', borderLeft: '1px solid #e2e8f0', background: bg, lineHeight: 1.4, verticalAlign: 'top' }}>
                    {BS_DATA[s.name]?.[key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Backlog row */}
            <tr>
              <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', background: '#fff8e1', borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>📋 Backlog</td>
              {STAGES.map((s) => (
                <td key={s.name} style={{ padding: '0.4rem', borderLeft: '1px solid #e2e8f0', background: '#fff8e1', verticalAlign: 'top' }}>
                  {BACKLOG_ITEMS.filter((b) => b.stage === s.name).map((item) => (
                    <div key={item.id} style={{ fontSize: '0.68rem', marginBottom: 3, padding: '2px 6px', borderRadius: 4, background: item.horizon === 'T1' ? '#e6f4ea' : item.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: '#333', fontWeight: 600 }}>
                      {item.horizon} · {item.title}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
