import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import {
  STAGES,
  STAGE_METRICS,
  BACKLOG_ITEMS,
  COWORKER_POINTS,
  pointColor,
  type JourneyPoint,
} from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

// Compute proportional x-boundaries for each stage (0–100 scale)
function buildStageBounds() {
  const total = STAGES.reduce((s, st) => s + st.weight, 0)
  let acc = 0
  return STAGES.map((s) => {
    const start = (acc / total) * 100
    acc += s.weight
    const end = (acc / total) * 100
    return { name: s.name, weight: s.weight, start, end }
  })
}

const BOUNDS = buildStageBounds()

function stageOfPoint(p: JourneyPoint): string {
  for (const b of BOUNDS) {
    if (p.x >= b.start && p.x < b.end) return b.name
  }
  return BOUNDS[BOUNDS.length - 1].name
}

function npsColor(nps: number) {
  return nps >= 10 ? '#149238' : nps >= 0 ? '#ed6f2c' : '#d2001f'
}

type CurveId = 'customer' | 'coworker'
const CURVES: { id: CurveId; label: string; color: string; dash?: number[] }[] = [
  { id: 'customer', label: 'Customer', color: '#1c4f8f' },
  { id: 'coworker', label: 'Co-worker', color: '#e85d04', dash: [7, 4] },
]

function wrapText(text: string, maxLen = 52): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (line.length + word.length + 1 > maxLen && line.length > 0) {
      lines.push(line.trimEnd())
      line = ''
    }
    line += word + ' '
  }
  if (line.trimEnd()) lines.push(line.trimEnd())
  return lines
}

