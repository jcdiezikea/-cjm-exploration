import { STAGES, BACKLOG_ITEMS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const CX_DATA: Record<string, Record<'action' | 'thought' | 'channel', string>> = {
  Connect: { action: 'Plans and buys with connected tools across online, app, and in-store', thought: '"My planning progress is never lost — I can continue from any channel"', channel: 'IKEA.com · App · In-store kiosk · GPC' },
  Build:   { action: 'Experiences consistent AI-powered 3D visuals across all planning tools', thought: '"Everything looks coherent and the tools feel intelligently designed"', channel: 'Kreativ · Configurators · IMC · IKG · AI layer' },
  Empower: { action: 'Works with co-workers using Commercial Planning for confident advice', thought: '"My co-worker has the right tools and data to help me successfully"', channel: 'Commercial Planning · GPC · Analytics' },
  Govern:  { action: 'Benefits from clear ownership, consistent delivery, and aligned experiences', thought: '"IKEA acts as one joined-up team with a clear, shared direction"', channel: 'Integrated roadmap · Home Planning Forum · Stakeholder comms' },
}

const BS_DATA: Record<string, Record<'team' | 'system' | 'process', string>> = {
  Connect: { team: 'Digital Product & Planning Tools (Ingka + Inter)', system: 'GPC / Kreativ / Configurators / Cart service', process: 'Omni-channel design sync + purchase flow integration' },
  Build:   { team: 'Inter IMC + Ingka Platform + Data teams',           system: 'IMC / IKG / AI inference layer / Planera',    process: '3D model pipeline + product knowledge graph + AI orchestration' },
  Empower: { team: 'Inter M&CP + Ingka Commerce + CRM',                 system: 'Commercial Planning / Analytics / CRM',       process: 'Store design workflows + co-worker training + data tracking' },
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
