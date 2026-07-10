import { useState } from 'react'
import { STAGES, STAGE_METRICS, BACKLOG_ITEMS, STAGE_BOUNDS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 2 }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 999 }} />
    </div>
  )
}

export function P4BusinessKPI({ points }: ProposalProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <h2 className="proposal-title">P4 — Business KPI Dashboard</h2>
      <p className="proposal-desc">
        Translates the CJM into the language of business: NPS, conversion rate, drop-off, and effort score per stage. Stage cards give executives a quick scan of where the funnel is leaking and where satisfaction is lowest. Clicking any stage drills into its backlog, showing the business case for each investment. Sentiment badges (gains / risks / pains) add a quick CX signal without overwhelming non-design audiences.
      </p>
      <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#47607d' }}>Click a stage card to see its backlog.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {STAGES.map((s) => {
          const m = STAGE_METRICS.find((x) => x.stage === s.name)!
          const bounds = STAGE_BOUNDS[s.name] ?? { start: 0, end: 100 }
          const stagePts = points.filter((p) => p.x >= bounds.start && p.x < bounds.end)
          const gains = stagePts.filter((p) => p.sentiment === 'gain').length
          const pains = stagePts.filter((p) => p.sentiment === 'pain').length
          const risks = stagePts.filter((p) => p.sentiment === 'risk').length
          const nc = m.nps >= 10 ? '#149238' : m.nps >= 0 ? '#ed6f2c' : '#d2001f'
          const isSelected = selected === s.name

          return (
            <div
              key={s.name}
              onClick={() => setSelected(isSelected ? null : s.name)}
              style={{ flex: '1 1 150px', background: '#fff', border: isSelected ? '2px solid #1c4f8f' : '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.15s', boxShadow: isSelected ? '0 0 0 3px #1c4f8f22' : undefined }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: nc, lineHeight: 1 }}>
                {m.nps > 0 ? '+' : ''}{m.nps}
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888', marginLeft: 4 }}>NPS</span>
              </div>
              <div style={{ marginTop: 8, fontSize: '0.74rem', color: '#47607d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Conversion</span><b>{m.conversion}%</b></div>
                <MiniBar value={m.conversion} max={100} color="#1c4f8f" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}><span>Drop-off</span><b>{m.dropOff}%</b></div>
                <MiniBar value={m.dropOff} max={100} color="#d2001f" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}><span>Effort</span><b>{m.effort}/10</b></div>
                <MiniBar value={m.effort} max={10} color="#ed6f2c" />
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {gains > 0 && <span style={{ background: '#e6f4ea', color: '#149238', borderRadius: 999, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>+{gains} gains</span>}
                {risks > 0 && <span style={{ background: '#fff3e8', color: '#ed6f2c', borderRadius: 999, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>{risks} risks</span>}
                {pains > 0 && <span style={{ background: '#ffeaea', color: '#d2001f', borderRadius: 999, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>{pains} pains</span>}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>Backlog — {selected}</div>
          {BACKLOG_ITEMS.filter((b) => b.stage === selected).length === 0 && (
            <p style={{ color: '#47607d', margin: 0, fontSize: '0.84rem' }}>No backlog items for this stage.</p>
          )}
          {BACKLOG_ITEMS.filter((b) => b.stage === selected).map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.4rem 0', borderBottom: '1px solid #f0f4f8', fontSize: '0.84rem' }}>
              <span style={{ padding: '2px 8px', borderRadius: 999, background: item.horizon === 'T1' ? '#e6f4ea' : item.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: item.horizon === 'T1' ? '#149238' : item.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.7rem' }}>
                {item.horizon}
              </span>
              <span style={{ flex: 1 }}>{item.title}</span>
              <span style={{ color: item.priority === 'must-have' ? '#d2001f' : item.priority === 'nice-to-have' ? '#ed6f2c' : '#888', fontSize: '0.74rem' }}>{item.priority}</span>
              <span style={{ color: '#aaa', fontSize: '0.74rem' }}>{item.storyPoints}sp · {item.team}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
