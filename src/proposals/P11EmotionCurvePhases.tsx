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

export function P11EmotionCurvePhases({ points }: ProposalProps) {
  const [activeStage, setActiveStage] = useState<string | null>(null)

  const stagePoints = useMemo(
    () => (activeStage ? points.filter((p) => stageOfPoint(p) === activeStage) : []),
    [activeStage, points],
  )
  const stageBacklog = useMemo(
    () => (activeStage ? BACKLOG_ITEMS.filter((b) => b.stage === activeStage) : []),
    [activeStage],
  )
  const activeMetrics = STAGE_METRICS.find((m) => m.stage === activeStage)

  // Per-point styling: highlight active stage, dim others
  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: points.map((p) => ({ x: p.x, y: 100 - p.y })),
          parsing: false as const,
          tension: 0.45,
          borderColor: '#1c4f8f',
          borderWidth: 2.5,
          pointRadius: points.map((p) =>
            !activeStage ? 8 : stageOfPoint(p) === activeStage ? 13 : 4,
          ),
          pointBackgroundColor: points.map((p) =>
            !activeStage || stageOfPoint(p) === activeStage ? pointColor(p.sentiment) : '#d1d5db',
          ),
          pointBorderColor: points.map((p) =>
            !activeStage || stageOfPoint(p) === activeStage ? '#fff' : '#d1d5db',
          ),
          pointBorderWidth: 2,
          fill: false,
        },
      ],
    }),
    [points, activeStage],
  )

  // Inline plugin to draw a yellow highlight band behind the active stage
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
          callbacks: {
            label: (ctx: { dataIndex: number }) => points[ctx.dataIndex]?.text ?? '',
          },
        },
        datalabels: { display: false },
      },
    }),
    [points],
  )

  return (
    <div>
      <h2 className="proposal-title">P11 — Emotion Curve with Phase Filters</h2>
      <p className="proposal-desc">
        Same emotional journey as P1, but with stage headers as interactive filters. Click any phase to highlight its data points on the curve with a yellow background band, and reveal a detail panel showing that stage's moments, sentiment, NPS, conversion, effort, and linked backlog items. Ideal for deep-dive workshops: an Engineering Manager can focus on Choosing while a CRM team zooms in on Living — without switching views.
      </p>

      <div className="proposal-card">
        {/* Clickable stage header buttons */}
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

        {/* Contextual hint */}
        <div style={{ padding: '0.35rem 1rem 0', fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>
          {activeStage
            ? `${stagePoints.length} moment${stagePoints.length !== 1 ? 's' : ''} in ${activeStage} — click a stage or All to change`
            : 'All stages shown — click a stage to filter'}
        </div>

        {/* Chart */}
        <div style={{ height: 380, padding: '0.25rem 1rem 1rem' }}>
          <Line data={chartData} options={options} plugins={[highlightPlugin]} />
        </div>
      </div>

      {/* Detail panel — only shown when a stage is active */}
      {activeStage && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

          {/* Left: moments in this stage */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              Moments in {activeStage}
              {activeMetrics && (
                <span style={{ padding: '2px 8px', borderRadius: 999, background: npsColor(activeMetrics.nps), color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>
                  NPS {activeMetrics.nps > 0 ? '+' : ''}{activeMetrics.nps}
                </span>
              )}
            </div>
            {stagePoints.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>No mapped moments in this stage yet.</p>
            ) : (
              stagePoints.map((p) => (
                <div key={p.id} style={{ display: 'flex', gap: 8, padding: '0.45rem 0', borderBottom: '1px solid #f0f4f8', alignItems: 'flex-start' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: pointColor(p.sentiment), flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>{p.text}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2, textTransform: 'capitalize' }}>
                      {p.sentiment} · satisfaction {100 - p.y}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: backlog + KPI mini-cards */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* KPI mini row */}
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

            {/* Backlog */}
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
        </div>
      )}
    </div>
  )
}
