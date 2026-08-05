import { useState } from 'react'
import { STAGES, STAGE_METRICS, BACKLOG_ITEMS, type Role, type JourneyPoint, CJM_STAGES } from '../data/journeyData.ts'
import { STAGE_SUGGESTIONS, type Suggestion } from '../data/suggestionsData.ts'
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
  const [selStage, setSelStage] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [addedItems, setAddedItems] = useState<(Suggestion & { stage: string })[]>([])

  function handleSelect(stage: string) {
    setSelStage(prev => prev === stage ? null : stage)
    setShowSuggestions(false)
  }

  function addSuggestion(s: Suggestion) {
    if (addedIds.has(s.id) || !selStage) return
    setAddedIds(prev => new Set([...prev, s.id]))
    setAddedItems(prev => [...prev, { ...s, stage: selStage }])
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {STAGE_METRICS.map((m) => {
          const nc = m.nps >= 10 ? '#149238' : m.nps >= 0 ? '#ed6f2c' : '#d2001f'
          const isSelected = selStage === m.stage
          return (
            <div
              key={m.stage}
              onClick={() => handleSelect(m.stage)}
              style={{ flex: '1 1 140px', background: '#fff', border: `2px solid ${isSelected ? '#1c4f8f' : '#e2e8f0'}`, borderRadius: 12, padding: '0.85rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
            >
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

      {selStage && (() => {
        const stageBacklog = [
          ...BACKLOG_ITEMS.filter((b) => b.stage === selStage),
          ...addedItems.filter((b) => b.stage === selStage),
        ]
        const suggestions = (STAGE_SUGGESTIONS[selStage] ?? [])
          .filter((s) => !addedIds.has(s.id))
          .sort((a, b) => (b.impacts.nps ?? 0) - (a.impacts.nps ?? 0))

        return (
          <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>
              Backlog — <strong>{selStage}</strong>
            </div>
            {stageBacklog.length === 0 && (
              <p style={{ color: '#47607d', margin: 0, fontSize: '0.84rem' }}>No backlog items for this stage.</p>
            )}
            {stageBacklog.map((item) => {
              const isProposed = addedIds.has(item.id)
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.4rem 0', borderBottom: '1px solid #f0f4f8', fontSize: '0.84rem' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, background: item.horizon === 'T1' ? '#e6f4ea' : item.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: item.horizon === 'T1' ? '#149238' : item.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.7rem' }}>{item.horizon}</span>
                  {isProposed && <span style={{ padding: '2px 8px', borderRadius: 999, background: '#f0f4ff', color: '#1c4f8f', fontWeight: 700, fontSize: '0.7rem' }}>Proposed</span>}
                  <span style={{ flex: 1 }}>{item.title}</span>
                  <span style={{ color: item.priority === 'must-have' ? '#d2001f' : item.priority === 'nice-to-have' ? '#ed6f2c' : '#888', fontSize: '0.74rem' }}>{item.priority}</span>
                  <span style={{ color: '#aaa', fontSize: '0.74rem' }}>{item.storyPoints}sp · {item.team}</span>
                </div>
              )
            })}

            <div style={{ marginTop: '0.75rem', borderTop: '1px solid #f0f4f8', paddingTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowSuggestions(v => !v)}
                style={{ padding: '0.4rem 1rem', borderRadius: 8, border: '1.5px solid #1c4f8f', background: showSuggestions ? '#1c4f8f' : '#fff', color: showSuggestions ? '#fff' : '#1c4f8f', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                {showSuggestions ? '▲ Hide proposals' : '▼ Suggest improvements'}
              </button>

              {showSuggestions && (
                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.6rem' }}>
                  {suggestions.length === 0 && (
                    <p style={{ color: '#47607d', margin: 0, fontSize: '0.84rem' }}>All suggestions already added.</p>
                  )}
                  {suggestions.map((s) => (
                    <div key={s.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fafbfc' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#111', marginBottom: 6 }}>{s.title}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 999, background: s.horizon === 'T1' ? '#e6f4ea' : s.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: s.horizon === 'T1' ? '#149238' : s.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.7rem' }}>{s.horizon}</span>
                          <span style={{ padding: '2px 8px', borderRadius: 999, background: '#f5f7fa', color: '#47607d', fontSize: '0.7rem' }}>{s.team}</span>
                          <span style={{ padding: '2px 8px', borderRadius: 999, background: '#f5f7fa', color: '#47607d', fontSize: '0.7rem' }}>{s.storyPoints}sp</span>
                          {Object.entries(s.impacts).map(([k, v]) => {
                            if (v == null) return null
                            const invertedKeys = ['dropOff', 'effort']
                            const good = invertedKeys.includes(k) ? v < 0 : v > 0
                            const label = k === 'nps' ? 'NPS' : k === 'csat' ? 'CSAT' : k === 'conversion' ? 'Conv.' : k === 'dropOff' ? 'Drop-off' : 'Effort'
                            return (
                              <span key={k} style={{ padding: '2px 8px', borderRadius: 999, background: good ? '#e6f4ea' : '#ffeaea', color: good ? '#149238' : '#d2001f', fontWeight: 700, fontSize: '0.7rem' }}>
                                {v > 0 ? '+' : ''}{v} {label}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSuggestion(s)}
                        style={{ flexShrink: 0, padding: '0.35rem 0.8rem', borderRadius: 8, border: 'none', background: '#1c4f8f', color: '#fff', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

function slimPoints(points: JourneyPoint[]): JourneyPoint[] {
  // Keep all peaks and pains; cap neutral/risk at 2 per stage to reduce clutter
  const segW = 100 / CJM_STAGES.length
  return CJM_STAGES.flatMap((_stage, idx) => {
    const stagePoints = points.filter(
      (p) => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5
    )
    const peaks   = stagePoints.filter(p => p.sentiment === 'gain')
    const pains   = stagePoints.filter(p => p.sentiment === 'pain')
    const neutral = stagePoints.filter(p => p.sentiment === 'risk').slice(0, 2)
    return [...peaks, ...neutral, ...pains]
  })
}

function deriveDesignInsights(points: JourneyPoint[]) {
  const gains = points.filter(p => p.sentiment === 'gain').sort((a, b) => a.y - b.y)
  const pains = points.filter(p => p.sentiment === 'pain').sort((a, b) => b.y - a.y)

  // Stage with most pain points
  const painsByStage = CJM_STAGES.map(stage => {
    const segW = 100 / CJM_STAGES.length
    const idx = CJM_STAGES.indexOf(stage)
    const count = pains.filter(p => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5).length
    return { stage, count }
  }).sort((a, b) => b.count - a.count)

  // Stage with most gain points (strongest positive stretch)
  const gainsByStage = CJM_STAGES.map(stage => {
    const segW = 100 / CJM_STAGES.length
    const idx = CJM_STAGES.indexOf(stage)
    const count = gains.filter(p => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5).length
    return { stage, count }
  }).sort((a, b) => b.count - a.count)

  return {
    bestMoment:   gains[0] ?? null,
    worstPain:    pains[0] ?? null,
    painStage:    painsByStage[0]?.count > 0 ? painsByStage[0] : null,
    peakStage:    gainsByStage[0]?.count > 0 ? gainsByStage[0] : null,
    peakCount:    gains.length,
    painCount:    pains.length,
  }
}

function DesignTab({ points }: { points: JourneyPoint[] }) {
  const slim = slimPoints(points)
  const ins  = deriveDesignInsights(slim)

  const insightCards = [
    ins.bestMoment && {
      label: 'Best moment',
      value: ins.bestMoment.text.length > 55 ? ins.bestMoment.text.slice(0, 55) + '…' : ins.bestMoment.text,
      color: '#149238', bg: '#e6f4ea',
    },
    ins.worstPain && {
      label: 'Biggest pain',
      value: ins.worstPain.text.length > 55 ? ins.worstPain.text.slice(0, 55) + '…' : ins.worstPain.text,
      color: '#d2001f', bg: '#ffeaea',
    },
    ins.painStage && {
      label: 'Most painful stage',
      value: `${ins.painStage.stage} — ${ins.painStage.count} pain point${ins.painStage.count > 1 ? 's' : ''}`,
      color: '#ed6f2c', bg: '#fff3e8',
    },
    ins.peakStage && {
      label: 'Strongest stage',
      value: `${ins.peakStage.stage} — ${ins.peakStage.count} peak moment${ins.peakStage.count > 1 ? 's' : ''}`,
      color: '#1c4f8f', bg: '#f0f6ff',
    },
    {
      label: 'Signal balance',
      value: `${ins.peakCount} peaks · ${ins.painCount} pain points`,
      color: '#47607d', bg: '#f5f7fa',
    },
  ].filter(Boolean) as { label: string; value: string; color: string; bg: string }[]

  return (
    <div>
      <div className="proposal-card">
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" style={{ flexGrow: s.weight }}>{s.name}</div>
          ))}
        </div>
        <JourneyChart points={slim} stages={STAGES.map((s) => s.name)} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {insightCards.map((card) => (
          <div key={card.label} style={{ flex: '1 1 160px', background: card.bg, border: `1px solid ${card.color}33`, borderRadius: 12, padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{card.label}</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{card.value}</div>
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
      <h2 className="proposal-title">P2 — Role Dashboard</h2>
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
