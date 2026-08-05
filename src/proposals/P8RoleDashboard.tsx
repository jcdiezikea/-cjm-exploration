import { useState } from 'react'
import type React from 'react'
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

  const segW = 100 / CJM_STAGES.length
  // Per-stage signal counts used by the "Signal balance" detail panel
  const stageSignals = CJM_STAGES.map((stage, idx) => {
    const inStage = (p: JourneyPoint) => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5
    const g = gains.filter(inStage).length
    const p = pains.filter(inStage).length
    return { stage, gains: g, pains: p, net: g - p }
  })

  // Stage with most pain points
  const painsByStage = CJM_STAGES.map(stage => {
    const idx = CJM_STAGES.indexOf(stage)
    const inStage = (p: JourneyPoint) => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5
    const stagePains = pains.filter(inStage)
    return { stage, count: stagePains.length, points: stagePains }
  }).sort((a, b) => b.count - a.count)

  // Stage with most gain points (strongest positive stretch)
  const gainsByStage = CJM_STAGES.map(stage => {
    const idx = CJM_STAGES.indexOf(stage)
    const inStage = (p: JourneyPoint) => p.x >= idx * segW - segW * 0.5 && p.x < (idx + 1) * segW + segW * 0.5
    const stageGains = gains.filter(inStage)
    return { stage, count: stageGains.length, points: stageGains }
  }).sort((a, b) => b.count - a.count)

  return {
    bestMoment:        gains[0] ?? null,
    worstPain:         pains[0] ?? null,
    worstPainStage:    (() => {
      if (!pains[0]) return null
      const idx = Math.round(pains[0].x / segW)
      return CJM_STAGES[Math.min(idx, CJM_STAGES.length - 1)] ?? null
    })(),
    painStage:         painsByStage[0]?.count > 0 ? painsByStage[0] : null,
    painStagePoints:   painsByStage[0]?.points ?? [],
    painsByStage,
    peakStage:         gainsByStage[0]?.count > 0 ? gainsByStage[0] : null,
    peakStagePoints:   gainsByStage[0]?.points ?? [],
    gainsByStage,
    peakCount:         gains.length,
    painCount:         pains.length,
    stageSignals,
  }
}

