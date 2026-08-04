import { useMemo } from 'react'
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
import { STAGES, POWER_USER_POINTS, COWORKER_POINTS, pointColor } from '../data/journeyData.ts'
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

export function P7PersonaOverlay({ points }: ProposalProps) {
  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'Full Roadmap',
          data: points.map((p) => ({ x: p.x, y: 100 - p.y, text: p.text, sentiment: p.sentiment })),
          parsing: false as const,
          tension: 0.45,
          borderColor: '#1c4f8f',
          borderWidth: 2.5,
          pointRadius: 8,
          pointBackgroundColor: points.map((p) => pointColor(p.sentiment)),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: {
            target: 1,
            above: 'rgba(28,79,143,0.10)',
            below: 'rgba(20,146,56,0.10)',
          },
        },
        {
          label: 'Ingka-led',
          data: POWER_USER_POINTS.map((p) => ({ x: p.x, y: 100 - p.y, text: p.text, sentiment: p.sentiment })),
          parsing: false as const,
          tension: 0.45,
          borderColor: '#149238',
          borderWidth: 2.5,
          borderDash: [7, 4],
          pointRadius: 7,
          pointBackgroundColor: POWER_USER_POINTS.map((p) => pointColor(p.sentiment)),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: false,
        },
      ],
    }),
    [points],
  )

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
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
      legend: { display: true, position: 'bottom' as const },
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
            const p = ctx.datasetIndex === 0 ? points[ctx.dataIndex] : POWER_USER_POINTS[ctx.dataIndex]
            const persona = ctx.datasetIndex === 0 ? 'Full Roadmap' : 'Ingka-led'
            const icon = p?.sentiment === 'gain' ? '🟢' : p?.sentiment === 'risk' ? '🟠' : '🔴'
            return `${icon}  ${persona}`
          },
          label: (ctx: { datasetIndex: number; dataIndex: number }) => {
            const p = ctx.datasetIndex === 0 ? points[ctx.dataIndex] : POWER_USER_POINTS[ctx.dataIndex]
            return wrapText(p?.text ?? '')
          },
          labelColor: () => ({ borderColor: 'transparent', backgroundColor: 'transparent', borderWidth: 0, borderRadius: 0 }),
        },
      },
      datalabels: { display: false },
    },
  }

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
      <h2 className="proposal-title">Persona Overlay</h2>
      <p className="proposal-desc">
        Overlays two distinct emotional curves on the same chart — a first-time buyer (solid blue) and a returning customer (dashed green) — revealing where the experience diverges most. Shared pain points are universally important; divergence zones highlight where targeted improvements for one segment could unlock loyalty in the other. Feature toggles affect the first-time buyer curve, letting you show live how a feature closes the gap.
      </p>
      <div className="proposal-card">
        <div className="stage-header-row">
          {STAGES.map((s) => (
            <div key={s.name} className="stage-header-box" style={{ flexGrow: s.weight }}>{s.name}</div>
          ))}
        </div>
        <div style={{ height: 400, padding: '0.5rem 1rem 1rem' }}>
          <Line data={data} options={options} />
        </div>
        <div style={{ padding: '0 1rem 1rem', fontSize: '0.78rem', color: '#47607d', borderTop: '1px solid #f0f4f8', paddingTop: '0.75rem' }}>
          <strong>Key insight:</strong> Returning customers score significantly higher through Exploring and Choosing stages. The biggest gap is in Integrating — the new feature set helps close that. Solid line = first-time buyer; dashed = returning customer.
        </div>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#47607d', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Biggest experience gaps between customer and co-worker</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {divergences.slice(0, 4).map((d) => {
            const customerBetter = d.cwAvg > d.custAvg
            return (
              <div key={d.stage} style={{ flex: '1 1 160px', background: '#f7f9fb', borderRadius: 10, padding: '0.6rem 0.75rem', borderLeft: `3px solid ${d.diff > 15 ? '#d2001f' : d.diff > 8 ? '#ed6f2c' : '#149238'}` }}>
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
    </div>
  )
}
