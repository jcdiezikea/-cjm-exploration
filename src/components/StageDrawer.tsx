import { useState } from 'react'
import { STAGE_METRICS, BACKLOG_ITEMS, type StageMetrics, cjmOf } from '../data/journeyData.ts'
import { ALL_ACTIVITIES } from '../data/roadmapData.ts'

function generateSummary(metrics: StageMetrics, actCount: number): string {
  const feel = metrics.nps > 20 ? 'a strong positive' : metrics.nps > 0 ? 'a moderate' : 'a challenging'
  const npsStr = `${metrics.nps > 0 ? '+' : ''}${metrics.nps}`
  const delivery =
    metrics.conversion === 100
      ? 'All activities are prioritised for delivery'
      : metrics.conversion > 50
        ? `${metrics.conversion}% of activities are prioritised`
        : 'Most activities are still pending prioritisation'
  return `${metrics.stage} is ${feel} stage with ${actCount} activit${actCount === 1 ? 'y' : 'ies'} and an effort score of ${metrics.effort}/10 (NPS ${npsStr}). ${delivery}.`
}

const EFFORT_COLORS: Record<string, string> = { S: '#10b981', M: '#3b82f6', L: '#f59e0b', XL: '#ef4444' }
const IMPACT_COLORS: Record<string, string> = { High: '#149238', Med: '#ed6f2c', Low: '#d2001f' }
const HORIZON_COLORS: Record<string, string> = { T1: '#1c4f8f', T2: '#f59e0b', T3: '#94a3b8' }

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
      padding: '1px 6px', borderRadius: 999, marginRight: 3,
      background: color + '22', color, border: `1px solid ${color}55`,
    }}>
      {label}
    </span>
  )
}

type Props = { stageName: string | null; onClose: () => void }

export function StageDrawer({ stageName, onClose }: Props) {
  const [activitiesOpen, setActivitiesOpen] = useState(true)
  const [backlogOpen, setBacklogOpen] = useState(true)

  const isOpen = stageName !== null
  const metrics = STAGE_METRICS.find((m) => m.stage === stageName) ?? null
  const activities = stageName ? ALL_ACTIVITIES.filter((a) => cjmOf(a) === stageName) : []
  const backlog = stageName ? BACKLOG_ITEMS.filter((b) => b.stage === stageName) : []
  const t1 = backlog.filter((b) => b.horizon === 'T1')
  const t2 = backlog.filter((b) => b.horizon === 'T2')
  const t3 = backlog.filter((b) => b.horizon === 'T3')

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.25)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: 360,
        background: '#fff', zIndex: 50,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        transform: isOpen ? 'translateX(0)' : 'translateX(360px)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {stageName && metrics && (
          <>
            {/* Header */}
            <div style={{ background: '#111', color: '#fff', padding: '1rem 1.1rem 0.9rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: 3 }}>Stage context</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>{stageName}</div>
                </div>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: '1px solid #444', color: '#ccc', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: '0.8rem', marginTop: 2 }}
                >
                  ✕
                </button>
              </div>

              {/* Metric chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {[
                  { label: `NPS ${metrics.nps > 0 ? '+' : ''}${metrics.nps}`, color: metrics.nps >= 0 ? '#4ade80' : '#f87171' },
                  { label: `Conv ${metrics.conversion}%`, color: '#60a5fa' },
                  { label: `Drop ${metrics.dropOff}%`, color: metrics.dropOff > 50 ? '#f87171' : '#94a3b8' },
                  { label: `Effort ${metrics.effort}/10`, color: '#fbbf24' },
                ].map((chip) => (
                  <span key={chip.label} style={{
                    fontSize: '0.68rem', fontWeight: 700,
                    padding: '2px 9px', borderRadius: 999,
                    background: chip.color + '22', color: chip.color,
                    border: `1px solid ${chip.color}55`,
                  }}>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: '0.85rem 1.1rem', borderBottom: '1px solid var(--line)', background: '#fafbfc' }}>
              <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--muted)', lineHeight: 1.55 }}>
                {generateSummary(metrics, activities.length)}
              </p>
            </div>

            {/* Activities section */}
            <div style={{ borderBottom: '1px solid var(--line)' }}>
              <button
                onClick={() => setActivitiesOpen((o) => !o)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.65rem 1.1rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.75rem', color: 'var(--text)',
                }}
              >
                <span>Activities ({activities.length})</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.65rem' }}>{activitiesOpen ? '▲' : '▼'}</span>
              </button>
              {activitiesOpen && (
                <div style={{ padding: '0 1.1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activities.map((a) => (
                    <div key={a.id} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem 0.7rem', border: '1px solid var(--line)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.35 }}>
                        {a.title}
                      </div>
                      <div>
                        <Chip label={`${a.effort} effort`} color={EFFORT_COLORS[a.effort] ?? '#888'} />
                        <Chip label={a.impact} color={IMPACT_COLORS[a.impact] ?? '#888'} />
                        <Chip label={a.objectiveName} color="#6366f1" />
                        {a.priority && <Chip label="✓ priority" color="#149238" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Backlog section */}
            <div>
              <button
                onClick={() => setBacklogOpen((o) => !o)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.65rem 1.1rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.75rem', color: 'var(--text)',
                }}
              >
                <span>Backlog ({backlog.length} items)</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.65rem' }}>{backlogOpen ? '▲' : '▼'}</span>
              </button>
              {backlogOpen && (
                <div style={{ padding: '0 1.1rem 1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[{ label: 'T1 — Now', items: t1, color: HORIZON_COLORS.T1 },
                    { label: 'T2 — Next', items: t2, color: HORIZON_COLORS.T2 },
                    { label: 'T3 — Later', items: t3, color: HORIZON_COLORS.T3 }]
                    .filter((g) => g.items.length > 0)
                    .map((group) => (
                      <div key={group.label}>
                        <div style={{ fontSize: '0.63rem', fontWeight: 700, color: group.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {group.label}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {group.items.map((item) => (
                            <div key={item.id} style={{ fontSize: '0.7rem', color: 'var(--text)', lineHeight: 1.35, padding: '0.35rem 0.6rem', background: group.color + '10', borderLeft: `3px solid ${group.color}`, borderRadius: '0 6px 6px 0' }}>
                              {item.title}
                              <span style={{ color: 'var(--muted)', fontSize: '0.62rem', display: 'block' }}>{item.team} · {item.storyPoints}sp</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  {backlog.length === 0 && (
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted)' }}>No backlog items for this stage.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
