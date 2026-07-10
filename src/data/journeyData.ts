export type Sentiment = 'pain' | 'risk' | 'gain'
export type Priority = 'must-have' | 'nice-to-have' | 'like-to-have'
export type Horizon = 'T1' | 'T2' | 'T3'
export type Role = 'business' | 'design' | 'engineering' | 'roadmap'

export type JourneyPoint = {
  id: string
  x: number
  y: number
  text: string
  sentiment: Sentiment
  labelPosition: 'top' | 'bottom'
  labelDx?: number
  labelDy?: number
  labelWidth?: number
}

export type Stage = { name: string; weight: number }

export type StageMetrics = {
  stage: string
  nps: number
  conversion: number
  dropOff: number
  effort: number
}

export type BacklogItem = {
  id: string
  title: string
  stage: string
  priority: Priority
  horizon: Horizon
  team: string
  storyPoints: number
}

export type FeatureDefinition = {
  id: string
  name: string
  description: string
  bannerText: string
  pointChanges: Record<string, Partial<JourneyPoint>>
}

export function pointColor(sentiment: Sentiment): string {
  if (sentiment === 'gain') return '#149238'
  if (sentiment === 'risk') return '#ed6f2c'
  return '#d2001f'
}

// ─────────────────────────────────────────────────────────────────────────────
// All data is derived from the FY27 Home Planning roadmap dataset
// ─────────────────────────────────────────────────────────────────────────────
import { ALL_ACTIVITIES, TASK_ITEMS, type RoadmapActivity } from './roadmapData.ts'

const CJM_STAGES = ['Recognising', 'Exploring', 'Choosing', 'Committing', 'Receiving', 'Integrating', 'Living'] as const

// Maps each FY27 activity id → the customer journey stage it belongs to
const _CJM: Record<string, string> = {
  a1:'Choosing',  a2:'Choosing',   a3:'Exploring',  a4:'Committing',  a5:'Recognising',
  a6:'Recognising',a7:'Choosing',   a8:'Exploring',  a9:'Exploring',   a10:'Committing',
  a11:'Recognising',a12:'Recognising',a13:'Choosing', a14:'Choosing',   a15:'Choosing',
  a16:'Choosing', a17:'Committing', a18:'Exploring', a19:'Recognising', a20:'Exploring',
  a21:'Choosing', a22:'Exploring',  a23:'Exploring', a24:'Exploring',   a25:'Choosing',
  a26:'Integrating',a27:'Integrating',a28:'Receiving',a29:'Receiving',  a30:'Integrating',
  a31:'Receiving',a32:'Living',     a33:'Living',    a34:'Living',      a35:'Living',
  a36:'Living',   a37:'Living',     a38:'Living',    a39:'Living',
}
const cjmOf = (a: RoadmapActivity) => _CJM[a.id] ?? 'Choosing'

export const STAGES: Stage[] = CJM_STAGES.map((name) => ({
  name,
  weight: ALL_ACTIVITIES.filter((a) => cjmOf(a) === name).length,
}))

const _totalW = STAGES.reduce((s, st) => s + st.weight, 0)

/** Pre-computed proportional x-range for each stage (0–100) */
export const STAGE_BOUNDS: Record<string, { start: number; end: number }> = (() => {
  let acc = 0
  const b: Record<string, { start: number; end: number }> = {}
  for (const st of STAGES) {
    const start = (acc / _totalW) * 100
    acc += st.weight
    b[st.name] = { start, end: (acc / _totalW) * 100 }
  }
  return b
})()

function actToPoint(a: RoadmapActivity, idxInObj: number, countInObj: number): JourneyPoint {
  const { start, end } = STAGE_BOUNDS[cjmOf(a)]
  const margin = (end - start) * 0.04
  const x = countInObj === 1
    ? (start + end) / 2
    : start + margin + (idxInObj / (countInObj - 1)) * (end - start - 2 * margin)
  const y = a.impact === 'High' ? 17 : a.impact === 'Low' ? 83 : 50
  const sentiment: Sentiment = a.impact === 'Low' ? 'pain'
    : (a.impact === 'High' || a.priority) ? 'gain' : 'risk'
  return { id: a.id, x: Math.round(x * 10) / 10, y, text: a.title, sentiment, labelPosition: idxInObj % 2 === 0 ? 'top' : 'bottom' }
}

