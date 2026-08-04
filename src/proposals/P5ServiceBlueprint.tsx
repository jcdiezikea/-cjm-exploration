import { useState } from 'react'
import { STAGES, BACKLOG_ITEMS } from '../data/journeyData.ts'

const HORIZONS = ['T1', 'T2', 'T3'] as const
const HORIZON_LABEL: Record<string, string> = { T1: 'T1 — Now', T2: 'T2 — Next', T3: 'T3 — Future' }
const HORIZON_BG: Record<string, string>    = { T1: '#f0fff4',  T2: '#fff8f0',  T3: '#f5f7fa' }
import type { ProposalProps } from './types.ts'

const CX_DATA: Record<string, Record<'action' | 'thought' | 'channel', string>> = {
  Recognising: { action: 'Discovers IKEA planning via Hub, AI inspiration, and awareness campaigns',          thought: '"I didn\'t know IKEA could help me design my whole home"',                       channel: 'Home Planning Hub · App · IKEA.com · Social' },
  Exploring:   { action: 'Scans room, gets AI design ideas, browses compatible ranges',                       thought: '"The room scanner and AI make it so much easier to start"',                    channel: 'App · Kreativ · Blinka / Smarta · GPC' },
  Choosing:    { action: 'Configures system furniture, plans kitchen, views accurate 3D',                     thought: '"I need to know this will actually fit and look right"',                         channel: 'GPC · Kitchen Planner · PAX / METOD configurators' },
  Committing:  { action: 'Edits design from any device, finalises config, checks out',                        thought: '"I started on my phone — I need to finish this in-store"',                         channel: 'IKEA.com · App · In-store kiosk · GPC' },
  Receiving:   { action: 'Tracks delivery; planning data captured for future personalisation',                 thought: '"I hope everything fits as well as it looked in the planner"',                   channel: 'Delivery service · Click & collect · IKEA Family' },
  Integrating: { action: 'Co-worker assists with store design using Commercial Planning',                      thought: '"My co-worker has the right tools — no waiting for a Revit specialist"',           channel: 'Commercial Planning · GPC · Interior Design Services' },
  Living:      { action: 'Benefits from aligned governance, clear ownership, and a consistent joint roadmap', thought: '"IKEA acts as one joined-up organisation with a clear direction"',               channel: 'Home Planning Forum · Integrated roadmap · DAA' },
}

const BS_DATA: Record<string, Record<'team' | 'system' | 'process', string>> = {
  Recognising: { team: 'Marketing + Digital Content (Ingka)',             system: 'CMS / CDP / Home Planning Hub',                  process: 'Awareness campaigns + Hub content + re-engagement flows' },
  Exploring:   { team: 'Digital Product + Inter IMC (AI layer)',           system: 'App / Kreativ / Smart Furnishing / GPC',           process: 'Room scanning + AI recommendations + UX consistency' },
  Choosing:    { team: 'Planning Tools (Ingka + Inter)',                   system: 'GPC / Kitchen Planner / IMC 3D pipeline / Planera', process: 'Config validation + 3D rendering + product availability' },
  Committing:  { team: 'Commerce + Digital Product (Ingka)',               system: 'Cart service / OMS / GPC',                         process: 'Omni-channel sync + order processing + range data' },
  Receiving:   { team: 'Logistics + Data & Analytics (Joint)',             system: 'WMS / Delivery tracking / HFK analytics',           process: 'Last-mile routing + planning data capture + HFK product' },
  Integrating: { team: 'Inter M&CP + Ingka Commerce + IDS',               system: 'Commercial Planning / GPC / IDS tooling',           process: 'Store design workflows + co-worker training + IDS integration' },
  Living:      { team: 'Ingka + Inter leadership / P&C / Legal / Arch',   system: 'Roadmap tool / Legal DAA / Architecture blueprints', process: 'Joint governance + DAA finalisation + taxonomy alignment' },
}

