import { STAGES } from '../data/journeyData.ts'
import type { ProposalProps } from './types.ts'

const STAGE_COLORS: Record<string, string> = {
  Recognising: '#6366f1',
  Exploring:   '#0ea5e9',
  Choosing:    '#f59e0b',
  Committing:  '#ef4444',
  Receiving:   '#10b981',
  Integrating: '#8b5cf6',
  Living:      '#f97316',
}

const OPPORTUNITIES = [
  { id: 'o1',  text: 'Planning awareness & discoverability gap',          stage: 'Recognising', effort: 3, severity: 6, users: 560 },
  { id: 'o2',  text: 'No AI inspiration / Find My Fit yet',               stage: 'Recognising', effort: 5, severity: 7, users: 480 },
  { id: 'o3',  text: 'Room creation too technical — AI/scanning needed',  stage: 'Exploring',   effort: 6, severity: 8, users: 700 },
  { id: 'o4',  text: 'Visual inconsistency across planning tools',        stage: 'Exploring',   effort: 7, severity: 7, users: 820 },
  { id: 'o5',  text: 'System furniture missing from space planning',      stage: 'Choosing',    effort: 5, severity: 9, users: 940 },
  { id: 'o6',  text: 'Parallel 3D pipelines — inaccurate visuals',        stage: 'Choosing',    effort: 9, severity: 9, users: 1200 },
  { id: 'o7',  text: 'Kitchen Planner 3rd-party dependency',              stage: 'Choosing',    effort: 9, severity: 8, users: 680 },
  { id: 'o8',  text: 'Omnichannel design editing not available',          stage: 'Committing',  effort: 8, severity: 9, users: 880 },
  { id: 'o9',  text: 'HFK planning data not linked to fulfilment',        stage: 'Receiving',   effort: 5, severity: 6, users: 800 },
  { id: 'o10', text: 'Revit dependency for in-store design',              stage: 'Integrating', effort: 5, severity: 7, users: 600 },
  { id: 'o11', text: 'Unclear Ingka / Inter ownership boundaries',        stage: 'Living',      effort: 4, severity: 8, users: 500 },
  { id: 'o12', text: 'No shared taxonomy or architecture north star',     stage: 'Living',      effort: 4, severity: 7, users: 420 },
]

export function P6OpportunityMatrix(_props: ProposalProps) {
  const W = 580
  const H = 380
  const PAD = 52

  const plotW = W - PAD * 2
  const plotH = H - PAD * 2

  return (
    <div>
      <h2 className="proposal-title">P6 — Opportunity Matrix</h2>
      <p className="proposal-desc">
        Prioritises pain points by plotting them against two dimensions: implementation effort (x-axis) and customer severity (y-axis). Bubble size reflects the number of affected users. The top-left quadrant — high severity, low effort — reveals your quick wins. The top-right quadrant surfaces strategic bets worth the investment. Best for Roadmap and Business leaders who need to justify where to focus next.
      </p>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={W} height={H} style={{ flex: 'none', overflow: 'visible' }}>
          {/* Grid lines */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
            <g key={v}>
              <line x1={PAD + (v / 10) * plotW} y1={PAD} x2={PAD + (v / 10) * plotW} y2={H - PAD} stroke="#f0f4f8" strokeWidth={1} />
              <line x1={PAD} y1={PAD + (v / 10) * plotH} x2={W - PAD} y2={PAD + (v / 10) * plotH} stroke="#f0f4f8" strokeWidth={1} />
            </g>
          ))}
          {/* Quadrant dividers */}
          <line x1={PAD + plotW / 2} y1={PAD} x2={PAD + plotW / 2} y2={H - PAD} stroke="#cbd5e1" strokeDasharray="5 4" strokeWidth={1.5} />
          <line x1={PAD} y1={PAD + plotH / 2} x2={W - PAD} y2={PAD + plotH / 2} stroke="#cbd5e1" strokeDasharray="5 4" strokeWidth={1.5} />
          {/* Quadrant labels */}
          <text x={PAD + plotW * 0.26} y={PAD - 8} textAnchor="middle" fontSize={10} fill="#94a3b8" fontWeight="600">Quick wins</text>
          <text x={PAD + plotW * 0.76} y={PAD - 8} textAnchor="middle" fontSize={10} fill="#94a3b8" fontWeight="600">Strategic bets</text>
          <text x={PAD + plotW * 0.26} y={H - PAD + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">Low priority</text>
          <text x={PAD + plotW * 0.76} y={H - PAD + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">Hard calls</text>
          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#94a3b8" strokeWidth={1.5} />
          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#47607d" fontWeight="600">Effort →</text>
          <text x={13} y={H / 2} textAnchor="middle" fontSize={11} fill="#47607d" fontWeight="600" transform={`rotate(-90, 13, ${H / 2})`}>Severity →</text>
          {/* Bubbles */}
          {OPPORTUNITIES.map((o) => {
            const cx = PAD + ((o.effort - 1) / 9) * plotW
            const cy = H - PAD - ((o.severity - 1) / 9) * plotH
            const r = 9 + (o.users / 890) * 19
            const color = STAGE_COLORS[o.stage] ?? '#888'
            return (
              <g key={o.id}>
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.72} stroke={color} strokeWidth={1.5} />
                <title>{o.text}{'\n'}Stage: {o.stage}{'\n'}Effort: {o.effort}/10 · Severity: {o.severity}/10{'\n'}Affected users: {o.users}</title>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#47607d', marginBottom: 2 }}>Journey Stage</div>
          {STAGES.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 999, background: STAGE_COLORS[s.name], display: 'inline-block', flexShrink: 0 }} />
              {s.name}
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Bubble size ∝ affected users<br />Hover bubble for details
          </div>
        </div>
      </div>
    </div>
  )
}
