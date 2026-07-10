import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { STAGES, COWORKER_POINTS, pointColor } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

type CurveId = 'customer' | 'coworker'

const CURVES: { id: CurveId; label: string; color: string; dash?: number[] }[] = [
  { id: 'customer', label: 'Customer', color: '#1c4f8f' },
  { id: 'coworker', label: 'Co-worker', color: '#e85d04', dash: [7, 4] },
]

export function P12CoworkerOverlay({ points, onStageClick }: ProposalProps) {
  const [visible, setVisible] = useState<Set<CurveId>>(new Set(['customer', 'coworker']))

  function toggle(id: CurveId) {
    setVisible((cur) => {
      const next = new Set(cur)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id) // keep at least one visible
      } else {
        next.add(id)
      }
      return next
    })
  }

  const data = useMemo(() => {
    const datasets = []

    if (visible.has('customer')) {
      datasets.push({
        label: 'Customer',
        data: points.map((p) => ({ x: p.x, y: 100 - p.y, text: p.text, sentiment: p.sentiment })),
        parsing: false as const,
        tension: 0.45,
        borderColor: '#1c4f8f',
        borderWidth: 2.5,
        pointRadius: 8,
        pointBackgroundColor: points.map((p) => pointColor(p.sentiment)),
        pointBorderColor: '#fff',
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
        borderWidth: 2.5,
        borderDash: [7, 4],
        pointRadius: 8,
        pointBackgroundColor: COWORKER_POINTS.map((p) => pointColor(p.sentiment)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        fill: false,
      })
    }

    return { datasets }
  }, [points, visible])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
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
            const icon = p?.sentiment === 'gain' ? '🟢' : p?.sentiment === 'risk' ? '🟠' : '🔴'
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
  }

  // Divergence analysis: stages where the two curves are furthest apart
  const divergences = STAGES.map((s, si) => {
    const start = (si / STAGES.length) * 100
    const end = ((si + 1) / STAGES.length) * 100
    const custPts = points.filter((p) => p.x >= start && p.x < end)
    const cwPts = COWORKER_POINTS.filter((p) => p.x >= start && p.x < end)
    const custAvg = custPts.length ? custPts.reduce((a, p) => a + p.y, 0) / custPts.length : 50
    const cwAvg = cwPts.length ? cwPts.reduce((a, p) => a + p.y, 0) / cwPts.length : 50
    return { stage: s.name, diff: Math.round(Math.abs(custAvg - cwAvg)), custAvg, cwAvg }
  }).sort((a, b) => b.diff - a.diff)

  return (
    <div>
      <h2 className="proposal-title">P12 — Customer & Co-worker Overlay</h2>
      <p className="proposal-desc">
        Overlays the emotional journey of the customer against the experience of the IKEA co-worker supporting them through the same stages. Where the curves diverge, there is a misalignment between what the customer feels and what the co-worker is able to deliver. Convergence zones reveal where tooling and processes are well-matched. Use the pills to isolate each perspective. Feature toggles affect the customer curve only.
      </p>

      <div className="proposal-card">
        {/* Stage headers */}
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" onClick={() => onStageClick?.(s.name)} style={{ flexGrow: s.weight, cursor: 'pointer' }}>{s.name}</div>
          ))}
        </div>

        {/* Curve toggle pills */}
        <div style={{ display: 'flex', gap: 8, padding: '0.75rem 1rem 0', alignItems: 'center' }}>
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
                <span style={{
                  display: 'inline-block',
                  width: 20,
                  height: 3,
                  background: on ? '#fff' : c.color,
                  borderRadius: 2,
                  ...(c.dash ? { backgroundImage: `repeating-linear-gradient(to right, ${on ? '#fff' : c.color} 0px, ${on ? '#fff' : c.color} 5px, transparent 5px, transparent 9px)`, background: 'none' } : {}),
                }} />
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Chart */}
        <div style={{ height: 400, padding: '0.25rem 1rem 1rem' }}>
          <Line data={data} options={options} />
        </div>

        {/* Divergence insight panel */}
        {visible.has('customer') && visible.has('coworker') && (
          <div style={{ borderTop: '1px solid #f0f4f8', padding: '0.85rem 1rem 1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#47607d', marginBottom: 8 }}>
              Biggest experience gaps between customer and co-worker
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {divergences.slice(0, 4).map((d) => {
                const customerBetter = d.cwAvg > d.custAvg // higher y = worse
                return (
                  <div
                    key={d.stage}
                    style={{ flex: '1 1 160px', background: '#f7f9fb', borderRadius: 10, padding: '0.6rem 0.75rem', borderLeft: `3px solid ${d.diff > 15 ? '#d2001f' : d.diff > 8 ? '#ed6f2c' : '#149238'}` }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 4 }}>{d.stage}</div>
                    <div style={{ fontSize: '0.75rem', color: '#47607d' }}>Gap: <strong>{d.diff} pts</strong></div>
                    <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 3 }}>
                      {customerBetter
                        ? 'Co-worker friction is higher — tooling may be holding them back'
                        : 'Customer friction is higher — service experience needs more support'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