export function P5ServiceBlueprint(_props: ProposalProps) {
  const colCount = STAGES.length + 1
  const [visible, setVisible] = useState<Set<string>>(
    new Set(['action', 'thought', 'channel', 'team', 'system', 'process', 'backlog'])
  )
  const tog = (key: string) => setVisible(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  const CX_ROWS = [
    { key: 'action',  label: '👤 Action',  bg: '#f0f7ff' },
    { key: 'thought', label: '💭 Thought',  bg: '#f7f0ff' },
    { key: 'channel', label: '📱 Channel',  bg: '#f0fff4' },
  ] as const
  const BS_ROWS = [
    { key: 'team',    label: '🏢 Team',    bg: '#fafbfc' },
    { key: 'system',  label: '⚙️ System',  bg: '#f5f7fa' },
    { key: 'process', label: '🔄 Process', bg: '#fafbfc' },
  ] as const

  function Pill({ rowKey, label }: { rowKey: string; label: string }) {
    const on = visible.has(rowKey)
    return (
      <button
        type="button"
        onClick={() => tog(rowKey)}
        style={{
          padding: '3px 11px', borderRadius: 999, fontSize: '0.72rem', fontWeight: on ? 700 : 400,
          border: `1.5px solid ${on ? '#1c4f8f' : '#d7e1ec'}`,
          background: on ? '#1c4f8f' : '#fff', color: on ? '#fff' : '#47607d',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >{label}</button>
    )
  }

  const STAGE_EMOJI: Record<string, string> = {
    Recognising: '🔍', Exploring: '🗺️', Choosing: '🎯',
    Committing: '🛒', Receiving: '📦', Integrating: '🏗️', Living: '🏠',
  }

  return (
    <div>
      <h2 className="proposal-title">P1 — Service Blueprint</h2>
      <p className="proposal-desc">
        Extends the swimlane map across the Line of Visibility — separating what customers experience (Actions, Thoughts, Channels) from what happens backstage (Team, System, Process). This is the most complete view for cross-functional alignment: it shows which internal teams and systems are responsible for each customer moment, and maps backlog items to their operational context. Ideal for Engineering Managers and service design workshops.
      </p>

      {/* Row visibility pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', marginBottom: '0.85rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filters</span>
        <Pill rowKey="action"  label="Action" />
        <Pill rowKey="thought" label="Thought" />
        <Pill rowKey="channel" label="Channel" />
        <Pill rowKey="team"    label="Team" />
        <Pill rowKey="system"  label="System" />
        <Pill rowKey="process" label="Process" />
        <Pill rowKey="backlog" label="Backlog" />
      </div>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 1020, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 125, background: '#e8eef6', color: '#111', padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, position: 'sticky', left: 0, zIndex: 2, borderRight: '1px solid #dde5ef', borderBottom: '2px solid #c0d0e8' }}>Layer</th>
              {STAGES.map((s) => (
                <th key={s.name} style={{ background: '#f0f6ff', color: '#111', padding: '0.6rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, borderLeft: '1px solid #dde5ef', borderBottom: '2px solid #c0d0e8', minWidth: 145 }}>
                  {STAGE_EMOJI[s.name]} {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CX_ROWS.filter(r => visible.has(r.key)).map(({ key, label, bg }) => (
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
            {BS_ROWS.filter(r => visible.has(r.key)).map(({ key, label, bg }) => (
              <tr key={key}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', background: bg, borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>{label}</td>
                {STAGES.map((s) => (
                  <td key={s.name} style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#47607d', borderLeft: '1px solid #e2e8f0', background: bg, lineHeight: 1.4, verticalAlign: 'top' }}>
                    {BS_DATA[s.name]?.[key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Backlog rows — one per horizon */}
            {visible.has('backlog') && HORIZONS.map((h) => (
              <tr key={h}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.76rem', background: HORIZON_BG[h], borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1, verticalAlign: 'top' }}>
                  📋 {HORIZON_LABEL[h]}
                </td>
                {STAGES.map((s) => {
                  const items = BACKLOG_ITEMS.filter((b) => b.stage === s.name && b.horizon === h)
                  return (
                    <td key={s.name} style={{ padding: '0.4rem', borderLeft: '1px solid #e2e8f0', background: HORIZON_BG[h], verticalAlign: 'top', minHeight: 48 }}>
                      {items.map((item) => (
                        <div key={item.id} style={{ marginBottom: 4, padding: '0.35rem 0.5rem', borderRadius: 6, background: '#fff', border: '1.5px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2f3237', lineHeight: 1.25 }}>{item.title}</div>
                          <div style={{ marginTop: 3, fontSize: '0.64rem', color: '#94a3b8' }}>{item.team} · {item.storyPoints}sp</div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