function pointsForFilter(filter: (a: RoadmapActivity) => boolean): JourneyPoint[] {
  return CJM_STAGES.flatMap((stage) => {
    const acts = ALL_ACTIVITIES.filter((a) => cjmOf(a) === stage && filter(a))
    return acts.map((a, i) => actToPoint(a, i, acts.length))
  })
}

export const BASE_POINTS: JourneyPoint[] = pointsForFilter(() => true)
export const POWER_USER_POINTS: JourneyPoint[] = pointsForFilter((a) => a.tags.includes('Ingka'))
export const COWORKER_POINTS: JourneyPoint[] = pointsForFilter((a) => a.tags.includes('Inter'))

// ── Feature toggles (boost y for tagged activities when enabled) ──────────────
const _boost = (tag: string, delta: number) =>
  ALL_ACTIVITIES.filter((a) => a.tags.includes(tag) && a.impact !== 'High')
    .reduce<Record<string, Partial<JourneyPoint>>>((acc, a) => ({ ...acc, [a.id]: { y: Math.max(8, a.impact === 'Med' ? 50 - delta : 83 - delta) } }), {})

export const FEATURES: FeatureDefinition[] = [
  { id: 'seamless',    name: 'Seamless Planning', description: 'Connected experiences across all touchpoints remove friction.', bannerText: 'Seamless planning unifies every customer touchpoint into one continuous journey.', pointChanges: _boost('Seamless', 23) },
  { id: 'nextgen',     name: 'NextGen AI',        description: 'AI-powered tools accelerate customer and co-worker confidence.',  bannerText: 'Next-generation AI transforms how customers design and plan their homes.',         pointChanges: _boost('NextGen', 23) },
  { id: '3dpipeline',  name: '3D Pipeline',       description: 'Unified 3D asset pipeline ensures visual consistency everywhere.', bannerText: 'A single 3D pipeline powers accurate, consistent visuals across all planners.',    pointChanges: { a15: { y: 8 }, a1: { y: 8 } } },
]

// ── Stage metrics (computed from activities per objective) ────────────────────
const _effortN = (e: string) => ({ S: 2, M: 5, L: 8, XL: 10 } as Record<string, number>)[e] ?? 5

export const STAGE_METRICS: StageMetrics[] = STAGES.map((stage) => {
  const acts = ALL_ACTIVITIES.filter((a) => cjmOf(a) === stage.name)
  const high = acts.filter((a) => a.impact === 'High').length
  const pri  = acts.filter((a) => a.priority).length
  const avgE = Math.round(acts.reduce((s, a) => s + _effortN(a.effort), 0) / acts.length)
  return {
    stage:      stage.name,
    nps:        Math.max(-50, Math.min(50, Math.round((high / acts.length) * 60 + (pri / acts.length) * 20 - 30))),
    conversion: Math.round((pri / acts.length) * 100),
    dropOff:    Math.round(((acts.length - pri) / acts.length) * 100),
    effort:     Math.min(10, avgE),
  }
})

// ── Backlog items from the FY27 task list ─────────────────────────────────────
export const BACKLOG_ITEMS: BacklogItem[] = TASK_ITEMS.map((t) => ({
  id:          t.id,
  title:       t.title,
  stage:       t.stage,
  priority:    t.status === 'roadmap' ? 'must-have' : t.status === 'risk' ? 'like-to-have' : 'nice-to-have',
  horizon:     (t.status === 'roadmap' || t.status === 'done') ? 'T1' : t.status === 'risk' ? 'T3' : 'T2',
  team:        t.source,
  storyPoints: t.linkedCards.length * 3 + 2,
} as BacklogItem))
