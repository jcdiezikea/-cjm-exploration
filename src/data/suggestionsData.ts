export type SuggestionMetricKey = 'nps' | 'conversion' | 'dropOff' | 'effort' | 'csat'

export type Suggestion = {
  id: string; title: string; team: string
  horizon: 'T1' | 'T2' | 'T3'; storyPoints: number
  priority: 'must-have' | 'nice-to-have' | 'like-to-have'
  impacts: Partial<Record<SuggestionMetricKey, number>>
}

export const STAGE_SUGGESTIONS: Record<string, Suggestion[]> = {
  Recognising: [
    { id: 's-rec1', title: 'Personalise Home Planning Hub entry points via CDP segments',     team: 'Digital Content', horizon: 'T2', storyPoints: 8,  priority: 'must-have',    impacts: { nps: 8,  csat: 5, conversion: 4 } },
    { id: 's-rec2', title: 'A/B test AI-generated room inspiration on homepage hero',          team: 'Inter IMC',       horizon: 'T1', storyPoints: 5,  priority: 'nice-to-have', impacts: { nps: 5,  csat: 4 } },
    { id: 's-rec3', title: 'Re-engagement email flow for lapsed home planning sessions',       team: 'Marketing',       horizon: 'T2', storyPoints: 5,  priority: 'must-have',    impacts: { conversion: 6, dropOff: -5 } },
  ],
  Exploring: [
    { id: 's-exp1', title: 'Improve room scanner accuracy for small and irregular rooms',      team: 'Digital Product', horizon: 'T2', storyPoints: 13, priority: 'must-have',    impacts: { effort: -1,   csat: 6 } },
    { id: 's-exp2', title: "Add 'complete the look' cross-links inside Kreativ",               team: 'Inter IMC',       horizon: 'T1', storyPoints: 5,  priority: 'nice-to-have', impacts: { conversion: 5, csat: 4 } },
    { id: 's-exp3', title: 'Reduce 3D preview load time by 40% via asset streaming',           team: 'Digital Product', horizon: 'T2', storyPoints: 8,  priority: 'must-have',    impacts: { effort: -1.5, nps: 7, csat: 5 } },
  ],
  Choosing: [
    { id: 's-cho1', title: 'Surface real-time stock availability inside GPC configurator',     team: 'Planning Tools',  horizon: 'T1', storyPoints: 8,  priority: 'must-have',    impacts: { nps: 10, csat: 7, dropOff: -5 } },
    { id: 's-cho2', title: 'Auto-validate measurements before triggering 3D render',           team: 'Inter IMC',       horizon: 'T2', storyPoints: 5,  priority: 'nice-to-have', impacts: { effort: -1,   conversion: 5 } },
    { id: 's-cho3', title: 'In-planner co-worker chat escalation widget',                      team: 'Commerce',        horizon: 'T2', storyPoints: 8,  priority: 'like-to-have', impacts: { csat: 6,  nps: 5 } },
  ],
  Committing: [
    { id: 's-com1', title: 'Sync in-store kiosk session state with active mobile session',     team: 'Digital Product', horizon: 'T1', storyPoints: 13, priority: 'must-have',    impacts: { nps: 8,  csat: 6, effort: -1 } },
    { id: 's-com2', title: 'One-click checkout for previously saved planner designs',          team: 'Commerce',        horizon: 'T1', storyPoints: 5,  priority: 'must-have',    impacts: { conversion: 7, dropOff: -6 } },
    { id: 's-com3', title: 'Show 3D order summary with room preview before payment',           team: 'Commerce',        horizon: 'T2', storyPoints: 8,  priority: 'nice-to-have', impacts: { csat: 5,  nps: 4 } },
  ],
  Receiving: [
    { id: 's-rec4', title: 'Proactive delay alerts with self-service reschedule option',       team: 'Logistics',       horizon: 'T1', storyPoints: 8,  priority: 'must-have',    impacts: { nps: 6,  csat: 5 } },
    { id: 's-rec5', title: 'Post-delivery satisfaction micro-survey with follow-up',           team: 'Analytics',       horizon: 'T2', storyPoints: 5,  priority: 'nice-to-have', impacts: { nps: 8,  csat: 6 } },
    { id: 's-rec6', title: 'Capture planning data at delivery to enable future personalisation', team: 'Analytics',     horizon: 'T3', storyPoints: 8,  priority: 'like-to-have', impacts: { csat: 4,  conversion: 3 } },
  ],
  Integrating: [
    { id: 's-int1', title: 'Structured onboarding flow for co-workers on Commercial Planning', team: 'Inter M&CP',      horizon: 'T2', storyPoints: 8,  priority: 'must-have',    impacts: { effort: -1,   nps: 5 } },
    { id: 's-int2', title: 'Direct IDS–GPC data bridge to eliminate manual re-entry',         team: 'Ingka Commerce',  horizon: 'T2', storyPoints: 13, priority: 'must-have',    impacts: { effort: -1.5, csat: 6 } },
    { id: 's-int3', title: 'Real-time co-worker support escalation channel in-tool',           team: 'Inter M&CP',      horizon: 'T3', storyPoints: 5,  priority: 'like-to-have', impacts: { csat: 7,  nps: 6 } },
  ],
  Living: [
    { id: 's-liv1', title: 'Joint Ingka–Inter governance dashboard for roadmap alignment',     team: 'Architecture',    horizon: 'T2', storyPoints: 8,  priority: 'must-have',    impacts: { nps: 5,  csat: 4 } },
    { id: 's-liv2', title: 'Quarterly Home Planning Forum digest for stakeholders',            team: 'P&C',             horizon: 'T2', storyPoints: 5,  priority: 'nice-to-have', impacts: { nps: 4,  csat: 3 } },
    { id: 's-liv3', title: 'Automated taxonomy update notifications across Ingka + Inter',     team: 'Architecture',    horizon: 'T3', storyPoints: 5,  priority: 'like-to-have', impacts: { effort: -0.5, conversion: 3 } },
  ],
}