export function P11EmotionCurvePhases({ points }: ProposalProps) {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [visible, setVisible] = useState<Set<CurveId>>(new Set(['customer', 'coworker']))

  function toggle(id: CurveId) {
    setVisible((cur) => {
      const next = new Set(cur)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const custStagePts = useMemo(
    () => (activeStage && visible.has('customer') ? points.filter((p) => stageOfPoint(p) === activeStage) : []),
    [activeStage, points, visible],
  )
  const cwStagePts = useMemo(
    () => (activeStage && visible.has('coworker') ? COWORKER_POINTS.filter((p) => stageOfPoint(p) === activeStage) : []),
    [activeStage, visible],
  )
  const totalStageMoments = custStagePts.length + cwStagePts.length

  const stageBacklog = useMemo(
    () => (activeStage ? BACKLOG_ITEMS.filter((b) => b.stage === activeStage) : []),
    [activeStage],
  )
  const activeMetrics = STAGE_METRICS.find((m) => m.stage === activeStage)

  const chartData = useMemo(() => {
    const datasets = []
    if (visible.has('customer')) {
      datasets.push({
        label: 'Customer',
        data: points.map((p) => ({ x: p.x, y: 100 - p.y, text: p.text, sentiment: p.sentiment })),
        parsing: false as const,
        tension: 0.45,
        borderColor: '#1c4f8f',
        borderWidth: 2.5,
        pointRadius: points.map((p) => (!activeStage ? 8 : stageOfPoint(p) === activeStage ? 13 : 4)),
        pointBackgroundColor: points.map((p) =>
          !activeStage || stageOfPoint(p) === activeStage ? pointColor(p.sentiment) : '#d1d5db',
        ),
        pointBorderColor: points.map((p) =>
          !activeStage || stageOfPoint(p) === activeStage ? '#fff' : '#d1d5db',
        ),
        pointBorderWidth: 2,
        fill: false,
      })
    }
    if (visible.has('coworker')) {
      datasets.push({
        label: 'Co-worker',
        data: COWORKER_POINTS.map((p) => ({ x: p.x, y: 100 - p.y, text: p.text, sentiment: p.sentiment })),
        parsing: false as const,
        tension: 0.45,
        borderColor: '#e85d04',
        borderDash: [7, 4],
        borderWidth: 2.5,
        pointRadius: COWORKER_POINTS.map((p) => (!activeStage ? 8 : stageOfPoint(p) === activeStage ? 13 : 4)),
        pointBackgroundColor: COWORKER_POINTS.map((p) =>
          !activeStage || stageOfPoint(p) === activeStage ? pointColor(p.sentiment) : '#d1d5db',
        ),
        pointBorderColor: COWORKER_POINTS.map((p) =>
          !activeStage || stageOfPoint(p) === activeStage ? '#fff' : '#d1d5db',
        ),
        pointBorderWidth: 2,
        fill: false,
      })
    }
    return { datasets }
  }, [points, activeStage, visible])

  const highlightPlugin = useMemo(
    () => ({
      id: 'stageHighlight',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeDatasetsDraw(chart: any) {
        const bound = BOUNDS.find((b) => b.name === activeStage)
        if (!bound || !chart.chartArea) return
        const xMin = chart.scales.x.getPixelForValue(bound.start)
        const xMax = chart.scales.x.getPixelForValue(bound.end)
        chart.ctx.save()
        chart.ctx.fillStyle = 'rgba(255, 200, 0, 0.18)'
        chart.ctx.fillRect(xMin, chart.chartArea.top, xMax - xMin, chart.chartArea.height)
        chart.ctx.restore()
      },
    }),
    [activeStage],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      scales: {
        x: {
          type: 'linear' as const,
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: { display: false },
        },
        y: {
          min: 0,
          max: 100,
          afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
            axis.ticks = [{ value: 17 }, { value: 50 }, { value: 83 }]
          },
          grid: { color: '#f0f4f8' },
          ticks: {
            autoSkip: false,
            font: { weight: 'bold' as const },
            callback: (v: string | number) => {
              if (v === 83) return 'Exceed expectations'
              if (v === 50) return 'Meet expectations'
              if (v === 17) return 'Hygiene factors'
              return ''
            },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          titleColor: '#111',
          bodyColor: '#47607d',
          padding: 12,
          boxPadding: 4,
          callbacks: {
            title: (items: { datasetIndex: number; dataIndex: number }[]) => {
              const ctx = items[0]
              if (!ctx) return ''
              const isCoworker = ctx.datasetIndex === (visible.has('customer') ? 1 : 0) && visible.has('coworker')
              const src = isCoworker ? COWORKER_POINTS : points
              const p = src[ctx.dataIndex]
              const persona = isCoworker ? 'Co-worker' : 'Customer'
              const icon = p?.sentiment === 'gain' ? '\ud83d\udfe2' : p?.sentiment === 'risk' ? '\ud83d\udfe0' : '\ud83d\udd34'
              return `${icon}  ${persona}`
            },
            label: (ctx: { datasetIndex: number; dataIndex: number }) => {
              const isCoworker = ctx.datasetIndex === (visible.has('customer') ? 1 : 0) && visible.has('coworker')
              const src = isCoworker ? COWORKER_POINTS : points
              return wrapText(src[ctx.dataIndex]?.text ?? '')
            },
            labelColor: () => ({ borderColor: 'transparent', backgroundColor: 'transparent', borderWidth: 0, borderRadius: 0 }),
          },
        },
        datalabels: { display: false },
      },
    }),
    [points, visible],
  )

  return (
    <div>
      <h2 className="proposal-title">P11 — Emotion Curve with Phase Filters</h2>
      <p className="proposal-desc">
        Overlays both the customer and co-worker journeys with interactive stage filters. Click any phase to highlight its moments on both curves with a yellow band and reveal a detail panel with moments, sentiment, KPIs, and linked backlog items. Use the pills to isolate each perspective. Feature toggles affect the customer curve only.
      </p>

      <div className="proposal-card">
        {/* Stage filter buttons */}
        <div style={{ display: 'flex', gap: 6, padding: '0.9rem 1rem 0' }}>
          <button
            type="button"
            onClick={() => setActiveStage(null)}
            style={{
              flexShrink: 0,
              background: activeStage === null ? '#ffc800' : '#111',
              color: activeStage === null ? '#111' : '#fff',
              border: 'none',
              borderRadius: 3,
              fontWeight: 700,
              padding: '0.55rem 0.75rem',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            All
          </button>
          {STAGES.map((s) => {
            const isActive = activeStage === s.name
            const hasPoints = points.some((p) => stageOfPoint(p) === s.name)
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveStage(isActive ? null : s.name)}
                style={{
                  flexGrow: s.weight,
                  background: isActive ? '#ffc800' : '#111',
                  color: isActive ? '#111' : hasPoints ? '#fff' : '#888',
                  border: 'none',
                  borderRadius: 3,
                  textAlign: 'center',
                  fontWeight: 700,
                  padding: '0.55rem 0.25rem',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {s.name}
              </button>
            )
          })}
        </div>

        {/* Curve toggle pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0.65rem 1rem 0', alignItems: 'center' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#47607d', marginRight: 4 }}>Show:</span>
          {CURVES.map((c) => {
            const on = visible.has(c.id)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '0.3rem 0.85rem',
                  border: `2px solid ${c.color}`,
                  borderRadius: 999,
                  background: on ? c.color : '#fff',
                  color: on ? '#fff' : c.color,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {c.dash && (
                  <svg width="18" height="4" style={{ display: 'block' }}>
                    <line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5,3" />
                  </svg>
                )}
                {!c.dash && (
                  <svg width="18" height="4" style={{ display: 'block' }}>
                    <line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                )}
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Contextual hint */}
        <div style={{ padding: '0.35rem 1rem 0', fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>
          {activeStage
            ? `${totalStageMoments} moment${totalStageMoments !== 1 ? 's' : ''} in ${activeStage} — click a stage or All to change`
            : 'All stages shown — click a stage to filter'}
        </div>

        {/* Chart */}
        <div style={{ height: 380, padding: '0.25rem 1rem 1rem' }}>
          <Line data={chartData} options={options} plugins={[highlightPlugin]} />
        </div>
      </div>

      {/* Detail panel — always visible */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

        {activeStage ? (
          <>
            {/* Left: moments for active stage, grouped by curve */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                Moments in {activeStage}
                {activeMetrics && (
                  <span style={{ padding: '2px 8px', borderRadius: 999, background: npsColor(activeMetrics.nps), color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>
                    NPS {activeMetrics.nps > 0 ? '+' : ''}{activeMetrics.nps}
                  </span>
                )}
              </div>

              {totalStageMoments === 0 && (
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>No mapped moments in this stage yet.</p>
              )}

              {custStagePts.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c4f8f', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Customer</div>
                  {custStagePts.map((p) => (
                    <div key={p.id} style={{ display: 'flex', gap: 8, padding: '0.4rem 0', borderBottom: '1px solid #f0f4f8', alignItems: 'flex-start' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: pointColor(p.sentiment), flexShrink: 0, marginTop: 4 }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>{p.text}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2, textTransform: 'capitalize' }}>{p.sentiment} · {100 - p.y}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cwStagePts.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e85d04', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Co-worker</div>
                  {cwStagePts.map((p) => (
                    <div key={p.id} style={{ display: 'flex', gap: 8, padding: '0.4rem 0', borderBottom: '1px solid #f0f4f8', alignItems: 'flex-start' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: pointColor(p.sentiment), flexShrink: 0, marginTop: 4 }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>{p.text}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2, textTransform: 'capitalize' }}>{p.sentiment} · {100 - p.y}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: KPI mini-cards + backlog */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeMetrics && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                  {[
                    { label: 'NPS', value: `${activeMetrics.nps > 0 ? '+' : ''}${activeMetrics.nps}`, color: npsColor(activeMetrics.nps) },
                    { label: 'Conv.', value: `${activeMetrics.conversion}%`, color: '#1c4f8f' },
                    { label: 'Drop', value: `${activeMetrics.dropOff}%`, color: '#d2001f' },
                    { label: 'Effort', value: `${activeMetrics.effort}/10`, color: '#ed6f2c' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: '#f7f9fb', borderRadius: 8, padding: '0.45rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 6 }}>Backlog</div>
                {stageBacklog.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>No backlog items for this stage.</p>
                ) : (
                  stageBacklog.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.35rem 0', borderBottom: '1px solid #f0f4f8', fontSize: '0.82rem' }}>
                      <span style={{ padding: '2px 7px', borderRadius: 999, background: item.horizon === 'T1' ? '#e6f4ea' : item.horizon === 'T2' ? '#fff3e8' : '#f0f4f8', color: item.horizon === 'T1' ? '#149238' : item.horizon === 'T2' ? '#ed6f2c' : '#666', fontWeight: 700, fontSize: '0.68rem' }}>
                        {item.horizon}
                      </span>
                      <span style={{ flex: 1 }}>{item.title}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{item.storyPoints}sp · {item.team}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left: all moments grouped by stage, split by curve */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 10 }}>All Moments</div>
              {STAGES.map((s) => {
                const custPts = visible.has('customer') ? points.filter((p) => stageOfPoint(p) === s.name) : []
                const cwPts = visible.has('coworker') ? COWORKER_POINTS.filter((p) => stageOfPoint(p) === s.name) : []
                if (custPts.length === 0 && cwPts.length === 0) return null
                const sm = STAGE_METRICS.find((m) => m.stage === s.name)
                return (
                  <div key={s.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1c4f8f', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.name}</span>
                      {sm && (
                        <span style={{ padding: '1px 6px', borderRadius: 999, background: npsColor(sm.nps), color: '#fff', fontSize: '0.67rem', fontWeight: 700 }}>
                          NPS {sm.nps > 0 ? '+' : ''}{sm.nps}
                        </span>
                      )}
                    </div>
                    {custPts.length > 0 && (
                      <>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1c4f8f', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 2, opacity: 0.7 }}>Customer</div>
                        {custPts.map((p) => (
                          <div key={p.id} style={{ display: 'flex', gap: 7, padding: '0.3rem 0', borderBottom: '1px solid #f0f4f8', alignItems: 'flex-start' }}>
                            <span style={{ width: 9, height: 9, borderRadius: 999, background: pointColor(p.sentiment), flexShrink: 0, marginTop: 4 }} />
                            <div>
                              <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{p.text}</div>
                              <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginTop: 1, textTransform: 'capitalize' }}>{p.sentiment}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {cwPts.length > 0 && (
                      <>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e85d04', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 2, marginTop: custPts.length > 0 ? 6 : 0, opacity: 0.85 }}>Co-worker</div>
                        {cwPts.map((p) => (
                          <div key={p.id} style={{ display: 'flex', gap: 7, padding: '0.3rem 0', borderBottom: '1px solid #f0f4f8', alignItems: 'flex-start' }}>
                            <span style={{ width: 9, height: 9, borderRadius: 999, background: pointColor(p.sentiment), flexShrink: 0, marginTop: 4 }} />
                            <div>
                              <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{p.text}</div>
                              <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginTop: 1, textTransform: 'capitalize' }}>{p.sentiment}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right: all backlog grouped by horizon */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>All Backlog Items</div>
              {(['T1', 'T2', 'T3'] as const).map((horizon) => {
                const items = BACKLOG_ITEMS.filter((b) => b.horizon === horizon)
                const horizonLabel = horizon === 'T1' ? 'T1 — Now' : horizon === 'T2' ? 'T2 — Near' : 'T3 — Future'
                const horizonColor = horizon === 'T1' ? '#149238' : horizon === 'T2' ? '#ed6f2c' : '#666'
                const horizonBg = horizon === 'T1' ? '#e6f4ea' : horizon === 'T2' ? '#fff3e8' : '#f0f4f8'
                return (
                  <div key={horizon}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: horizonColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5, background: horizonBg, display: 'inline-block', padding: '2px 8px', borderRadius: 6 }}>{horizonLabel}</div>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.32rem 0', borderBottom: '1px solid #f0f4f8', fontSize: '0.81rem' }}>
                        <span style={{ flex: 1 }}>{item.title}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{item.stage} · {item.storyPoints}sp</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