function DesignTab({ points }: { points: JourneyPoint[] }) {
  const slim = slimPoints(points)
  const ins  = deriveDesignInsights(slim)

  // zoom: 0=full(7 stages), 1=4 stages, 2=2 stages
  const WINDOWS = [100, 57, 28]
  const [zoom, setZoom] = useState(0)
  const [pan, setPan]   = useState(0)
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const window = WINDOWS[zoom]
  const maxPan = 100 - window
  const xMin   = Math.min(pan, maxPan)
  const xMax   = xMin + window
  const labelMode: 'none' | 'key' | 'all' = zoom === 0 ? 'none' : zoom === 1 ? 'key' : 'all'

  function zoomIn()  { setZoom(z => Math.min(z + 1, 2)); setPan(p => Math.min(p, 100 - WINDOWS[Math.min(zoom + 1, 2)])) }
  function zoomOut() { setZoom(z => Math.max(z - 1, 0)); setPan(0) }
  function panLeft()  { setPan(p => Math.max(p - window * 0.4, 0)) }
  function panRight() { setPan(p => Math.min(p + window * 0.4, maxPan)) }

  const insightCards = [
    ins.bestMoment && {
      id: 'best',
      label: 'Best moment',
      value: ins.bestMoment.text.length > 55 ? ins.bestMoment.text.slice(0, 55) + '…' : ins.bestMoment.text,
      color: '#149238', bg: '#e6f4ea',
      detail: ins.bestMoment.text,
      stage: null as string | null,
      hasSuggestions: false,
    },
    ins.worstPain && {
      id: 'pain',
      label: 'Biggest pain',
      value: ins.worstPain.text.length > 55 ? ins.worstPain.text.slice(0, 55) + '…' : ins.worstPain.text,
      color: '#d2001f', bg: '#ffeaea',
      detail: ins.worstPain.text,
      stage: ins.worstPainStage,
      hasSuggestions: true,
    },
    ins.painStage && {
      id: 'painstage',
      label: 'Most painful stage',
      value: `${ins.painStage.stage} — ${ins.painStage.count} pain point${ins.painStage.count > 1 ? 's' : ''}`,
      color: '#ed6f2c', bg: '#fff3e8',
      detail: `${ins.painStage.stage} has the highest concentration of friction — ${ins.painStage.count} pain point${ins.painStage.count > 1 ? 's' : ''} identified.`,
      stage: ins.painStage.stage,
      hasSuggestions: true,
    },
    ins.peakStage && {
      id: 'peakstage',
      label: 'Strongest stage',
      value: `${ins.peakStage.stage} — ${ins.peakStage.count} peak moment${ins.peakStage.count > 1 ? 's' : ''}`,
      color: '#1c4f8f', bg: '#f0f6ff',
      detail: `${ins.peakStage.stage} has the highest concentration of positive moments — a model worth replicating.`,
      stage: ins.peakStage.stage,
      hasSuggestions: false,
    },
    {
      id: 'balance',
      label: 'Signal balance',
      value: `${ins.peakCount} peaks · ${ins.painCount} pain points`,
      color: '#47607d', bg: '#f5f7fa',
      detail: ins.peakCount > ins.painCount
        ? `${Math.round((ins.peakCount / (ins.peakCount + ins.painCount)) * 100)}% positive signals — the journey is broadly working, with targeted friction to address.`
        : `${Math.round((ins.painCount / (ins.peakCount + ins.painCount)) * 100)}% of signals are pain points — systemic improvements are needed across the journey.`,
      stage: null as string | null,
      hasSuggestions: false,
    },
  ].filter(Boolean) as { id: string; label: string; value: string; color: string; bg: string; detail: string; stage: string | null; hasSuggestions: boolean }[]

  const active = insightCards.find(c => c.id === activeCard) ?? null
  const stageSuggestions = active?.stage
    ? (STAGE_SUGGESTIONS[active.stage] ?? []).sort((a, b) => (b.impacts.nps ?? 0) - (a.impacts.nps ?? 0))
    : []

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '0.3rem 0.7rem', border: '1px solid #dde5ef', borderRadius: 6,
    background: disabled ? '#f5f7fa' : '#fff', color: disabled ? '#aaa' : '#111',
    fontWeight: 700, fontSize: '0.8rem', cursor: disabled ? 'default' : 'pointer',
  })

  return (
    <div>
      <div className="proposal-card">
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" style={{ flexGrow: s.weight }}>{s.name}</div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem 0' }}>
          <button style={btnStyle(zoom === 0)} disabled={zoom === 0} onClick={zoomOut}>−</button>
          <button style={btnStyle(zoom === 2)} disabled={zoom === 2} onClick={zoomIn}>+</button>
          {zoom > 0 && <>
            <button style={btnStyle(xMin <= 0)} disabled={xMin <= 0} onClick={panLeft}>←</button>
            <button style={btnStyle(xMin >= maxPan)} disabled={xMin >= maxPan} onClick={panRight}>→</button>
          </>}
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 4 }}>
            {zoom === 0 ? 'Full view — labels hidden' : zoom === 1 ? 'Mid zoom — key labels' : 'Zoomed — all labels'}
          </span>
        </div>

        <JourneyChart points={slim} stages={STAGES.map((s) => s.name)} xMin={xMin} xMax={xMax} showLabels={labelMode} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {insightCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
            style={{ flex: '1 1 160px', background: card.bg, border: `2px solid ${activeCard === card.id ? card.color : card.color + '33'}`, borderRadius: 12, padding: '0.85rem 1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{card.label}</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {active && (
        <div style={{ marginTop: '1rem', background: '#fff', border: `1px solid ${active.color}44`, borderRadius: 14, padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: active.color, marginBottom: 6 }}>{active.label}</div>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#2f3237', lineHeight: 1.6 }}>{active.detail}</p>

          {active.id === 'pain' && ins.worstPain && ins.worstPainStage && (() => {
            const metrics = STAGE_METRICS.find(m => m.stage === ins.worstPainStage)
            const stageAllPains = ins.painsByStage.find(s => s.stage === ins.worstPainStage)
            return (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Stage context — {ins.worstPainStage}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {[
                    { label: 'NPS', value: `${metrics && metrics.nps > 0 ? '+' : ''}${metrics?.nps ?? '—'}`, good: (metrics?.nps ?? 0) >= 10 },
                    { label: 'Conversion', value: `${metrics?.conversion ?? '—'}%`, good: (metrics?.conversion ?? 0) >= 70 },
                    { label: 'Drop-off', value: `${metrics?.dropOff ?? '—'}%`, good: (metrics?.dropOff ?? 100) <= 20 },
                    { label: 'Effort', value: `${metrics?.effort ?? '—'}/10`, good: (metrics?.effort ?? 10) <= 4 },
                    { label: 'Pain points', value: `${stageAllPains?.count ?? 1}`, good: false },
                  ].map(({ label, value, good }) => (
                    <div key={label} style={{ padding: '0.4rem 0.75rem', borderRadius: 8, background: good ? '#e6f4ea' : '#ffeaea', border: `1px solid ${good ? '#a3d9af' : '#f5b0b0'}` }}>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: good ? '#149238' : '#d2001f' }}>{value}</div>
                    </div>
                  ))}
                </div>
                {stageAllPains && stageAllPains.count > 1 && <>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>All pain points in this stage</div>
                  <div style={{ display: 'grid', gap: '0.35rem', marginBottom: '1rem' }}>
                    {stageAllPains.points.map((pt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '0.4rem 0.6rem', background: pt.text === ins.worstPain!.text ? '#ffeaea' : '#fafbfc', border: `1px solid ${pt.text === ins.worstPain!.text ? '#f5b0b0' : '#e2e8f0'}`, borderRadius: 8, fontSize: '0.82rem', color: '#2f3237' }}>
                        <span style={{ color: '#d2001f', fontWeight: 700, flexShrink: 0 }}>↓</span>
                        {pt.text}
                        {pt.text === ins.worstPain!.text && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, color: '#d2001f', flexShrink: 0 }}>Worst</span>}
                      </div>
                    ))}
                  </div>
                </>}
              </>
            )
          })()}

          {active.id === 'painstage' && ins.painStage && (() => {
            const metrics = STAGE_METRICS.find(m => m.stage === ins.painStage!.stage)
            const maxPains = ins.painsByStage[0]?.count || 1
            return (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Pain points by stage</div>
                <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem' }}>
                  {ins.painsByStage.filter(s => s.count > 0).map((s, i) => (
                    <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: 16, textAlign: 'right' }}>{i + 1}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: s.stage === ins.painStage!.stage ? 700 : 400, color: s.stage === ins.painStage!.stage ? '#d2001f' : '#2f3237', minWidth: 90 }}>{s.stage}</span>
                      <div style={{ flex: 1, height: 8, background: '#fde8e8', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(s.count / maxPains) * 100}%`, background: s.stage === ins.painStage!.stage ? '#d2001f' : '#e89090', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d2001f', width: 24, textAlign: 'right' }}>{s.count}</span>
                    </div>
                  ))}
                </div>

                {ins.painStagePoints.length > 0 && <>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>What's causing the friction</div>
                  <div style={{ display: 'grid', gap: '0.35rem', marginBottom: '1rem' }}>
                    {ins.painStagePoints.map((pt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '0.4rem 0.6rem', background: '#ffeaea', borderRadius: 8, fontSize: '0.82rem', color: '#7a1c1c' }}>
                        <span style={{ color: '#d2001f', fontWeight: 700, flexShrink: 0 }}>↓</span>
                        {pt.text}
                      </div>
                    ))}
                  </div>
                </>}

                {metrics && <>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Stage metrics</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'NPS', value: `${metrics.nps > 0 ? '+' : ''}${metrics.nps}`, good: metrics.nps >= 10 },
                      { label: 'Conversion', value: `${metrics.conversion}%`, good: metrics.conversion >= 70 },
                      { label: 'Drop-off', value: `${metrics.dropOff}%`, good: metrics.dropOff <= 20 },
                      { label: 'Effort', value: `${metrics.effort}/10`, good: metrics.effort <= 4 },
                    ].map(({ label, value, good }) => (
                      <div key={label} style={{ padding: '0.4rem 0.75rem', borderRadius: 8, background: good ? '#e6f4ea' : '#ffeaea', border: `1px solid ${good ? '#a3d9af' : '#f5b0b0'}` }}>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: good ? '#149238' : '#d2001f' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </>}
              </>
            )
          })()}

          {active.id === 'peakstage' && ins.peakStage && (() => {
            const metrics = STAGE_METRICS.find(m => m.stage === ins.peakStage!.stage)
            const maxPeaks = ins.gainsByStage[0]?.count || 1
            return (
              <>
                {/* Ranked stage comparison */}
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Peak moments by stage</div>
                <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem' }}>
                  {ins.gainsByStage.filter(s => s.count > 0).map((s, i) => (
                    <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', width: 16, textAlign: 'right' }}>{i + 1}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: s.stage === ins.peakStage!.stage ? 700 : 400, color: s.stage === ins.peakStage!.stage ? '#1c4f8f' : '#2f3237', minWidth: 90 }}>{s.stage}</span>
                      <div style={{ flex: 1, height: 8, background: '#e8f0fb', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(s.count / maxPeaks) * 100}%`, background: s.stage === ins.peakStage!.stage ? '#1c4f8f' : '#93b4e0', borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c4f8f', width: 24, textAlign: 'right' }}>{s.count}</span>
                    </div>
                  ))}
                </div>

                {/* What's driving the peaks */}
                {ins.peakStagePoints.length > 0 && <>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>What's driving this stage</div>
                  <div style={{ display: 'grid', gap: '0.35rem', marginBottom: '1rem' }}>
                    {ins.peakStagePoints.map((pt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '0.4rem 0.6rem', background: '#f0f6ff', borderRadius: 8, fontSize: '0.82rem', color: '#1c3a6e' }}>
                        <span style={{ color: '#149238', fontWeight: 700, flexShrink: 0 }}>↑</span>
                        {pt.text}
                      </div>
                    ))}
                  </div>
                </>}

                {/* Key metrics for this stage */}
                {metrics && <>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Stage metrics</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'NPS', value: `${metrics.nps > 0 ? '+' : ''}${metrics.nps}`, good: metrics.nps >= 10 },
                      { label: 'Conversion', value: `${metrics.conversion}%`, good: metrics.conversion >= 70 },
                      { label: 'Drop-off', value: `${metrics.dropOff}%`, good: metrics.dropOff <= 20 },
                      { label: 'Effort', value: `${metrics.effort}/10`, good: metrics.effort <= 4 },
                    ].map(({ label, value, good }) => (
                      <div key={label} style={{ padding: '0.4rem 0.75rem', borderRadius: 8, background: good ? '#e6f4ea' : '#ffeaea', border: `1px solid ${good ? '#a3d9af' : '#f5b0b0'}` }}>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: good ? '#149238' : '#d2001f' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </>}
              </>
            )
          })()}

          {active.id === 'balance' && (
            <>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Signal breakdown by stage</div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {ins.stageSignals.map(({ stage, gains: g, pains: p, net }) => {
                  const total = g + p || 1
                  const gainPct = Math.round((g / total) * 100)
                  const netPositive = net > 0
                  const netNeutral  = net === 0
                  return (
                    <div key={stage} style={{ background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111', minWidth: 100 }}>{stage}</span>
                        <span style={{ fontSize: '0.72rem', color: '#149238', fontWeight: 600 }}>↑ {g} peak{g !== 1 ? 's' : ''}</span>
                        <span style={{ fontSize: '0.72rem', color: '#d2001f', fontWeight: 600 }}>↓ {p} pain{p !== 1 ? 's' : ''}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: netPositive ? '#149238' : netNeutral ? '#94a3b8' : '#d2001f' }}>
                          {net > 0 ? '+' : ''}{net} net
                        </span>
                      </div>
                      {/* Gains/pains proportion bar */}
                      <div style={{ height: 6, background: '#ffeaea', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${gainPct}%`, background: '#149238', borderRadius: 999, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {active.hasSuggestions && stageSuggestions.length > 0 && (
            <>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Potential improvements</div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {stageSuggestions.map((s) => (
                  <div key={s.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fafbfc' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.83rem', color: '#111', marginBottom: 5 }}>{s.title}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ padding: '2px 7px', borderRadius: 999, background: s.horizon === 'T1' ? '#e6f4ea' : s.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: s.horizon === 'T1' ? '#149238' : s.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.69rem' }}>{s.horizon}</span>
                        <span style={{ padding: '2px 7px', borderRadius: 999, background: '#f5f7fa', color: '#47607d', fontSize: '0.69rem' }}>{s.team} · {s.storyPoints}sp</span>
                        {Object.entries(s.impacts).map(([k, v]) => {
                          if (v == null) return null
                          const good = ['dropOff','effort'].includes(k) ? v < 0 : v > 0
                          const lbl = k === 'nps' ? 'NPS' : k === 'csat' ? 'CSAT' : k === 'conversion' ? 'Conv.' : k === 'dropOff' ? 'Drop-off' : 'Effort'
                          return <span key={k} style={{ padding: '2px 7px', borderRadius: 999, background: good ? '#e6f4ea' : '#ffeaea', color: good ? '#149238' : '#d2001f', fontWeight: 700, fontSize: '0.69rem' }}>{v > 0 ? '+' : ''}{v} {lbl}</span>
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
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
  const t1 = BACKLOG_ITEMS.filter(b => b.horizon === 'T1')
  const t2 = BACKLOG_ITEMS.filter(b => b.horizon === 'T2')
  const t3 = BACKLOG_ITEMS.filter(b => b.horizon === 'T3')
  const totalSP  = BACKLOG_ITEMS.reduce((s, b) => s + b.storyPoints, 0)
  const t1SP     = t1.reduce((s, b) => s + b.storyPoints, 0)
  const mustHave = BACKLOG_ITEMS.filter(b => b.priority === 'must-have').length

  const t1Stages     = new Set(t1.map(b => b.stage))
  const coveredCount = CJM_STAGES.filter(s => t1Stages.has(s)).length

  // Negative-NPS stages with no T1 work — potential planning gap
  const painGaps = STAGE_METRICS
    .filter(m => m.nps < 0 && !t1Stages.has(m.stage))
    .sort((a, b) => a.nps - b.nps)
    .slice(0, 2)

  const coveredPainStage = STAGE_METRICS
    .filter(m => m.nps < 0 && t1Stages.has(m.stage))
    .sort((a, b) => a.nps - b.nps)[0] ?? null

  const topInvestStage = CJM_STAGES
    .map(stage => ({ stage, sp: t1.filter(b => b.stage === stage).reduce((s, b) => s + b.storyPoints, 0) }))
    .sort((a, b) => b.sp - a.sp)[0]

  const statBox = (label: string, value: string | number, sub?: string) => (
    <div style={{ padding: '0.55rem 0.85rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, minWidth: 80 }}>
      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 1 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* ── Insight header ── */}
      <div style={{ background: '#f8faff', border: '1px solid #c7d8f5', borderRadius: 14, padding: '1rem 1.1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1c4f8f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Roadmap snapshot</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {statBox('Committed (T1)', t1.length, `${t1SP} sp`)}
          {statBox('Pipeline (T2)', t2.length)}
          {statBox('Future (T3)', t3.length)}
          {statBox('Total SP', totalSP)}
          {statBox('Must-have', mustHave, 'items')}
          {statBox('Stage coverage', `${coveredCount}/7`, 'stages with T1')}
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {topInvestStage?.sp > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.55rem 0.75rem', background: '#e8f0fb', border: '1px solid #b3ccf0', borderRadius: 9, fontSize: '0.82rem', color: '#1c3a6e' }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>📌</span>
              <span><strong>{topInvestStage.stage}</strong> has the highest T1 investment — <strong>{topInvestStage.sp} SP</strong> committed. Verify delivery scope aligns with the customer pain points in this stage.</span>
            </div>
          )}
          {coveredPainStage && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.55rem 0.75rem', background: '#e6f4ea', border: '1px solid #a3d9af', borderRadius: 9, fontSize: '0.82rem', color: '#0e3d1f' }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>✅</span>
              <span><strong>{coveredPainStage.stage}</strong> has a negative NPS of <strong>{coveredPainStage.nps}</strong> and is covered by committed T1 work — good prioritisation signal.</span>
            </div>
          )}
          {painGaps.map(m => (
            <div key={m.stage} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.55rem 0.75rem', background: '#fff8ec', border: '1px solid #f7c948', borderRadius: 9, fontSize: '0.82rem', color: '#5a3e00' }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>⚠️</span>
              <span><strong>{m.stage}</strong> has a negative NPS of <strong>{m.nps}</strong> but no committed T1 work. Consider whether T2 items here are adequately prioritised relative to customer impact.</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.55rem 0.75rem', background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: '0.82rem', color: '#2f3237' }}>
            <span style={{ fontWeight: 700, flexShrink: 0 }}>ℹ️</span>
            <span>T1 covers <strong>{coveredCount} of 7</strong> journey stages. {coveredCount < 6 ? 'Some stages have no near-term commitment — confirm gaps are intentional or flag for re-prioritisation.' : 'Strong end-to-end coverage across the full journey.'}</span>
          </div>
        </div>
      </div>

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
