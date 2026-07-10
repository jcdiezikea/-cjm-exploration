import { useState } from 'react'
import { STAGES, STAGE_METRICS, BACKLOG_ITEMS } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

type MetricKey = 'nps' | 'conversion' | 'dropOff' | 'effort'

const METRICS: { key: MetricKey; label: string; unit: string; invert: boolean; max: number }[] = [
  { key: 'nps', label: 'NPS', unit: '', invert: false, max: 100 },
  { key: 'conversion', label: 'Conversion', unit: '%', invert: false, max: 100 },
  { key: 'dropOff', label: 'Drop-off', unit: '%', invert: true, max: 100 },
  { key: 'effort', label: 'Effort score', unit: '/10', invert: true, max: 10 },
]

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lerpColor(t: number, hexA: string, hexB: string): string {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bv = Math.round(a.b + (b.b - a.b) * t)
  return `rgb(${r},${g},${bv})`
}

function cellColor(value: number, min: number, max: number, invert: boolean): string {
  const t = (value - min) / (max - min || 1)
  const bad = invert ? t : 1 - t
  return lerpColor(bad, '#e6f4ea', '#ffeaea')
}

export function P10Heatmap({ onStageClick }: ProposalProps) {
  const [sel, setSel] = useState<{ stage: string; metric: MetricKey } | null>(null)

  return (
    <div>
      <h2 className="proposal-title">P10 — Satisfaction Heatmap</h2>
      <p className="proposal-desc">
        Compresses all key metrics into a single colour-coded grid — green cells are healthy, red cells demand attention. The matrix makes cross-stage, cross-metric comparisons instantaneous: you can see at a glance that Choosing has both the worst NPS and the highest drop-off, or that Receiving is the only stage consistently in the green. Clicking any cell drills into the backlog items that address that stage, bridging insight directly to action.
      </p>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 145, background: '#111', color: '#fff', padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', position: 'sticky', left: 0, zIndex: 2 }}>Metric</th>
              {STAGES.map((s) => (
                <th key={s.name} onClick={() => onStageClick?.(s.name)} style={{ background: '#111', color: '#fff', padding: '0.6rem', textAlign: 'center', fontSize: '0.8rem', borderLeft: '1px solid #333', minWidth: 120, cursor: 'pointer' }}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m) => {
              const values = STAGE_METRICS.map((sm) => sm[m.key] as number)
              const min = Math.min(...values)
              const max = Math.max(...values)
              return (
                <tr key={m.key}>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, fontSize: '0.8rem', color: '#47607d', background: '#f5f7fa', borderRight: '1px solid #e2e8f0', position: 'sticky', left: 0, zIndex: 1 }}>
                    {m.label}
                  </td>
                  {STAGE_METRICS.map((sm) => {
                    const val = sm[m.key] as number
                    const bg = cellColor(val, min, max, m.invert)
                    const isSelected = sel?.stage === sm.stage && sel?.metric === m.key
                    return (
                      <td
                        key={sm.stage}
                        onClick={() => setSel(isSelected ? null : { stage: sm.stage, metric: m.key })}
                        style={{ padding: '0.85rem 0.5rem', textAlign: 'center', borderLeft: '1px solid #e2e8f0', background: bg, cursor: 'pointer', outline: isSelected ? '2px solid #1c4f8f' : 'none', outlineOffset: -2, transition: 'outline 0.1s' }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>
                          {m.key === 'nps' && val > 0 ? '+' : ''}{val}{m.unit}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: 14, borderTop: '1px solid #f0f4f8', alignItems: 'center', fontSize: '0.74rem', color: '#47607d' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 3, background: '#e6f4ea', border: '1px solid #ccc', display: 'inline-block' }} />Good</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 14, borderRadius: 3, background: '#ffeaea', border: '1px solid #ccc', display: 'inline-block' }} />Needs attention</span>
        </div>
      </div>

      {sel && (
        <div style={{ marginTop: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>
            Backlog for <strong>{sel.stage}</strong> — improving <strong>{METRICS.find((m) => m.key === sel.metric)?.label}</strong>
          </div>
          {BACKLOG_ITEMS.filter((b) => b.stage === sel.stage).length === 0 && (
            <p style={{ color: '#47607d', margin: 0, fontSize: '0.84rem' }}>No backlog items for this stage.</p>
          )}
          {BACKLOG_ITEMS.filter((b) => b.stage === sel.stage).map((item) => (
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
