import { useState } from 'react'
import { STAGE_METRICS, STAGES, BACKLOG_ITEMS, FEATURES, cjmOf } from '../data/journeyData.ts'
import { ALL_ACTIVITIES } from '../data/roadmapData.ts'

type InsightCard = {
  icon: string
  title: string
  metric: string
  body: string
  urgent: boolean
}

function computeInsights(): InsightCard[] {
  // 1 — Most at-risk stage (lowest NPS)
  const atRisk = [...STAGE_METRICS].sort((a, b) => a.nps - b.nps)[0]
  const npsStr = `${atRisk.nps > 0 ? '+' : ''}${atRisk.nps}`

  // 2 — Quick win: High-impact activity with S or M effort
  const quickWinAct = ALL_ACTIVITIES.find(
    (a) => a.impact === 'High' && (a.effort === 'S' || a.effort === 'M'),
  )
  const quickWinStage = quickWinAct ? cjmOf(quickWinAct) : null

  // 3 — Horizon balance
  const t1 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T1').length
  const t2 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T2').length
  const t3 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T3').length
  const total = BACKLOG_ITEMS.length
  const t1Pct = Math.round((t1 / total) * 100)

  // 4 — Coverage gap: stage(s) with fewest activities
  const minWeight = Math.min(...STAGES.map((s) => s.weight))
  const maxWeight = Math.max(...STAGES.map((s) => s.weight))
  const gapNames = STAGES.filter((s) => s.weight === minWeight).map((s) => s.name)
  const richName = STAGES.find((s) => s.weight === maxWeight)?.name ?? ''

  // 5 — Most impactful feature toggle
  const topFeature = [...FEATURES].sort(
    (a, b) => Object.keys(b.pointChanges).length - Object.keys(a.pointChanges).length,
  )[0]
  const topCount = Object.keys(topFeature.pointChanges).length

  return [
    {
      icon: '🔴',
      title: 'Most at-risk stage',
      metric: `NPS ${npsStr}`,
      body: `${atRisk.stage} has the lowest NPS with ${atRisk.dropOff}% drop-off. Prioritising ${atRisk.stage} backlog items would have the highest score impact.`,
      urgent: atRisk.nps < 0,
    },
    {
      icon: '⚡',
      title: 'Quick win available',
      metric: quickWinAct ? `${quickWinAct.effort} effort · High impact` : '—',
      body: quickWinAct
        ? `"${quickWinAct.title.slice(0, 55)}…" in ${quickWinStage} is High-impact with only ${quickWinAct.effort} effort — strong return on investment.`
        : 'No high-impact, low-effort activities found in current data.',
      urgent: false,
    },
    {
      icon: '📦',
      title: 'Horizon balance',
      metric: `T1 ${t1Pct}% · T2 ${Math.round((t2 / total) * 100)}% · T3 ${Math.round((t3 / total) * 100)}%`,
      body:
        t1Pct > 55
          ? `${t1} of ${total} items (${t1Pct}%) are in T1. Current sprint may be over-committed — consider deferring to T2.`
          : `${t1} T1 · ${t2} T2 · ${t3} T3 across ${total} backlog items. Horizon distribution looks balanced.`,
      urgent: t1Pct > 55,
    },
    {
      icon: '🔍',
      title: 'Coverage gap',
      metric: `${minWeight} activities`,
      body: `${gapNames.join(' & ')} ${gapNames.length === 1 ? 'has' : 'each have'} only ${minWeight} activities — significantly less than ${richName} (${maxWeight}). May be under-resourced.`,
      urgent: false,
    },
    {
      icon: '🎯',
      title: 'Feature leverage',
      metric: `${topCount} activities affected`,
      body: `Toggling "${topFeature.name}" shifts the experience score of ${topCount} activities. Try the feature toggles above to preview the impact.`,
      urgent: false,
    },
  ]
}

const INSIGHTS = computeInsights()

export function InsightStrip() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('insights-collapsed') === '1' } catch { return false }
  })

  function toggle() {
    const next = !collapsed
    setCollapsed(next)
    try { localStorage.setItem('insights-collapsed', next ? '1' : '0') } catch { /* noop */ }
  }

  return (
    <div style={{ borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)' }}>
      {/* Header bar */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 1.1rem', cursor: 'pointer', userSelect: 'none' }}
        onClick={toggle}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          💡 Insights
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)', transition: 'transform 0.2s', display: 'inline-block', transform: collapsed ? 'rotate(180deg)' : 'none' }}>▲</span>
      </div>

      {/* Cards row */}
      {!collapsed && (
        <div style={{ display: 'flex', gap: '0.75rem', padding: '0 1rem 0.9rem', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {INSIGHTS.map((ins) => (
            <div
              key={ins.title}
              style={{
                flex: '0 0 220px',
                scrollSnapAlign: 'start',
                background: '#fff',
                border: `1px solid ${ins.urgent ? '#ffc800' : 'var(--line)'}`,
                borderLeft: `4px solid ${ins.urgent ? '#ffc800' : '#1c4f8f'}`,
                borderRadius: 10,
                padding: '0.65rem 0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15253b' }}>
                  {ins.icon} {ins.title}
                </span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  background: ins.urgent ? '#fff3cc' : '#edf3f8',
                  color: ins.urgent ? '#7a5c00' : '#1c4f8f',
                  borderRadius: 999, padding: '1px 7px',
                  whiteSpace: 'nowrap',
                }}>
                  {ins.metric}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.71rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                {ins.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
