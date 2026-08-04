import { useState, useEffect, useRef } from 'react'
import {
  CJM_STAGES, STAGE_METRICS, BACKLOG_ITEMS, cjmOf,
  type BacklogItem,
} from '../data/journeyData.ts'
import { ALL_ACTIVITIES, type RoadmapActivity } from '../data/roadmapData.ts'
import type { ProposalProps } from './types.ts'

const STAGE_COLORS: Record<string, string> = {
  Recognising: '#6366f1', Exploring: '#0ea5e9', Choosing:    '#f59e0b',
  Committing:  '#ef4444', Receiving: '#10b981', Integrating: '#8b5cf6', Living: '#f97316',
}
const IMPACT_COLOR: Record<string, string> = { High: '#149238', Med: '#ed6f2c', Low: '#d2001f' }
const IMPACT_BG:    Record<string, string> = { High: '#e8f5ec', Med: '#fff3e8', Low: '#ffeaea' }
const HORIZON_COLOR: Record<string, string> = { T1: '#1c4f8f', T2: '#6366f1', T3: '#94a3b8' }
const HORIZON_BG:   Record<string, string> = { T1: '#eff6ff', T2: '#f0f0ff', T3: '#f0f4f8' }
const OBJECTIVES = ['Connect', 'Build', 'Empower', 'Govern'] as const
const OBJ_COLORS: Record<string, string> = {
  Connect: '#0ea5e9', Build: '#f59e0b', Empower: '#10b981', Govern: '#8b5cf6',
}

function useCountUp(target: number, started: boolean, duration = 1300): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    setVal(0)
    const steps = 45
    const ms = duration / steps
    let i = 0
    const timer = setInterval(() => {
      i++
      setVal(Math.round((i / steps) * target))
      if (i >= steps) clearInterval(timer)
    }, ms)
    return () => clearInterval(timer)
  }, [target, started, duration])
  return val
}

