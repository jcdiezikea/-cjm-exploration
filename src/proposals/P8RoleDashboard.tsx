import { useState } from 'react'
import { STAGES, STAGE_METRICS, BACKLOG_ITEMS, type Role } from '../data/journeyData.ts'
import { JourneyChart } from '../JourneyChart.tsx'
import type { ProposalProps } from './types.ts'

const ROLES: { id: Role; label: string }[] = [
  { id: 'business', label: '💼 Business' },
  { id: 'design', label: '🎨 Design' },
  { id: 'engineering', label: '⚙️ Engineering' },
  { id: 'roadmap', label: '🗺️ Roadmap' },
]

const HC: Record<string, string> = { T1: '#149238', T2: '#ed6f2c', T3: '#aab0b8' }

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 2 }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 999 }} />
    </div>
  )
}

function BusinessTab() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {STAGE_METRICS.map((m) => {
        const nc = m.nps >= 10 ? '#149238' : m.nps >= 0 ? '#ed6f2c' : '#d2001f'
        return (
          <div key={m.stage} style={{ flex: '1 1 140px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.85rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>{m.stage}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: nc }}>
              {m.nps > 0 ? '+' : ''}{m.nps}
              <span style={{ fontSize: '0.65rem', color: '#888', marginLeft: 3 }}>NPS</span>
            </div>
            <div style={{ marginTop: 6, fontSize: '0.74rem', color: '#47607d' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Conv.</span><b>{m.conversion}%</b></div>
              <MiniBar value={m.conversion} max={100} color="#1c4f8f" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}><span>Drop</span><b>{m.dropOff}%</b></div>
              <MiniBar value={m.dropOff} max={100} color="#d2001f" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}><span>Effort</span><b>{m.effort}/10</b></div>
              <MiniBar value={m.effort} max={10} color="#ed6f2c" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DesignTab({ points }: { points: ProposalProps['points'] }) {
  return (
    <div>
      <div className="proposal-card">
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" style={{ flexGrow: s.weight }}>{s.name}</div>
          ))}
        </div>
        <JourneyChart points={points} stages={STAGES.map((s) => s.name)} />
      </div>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {points.filter((p) => p.sentiment === 'pain').slice(0, 4).map((p) => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid #fbb', borderRadius: 12, padding: '0.75rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d2001f', marginBottom: 4, textTransform: 'uppercase' }}>Pain point</div>
            <div style={{ fontSize: '0.82rem', color: '#2f3237', lineHeight: 1.4 }}>{p.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EngineeringTab() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#111', color: '#fff' }}>
            {['Stage', 'Feature', 'Priority', 'Horizon', 'Team', 'SP'].map((h) => (
              <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.78rem' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BACKLOG_ITEMS.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? '#fafbfc' : '#fff' }}>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderBottom: '1px solid #f0f4f8' }}>{item.stage}</td>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderBottom: '1px solid #f0f4f8' }}>{item.title}</td>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderBottom: '1px solid #f0f4f8', color: item.priority === 'must-have' ? '#d2001f' : item.priority === 'nice-to-have' ? '#ed6f2c' : '#888' }}>{item.priority}</td>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderBottom: '1px solid #f0f4f8' }}>
                <span style={{ padding: '2px 7px', borderRadius: 999, background: item.horizon === 'T1' ? '#e6f4ea' : item.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: item.horizon === 'T1' ? '#149238' : item.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.7rem' }}>{item.horizon}</span>
              </td>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderBottom: '1px solid #f0f4f8', color: '#47607d' }}>{item.team}</td>
              <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderBottom: '1px solid #f0f4f8', fontWeight: 700 }}>{item.storyPoints}</td>
            </tr>
          ))}
          <tr style={{ background: '#f5f7fa' }}>
            <td colSpan={5} style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#47607d' }}>Total story points</td>
            <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', fontWeight: 800 }}>{BACKLOG_ITEMS.reduce((s, i) => s + i.storyPoints, 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function RoadmapTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {(['T1', 'T2', 'T3'] as const).map((h) => (
        <div key={h} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: HC[h], display: 'inline-block' }} />
            {h === 'T1' ? 'T1 — Now (committed)' : h === 'T2' ? 'T2 — Next quarter' : 'T3 — Future horizon'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BACKLOG_ITEMS.filter((b) => b.horizon === h).map((item) => (
              <div key={item.id} style={{ background: h === 'T1' ? '#e6f4ea' : h === 'T2' ? '#fff3e8' : '#f0f4f8', border: `1px solid ${HC[h]}44`, borderRadius: 8, padding: '0.4rem 0.7rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{item.title}</div>
                <div style={{ color: '#888', fontSize: '0.7rem', marginTop: 2 }}>{item.stage} · {item.team} · {item.storyPoints}sp</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function P8RoleDashboard({ points }: ProposalProps) {
  const [role, setRole] = useState<Role>('business')

  return (
    <div>
      <h2 className="proposal-title">P8 — Role-Filtered Dashboard</h2>
      <p className="proposal-desc">
        One dataset, four tailored views — each optimised for a different stakeholder. Business leaders see KPI cards and conversion metrics. Design teams get the emotion curve and pain-point highlights. Engineering sees the full backlog table with story points and team ownership. Roadmap leaders get T1/T2/T3 horizon groupings. This proposal makes the case for a single CJM tool that adapts its presentation to its audience rather than maintaining separate decks.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            style={{ padding: '0.45rem 1rem', border: '1px solid #ccd8e7', borderRadius: 999, background: role === r.id ? '#111' : '#fff', color: role === r.id ? '#ffc800' : '#333', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            {r.label}
          </button>
        ))}
      </div>
      {role === 'business' && <BusinessTab />}
      {role === 'design' && <DesignTab points={points} />}
      {role === 'engineering' && <EngineeringTab />}
      {role === 'roadmap' && <RoadmapTab />}
    </div>
  )
}