export function P13ScrollStory({ onStageClick }: ProposalProps) {
  const [stageF,     setStageF]     = useState<string | null>(null)
  const [impactF,    setImpactF]    = useState<string | null>(null)
  const [horizonF,   setHorizonF]   = useState<string | null>(null)
  const [objectiveF, setObjectiveF] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [mounted,     setMounted]     = useState(false)
  const [navTop,      setNavTop]      = useState(0)
  const [revealed,    setRevealed]    = useState<Set<string>>(new Set())

  const heroRef      = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Track sticky nav height so filter bar sticks just below it
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('.proposal-nav')
      if (nav) setNavTop(nav.getBoundingClientRect().height)
    }
    measure()
    const ro = new ResizeObserver(measure)
    const nav = document.querySelector('.proposal-nav')
    if (nav) ro.observe(nav)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeroVisible(true); obs.disconnect() } },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Reveal sections as they scroll into view, tracked in state so filter re-renders don't reset it
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const obs = new IntersectionObserver(
      (entries) => {
        const ids: string[] = []
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.revealId
            if (id) ids.push(id)
          }
        })
        if (ids.length) setRevealed(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    )
    root.querySelectorAll('[data-reveal-id]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const highN = ALL_ACTIVITIES.filter(a => a.impact === 'High').length
  const t1N   = BACKLOG_ITEMS.filter(b => b.horizon === 'T1').length
  const c1 = useCountUp(ALL_ACTIVITIES.length, heroVisible)
  const c2 = useCountUp(highN, heroVisible)
  const c3 = useCountUp(t1N, heroVisible)

  function actVisible(a: RoadmapActivity): boolean {
    return (!stageF || cjmOf(a) === stageF) &&
           (!impactF || a.impact === impactF) &&
           (!objectiveF || a.objectiveName === objectiveF)
  }
  function blVisible(b: BacklogItem): boolean {
    return (!stageF || b.stage === stageF) && (!horizonF || b.horizon === horizonF)
  }

  const tog = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    cur: string | null,
    val: string,
  ) => setter(cur === val ? null : val)

  const hasFilters = stageF || impactF || horizonF || objectiveF

  function pill(active: boolean, color = '#111'): React.CSSProperties {
    return {
      padding: '3px 11px', borderRadius: 999,
      border: `1.5px solid ${active ? color : '#d7e1ec'}`,
      background: active ? color : '#fff',
      color: active ? '#fff' : '#47607d',
      fontSize: '0.72rem', fontWeight: active ? 700 : 400,
      cursor: 'pointer', transition: 'all 0.15s', lineHeight: 1.6,
    }
  }

  return (
    <div ref={containerRef} style={{ fontFamily: 'inherit' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          background: 'linear-gradient(160deg,#0d1117 0%,#111827 100%)',
          padding: '4rem 2.5rem 3rem', borderRadius: 20, marginBottom: '2rem',
          position: 'relative', overflow: 'hidden',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(18px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div style={{ position: 'absolute', right: -10, top: -20, fontSize: '14rem', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>FY27</div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#ffc800', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            Ingka x Inter IKEA Group
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05 }}>
            Home Planning Journey<span style={{ color: '#ffc800' }}> FY27</span>
          </h2>
          <p style={{ margin: '0 0 2.5rem', color: '#94a3b8', fontSize: '1rem', maxWidth: 500 }}>
            7 customer stages · 4 strategic objectives · one aligned roadmap
          </p>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { val: c1, label: 'Roadmap activities' },
              { val: c2, label: 'High-impact' },
              { val: c3, label: 'T1 backlog items' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 900, color: '#ffc800', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{val}</div>
                <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>&#8595;</span> scroll to explore
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ─────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: navTop, zIndex: 10,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #d7e1ec',
        padding: '0.55rem 0.75rem', marginBottom: '1.5rem',
        display: 'flex', flexWrap: 'wrap', gap: '0.45rem 1rem', alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      }}>
        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0 }}>Filter</span>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CJM_STAGES.map(s => (
            <button key={s} onClick={() => tog(setStageF, stageF, s)} style={pill(stageF === s, STAGE_COLORS[s])}>{s}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: '#e2e8f0', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {(['High', 'Med', 'Low'] as const).map(v => (
            <button key={v} onClick={() => tog(setImpactF, impactF, v)} style={pill(impactF === v, IMPACT_COLOR[v])}>{v}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: '#e2e8f0', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {(['T1', 'T2', 'T3'] as const).map(v => (
            <button key={v} onClick={() => tog(setHorizonF, horizonF, v)} style={pill(horizonF === v, HORIZON_COLOR[v])}>{v}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: '#e2e8f0', flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {OBJECTIVES.map(v => (
            <button key={v} onClick={() => tog(setObjectiveF, objectiveF, v)} style={pill(objectiveF === v, OBJ_COLORS[v])}>{v}</button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => { setStageF(null); setImpactF(null); setHorizonF(null); setObjectiveF(null) }}
            style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#d2001f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            ✕ Clear all
          </button>
        )}
      </div>

      {/* ── One chapter per CJM stage ─────────────────────────────── */}
      {CJM_STAGES.map((stageName, si) => {
        const metric = STAGE_METRICS.find(m => m.stage === stageName)!
        const acts   = ALL_ACTIVITIES.filter(a => cjmOf(a) === stageName)
        const bl     = BACKLOG_ITEMS.filter(b => b.stage === stageName)
        const color  = STAGE_COLORS[stageName]
        if (stageF && stageF !== stageName) return null
        const visibleActs = acts.filter(a => actVisible(a))
        const visibleBl   = bl.filter(b => blVisible(b))
        if (hasFilters && visibleActs.length === 0 && visibleBl.length === 0) return null
        return (
          <div
            key={stageName}
            data-reveal-id={`stage-${stageName}`}
            className={revealed.has(`stage-${stageName}`) ? 's-reveal s-visible' : 's-reveal'}
            style={{
              background: si % 2 === 0 ? '#fff' : '#f8fafc',
              borderRadius: 20, border: '1px solid #e2e8f0',
              padding: '2rem 2rem 1.5rem', marginBottom: '1.5rem',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', right: 14, top: 4, fontSize: '8rem', fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
              {String(si + 1).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ width: 5, height: 34, borderRadius: 3, background: color, flexShrink: 0 }} />
              <h3
                onClick={() => onStageClick?.(stageName)}
                style={{ margin: 0, fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 900, color: '#15253b', lineHeight: 1, cursor: onStageClick ? 'pointer' : 'default' }}
                title={onStageClick ? 'Open stage details' : undefined}
              >
                {stageName}
              </h3>
              <span style={{ padding: '2px 10px', borderRadius: 999, background: metric.nps >= 0 ? '#e8f5ec' : '#ffeaea', color: metric.nps >= 0 ? '#149238' : '#d2001f', fontWeight: 700, fontSize: '0.76rem', flexShrink: 0 }}>
                NPS {metric.nps > 0 ? '+' : ''}{metric.nps}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {metric.conversion}% conv · {metric.dropOff}% drop-off · effort {metric.effort}/10
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(195px,1fr))', gap: 8, marginBottom: bl.length > 0 ? '1.2rem' : 0 }}>
              {acts.filter(a => actVisible(a)).map(a => (
                <div
                  key={a.id}
                  style={{
                    background: '#fff', borderRadius: 10,
                    border: `1.5px solid ${color}28`,
                    padding: '0.65rem 0.75rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#15253b', lineHeight: 1.3, marginBottom: 6 }}>{a.title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <span style={{ padding: '1px 6px', borderRadius: 999, background: IMPACT_BG[a.impact], color: IMPACT_COLOR[a.impact], fontSize: '0.61rem', fontWeight: 700 }}>{a.impact}</span>
                    <span style={{ padding: '1px 6px', borderRadius: 999, background: '#f0f4f8', color: '#47607d', fontSize: '0.61rem' }}>{a.effort}</span>
                    {a.priority && <span style={{ padding: '1px 6px', borderRadius: 999, background: '#fffbeb', color: '#b45309', fontSize: '0.61rem', fontWeight: 700 }}>priority</span>}
                  </div>
                  {a.tags.length > 0 && (
                    <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {a.tags.slice(0, 3).map(t => (
                        <span key={t} style={{ padding: '0 5px', borderRadius: 999, border: '1px solid #e2e8f0', fontSize: '0.58rem', color: '#94a3b8' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {bl.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Backlog</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(['T1', 'T2', 'T3'] as const).flatMap(h =>
                    bl.filter(b => b.horizon === h && blVisible(b)).map(b => (
                      <span
                        key={b.id}
                        style={{
                          padding: '2px 9px', borderRadius: 999,
                          background: HORIZON_BG[h], color: HORIZON_COLOR[h],
                          border: `1px solid ${HORIZON_COLOR[h]}33`,
                          fontSize: '0.67rem',
                        }}
                      >
                        {h} · {b.title}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* ── Sprint focus: T1 ──────────────────────────────────────── */}
      <div data-reveal-id="t1-sprint" className={revealed.has('t1-sprint') ? 's-reveal s-visible' : 's-reveal'} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
          <div style={{ width: 5, height: 34, borderRadius: 3, background: '#ffc800' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', fontWeight: 900, color: '#15253b' }}>{"What's shipping now"}</h3>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>T1 — current sprint · {t1N} items</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(235px,1fr))', gap: 10 }}>
          {BACKLOG_ITEMS.filter(b => b.horizon === 'T1').map(b => (
            <div
              key={b.id}
              style={{
                background: '#fff', borderRadius: 12,
                border: '1px solid #fde68a', borderLeft: '4px solid #ffc800',
                padding: '0.75rem 0.9rem',
                opacity: (stageF && b.stage !== stageF) ? 0.18 : 1,
                transition: 'opacity 0.25s',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15253b', marginBottom: 6, lineHeight: 1.3 }}>{b.title}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ padding: '1px 7px', borderRadius: 999, background: `${STAGE_COLORS[b.stage]}22`, color: STAGE_COLORS[b.stage], fontSize: '0.63rem', fontWeight: 700 }}>{b.stage}</span>
                <span style={{ padding: '1px 7px', borderRadius: 999, background: '#f0f4f8', color: '#47607d', fontSize: '0.63rem' }}>{b.team} · {b.storyPoints}sp</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Strategic objectives ──────────────────────────────────── */}
      <div data-reveal-id="objectives" className={revealed.has('objectives') ? 's-reveal s-visible' : 's-reveal'} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
          <div style={{ width: 5, height: 34, borderRadius: 3, background: '#8b5cf6' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', fontWeight: 900, color: '#15253b' }}>Strategic objectives</h3>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>4 objectives · {ALL_ACTIVITIES.length} activities</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {OBJECTIVES.map(obj => {
            const acts = ALL_ACTIVITIES.filter(a => a.objectiveName === obj)
            const hi   = acts.filter(a => a.impact === 'High').length
            return (
              <div
                key={obj}
                style={{
                  background: '#fff', borderRadius: 14,
                  border: `1.5px solid ${OBJ_COLORS[obj]}30`,
                  padding: '1rem 1.1rem',
                  opacity: (objectiveF && objectiveF !== obj) ? 0.18 : 1,
                  transition: 'opacity 0.25s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${OBJ_COLORS[obj]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: OBJ_COLORS[obj] }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#15253b' }}>{obj}</div>
                </div>
                <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginBottom: 8 }}>
                  {acts.length} activities · {hi} high-impact
                </div>
                {acts.filter(a => a.impact === 'High').slice(0, 3).map(a => (
                  <div key={a.id} style={{ fontSize: '0.69rem', color: '#47607d', padding: '3px 0', borderBottom: '1px solid #f0f4f8', lineHeight: 1.35 }}>
                    {a.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
