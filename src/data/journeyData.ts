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

export const STAGES: Stage[] = [
  { name: 'Recognising', weight: 1 },
  { name: 'Exploring', weight: 1.2 },
  { name: 'Choosing', weight: 1.2 },
  { name: 'Committing', weight: 1.5 },
  { name: 'Receiving', weight: 1 },
  { name: 'Integrating', weight: 1 },
  { name: 'Living', weight: 1.1 },
]

export const BASE_POINTS: JourneyPoint[] = [
  { id: 'p1', x: 16, y: 54, text: 'Missing local and personalized online inspiration', sentiment: 'risk', labelPosition: 'bottom', labelWidth: 220 },
  { id: 'p2', x: 20, y: 50, text: 'Choice overload and lack of clarity on which range is customizable/modular', sentiment: 'risk', labelPosition: 'top', labelDx: 30, labelDy: -6, labelWidth: 250 },
  { id: 'p3', x: 24, y: 48, text: 'Lack of guidance on range coordination', sentiment: 'risk', labelPosition: 'top', labelDx: 70, labelDy: -30, labelWidth: 220 },
  { id: 'p4', x: 28, y: 56, text: 'Difficult to start with "blank page" paralysis', sentiment: 'pain', labelPosition: 'top', labelDx: 20, labelDy: -20, labelWidth: 220 },
  { id: 'p5', x: 30, y: 70, text: 'Low awareness and accessibility of financial service', sentiment: 'pain', labelPosition: 'top', labelDx: 16, labelDy: -6, labelWidth: 220 },
  { id: 'p6', x: 34, y: 82, text: 'Disconnected omnichannel planning and buying journey', sentiment: 'pain', labelPosition: 'bottom', labelDx: 10, labelDy: 10, labelWidth: 250 },
  { id: 'p7', x: 39, y: 73, text: 'Delivery and assembly cost perceived as non-competitive and stores sometimes too far', sentiment: 'pain', labelPosition: 'top', labelDx: 24, labelDy: -8, labelWidth: 260 },
  { id: 'p8', x: 40, y: 50, text: 'Waiting time for planning appointment is frustrating', sentiment: 'risk', labelPosition: 'top', labelDx: 18, labelDy: -30, labelWidth: 240 },
  { id: 'p9', x: 43, y: 34, text: 'Long guarantee is a good surprise', sentiment: 'gain', labelPosition: 'top', labelDx: 18, labelDy: -30, labelWidth: 190 },
  { id: 'p10', x: 50, y: 22, text: 'Satisfying touch and feel in-store experience', sentiment: 'gain', labelPosition: 'top', labelDx: 18, labelDy: -48, labelWidth: 230 },
  { id: 'p11', x: 57, y: 36, text: 'Satisfying expert validation experience increases buying confidence', sentiment: 'gain', labelPosition: 'top', labelDx: 18, labelDy: -20, labelWidth: 280 },
  { id: 'p12', x: 66, y: 56, text: 'Irrelevant service options at checkout', sentiment: 'risk', labelPosition: 'bottom', labelDx: 12, labelDy: 10, labelWidth: 250 },
  { id: 'p13', x: 85, y: 64, text: 'Self assembly time and skills are underestimated', sentiment: 'risk', labelPosition: 'bottom', labelDx: 18, labelDy: 10, labelWidth: 270 },
  { id: 'p14', x: 94, y: 28, text: 'Happy feeling of achievement', sentiment: 'gain', labelPosition: 'top', labelDx: 18, labelDy: -28, labelWidth: 210 },
  { id: 'p15', x: 99, y: 51, text: 'Low engagement over time beyond purchase', sentiment: 'risk', labelPosition: 'bottom', labelDx: 12, labelDy: 8, labelWidth: 230 },
]

export const FEATURES: FeatureDefinition[] = [
  {
    id: 'guided-discovery',
    name: 'Guided Discovery',
    description: 'Curated onboarding and local inspiration remove early-stage friction.',
    bannerText: 'Guided discovery connects channels and gives customers a clearer first step.',
    pointChanges: {
      p1: { sentiment: 'gain', y: 34, text: 'Localized and personalized inspiration motivates confident first exploration' },
      p2: { sentiment: 'gain', y: 32, text: 'Guided choice flow clarifies modular/customizable ranges' },
      p4: { sentiment: 'risk', y: 50, text: 'Starter templates reduce blank-page paralysis' },
    },
  },
  {
    id: 'planning-optimizer',
    name: 'Planning Optimizer',
    description: 'Scheduling, planning, and services become faster and more relevant.',
    bannerText: 'Smart planning shortens waiting loops and aligns service options to intent.',
    pointChanges: {
      p8: { sentiment: 'gain', y: 33, text: 'Instant digital planning slots reduce waiting frustration' },
      p12: { sentiment: 'gain', y: 36, text: 'Checkout recommendations are relevant to room and mission' },
      p13: { sentiment: 'risk', y: 52, text: 'Assembly effort estimator sets realistic time and skill expectations' },
    },
  },
  {
    id: 'lifecycle-engagement',
    name: 'Lifecycle Engagement',
    description: 'Post-purchase support keeps customers active and successful.',
    bannerText: 'Lifecycle nudges and care moments sustain engagement after purchase.',
    pointChanges: {
      p15: { sentiment: 'gain', y: 30, text: 'Post-purchase missions and care tips maintain long-term engagement' },
      p14: { sentiment: 'gain', y: 24, text: 'Achievement is amplified with shareable setup milestones' },
    },
  },
]

export const STAGE_METRICS: StageMetrics[] = [
  { stage: 'Recognising', nps: 12, conversion: 68, dropOff: 32, effort: 4 },
  { stage: 'Exploring', nps: -8, conversion: 54, dropOff: 46, effort: 7 },
  { stage: 'Choosing', nps: -22, conversion: 41, dropOff: 59, effort: 8 },
  { stage: 'Committing', nps: 5, conversion: 38, dropOff: 62, effort: 6 },
  { stage: 'Receiving', nps: 18, conversion: 91, dropOff: 9, effort: 3 },
  { stage: 'Integrating', nps: -5, conversion: 72, dropOff: 28, effort: 7 },
  { stage: 'Living', nps: -15, conversion: 30, dropOff: 70, effort: 5 },
]

export const BACKLOG_ITEMS: BacklogItem[] = [
  { id: 'b1', title: 'Personalized inspiration feed', stage: 'Recognising', priority: 'must-have', horizon: 'T1', team: 'Discovery', storyPoints: 8 },
  { id: 'b2', title: 'Range coordination wizard', stage: 'Exploring', priority: 'must-have', horizon: 'T1', team: 'Planning', storyPoints: 13 },
  { id: 'b3', title: 'Room style quiz onboarding', stage: 'Exploring', priority: 'nice-to-have', horizon: 'T2', team: 'Discovery', storyPoints: 5 },
  { id: 'b4', title: 'Modular planning starter templates', stage: 'Choosing', priority: 'must-have', horizon: 'T1', team: 'Planning', storyPoints: 8 },
  { id: 'b5', title: 'Integrated financing calculator', stage: 'Choosing', priority: 'nice-to-have', horizon: 'T2', team: 'Finance', storyPoints: 13 },
  { id: 'b6', title: 'Omnichannel cart persistence', stage: 'Choosing', priority: 'must-have', horizon: 'T1', team: 'Commerce', storyPoints: 21 },
  { id: 'b7', title: 'Instant planning appointment slots', stage: 'Committing', priority: 'must-have', horizon: 'T1', team: 'Planning', storyPoints: 13 },
  { id: 'b8', title: 'Transparent delivery cost estimator', stage: 'Committing', priority: 'nice-to-have', horizon: 'T2', team: 'Logistics', storyPoints: 8 },
  { id: 'b9', title: 'Smart checkout service recommendations', stage: 'Committing', priority: 'like-to-have', horizon: 'T3', team: 'Commerce', storyPoints: 5 },
  { id: 'b10', title: 'Real-time delivery tracking', stage: 'Receiving', priority: 'must-have', horizon: 'T2', team: 'Logistics', storyPoints: 13 },
  { id: 'b11', title: 'Assembly effort estimator', stage: 'Integrating', priority: 'nice-to-have', horizon: 'T2', team: 'CX', storyPoints: 5 },
  { id: 'b12', title: 'Post-purchase care nudges', stage: 'Living', priority: 'like-to-have', horizon: 'T3', team: 'CRM', storyPoints: 8 },
  { id: 'b13', title: 'Room mission re-engagement flow', stage: 'Living', priority: 'nice-to-have', horizon: 'T3', team: 'CRM', storyPoints: 13 },
]

export const POWER_USER_POINTS: JourneyPoint[] = [
  { id: 'pu1', x: 16, y: 38, text: 'Already knows IKEA — skips inspiration phase', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu2', x: 20, y: 35, text: 'Navigates range confidently', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu3', x: 24, y: 32, text: 'Uses IKEA app for coordination', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu4', x: 28, y: 44, text: 'Still needs planning help for complex rooms', sentiment: 'risk', labelPosition: 'top' },
  { id: 'pu5', x: 30, y: 52, text: 'Aware of financing but finds it slow', sentiment: 'risk', labelPosition: 'top' },
  { id: 'pu6', x: 34, y: 58, text: 'Uses online planning but misses in-store fidelity', sentiment: 'risk', labelPosition: 'bottom' },
  { id: 'pu7', x: 39, y: 48, text: 'Expects better delivery rate as a returning customer', sentiment: 'risk', labelPosition: 'top' },
  { id: 'pu8', x: 40, y: 36, text: 'Uses self-checkout — fast committing', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu9', x: 43, y: 28, text: 'Appreciates the guarantee policy', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu10', x: 50, y: 18, text: 'In-store experience is consistently excellent', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu11', x: 57, y: 22, text: 'Validates choices through personal network', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu12', x: 66, y: 40, text: 'Checkout is efficient for returning customers', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu13', x: 85, y: 32, text: 'Assembly is easy — done it before', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu14', x: 94, y: 22, text: 'Strong pride in the completed room', sentiment: 'gain', labelPosition: 'top' },
  { id: 'pu15', x: 99, y: 28, text: 'Active in IKEA Family program', sentiment: 'gain', labelPosition: 'bottom' },
]

export const COWORKER_POINTS: JourneyPoint[] = [
  { id: 'cw1', x: 16, y: 56, text: 'Creating local inspiration content is effort-intensive with limited tooling', sentiment: 'risk', labelPosition: 'bottom' },
  { id: 'cw2', x: 20, y: 64, text: 'Range complexity makes it hard to give consistent advice', sentiment: 'pain', labelPosition: 'top' },
  { id: 'cw3', x: 24, y: 60, text: 'No unified tool to guide customers through range coordination', sentiment: 'risk', labelPosition: 'bottom' },
  { id: 'cw4', x: 28, y: 70, text: 'Planning tool limitations frustrate both coworker and customer', sentiment: 'pain', labelPosition: 'top' },
  { id: 'cw5', x: 30, y: 58, text: 'Explaining financing requires constant upskilling', sentiment: 'risk', labelPosition: 'top' },
  { id: 'cw6', x: 34, y: 74, text: 'Cross-channel orders create significant reconciliation overhead', sentiment: 'pain', labelPosition: 'bottom' },
  { id: 'cw7', x: 39, y: 62, text: 'Delivery cost objections require repetitive manual workarounds', sentiment: 'risk', labelPosition: 'top' },
  { id: 'cw8', x: 40, y: 76, text: 'Appointment backlog is stressful and hard to manage in real time', sentiment: 'pain', labelPosition: 'top' },
  { id: 'cw9', x: 43, y: 34, text: 'Completing a complex order end-to-end feels genuinely rewarding', sentiment: 'gain', labelPosition: 'top' },
  { id: 'cw10', x: 50, y: 28, text: 'In-store validation moments feel purposeful and motivating', sentiment: 'gain', labelPosition: 'top' },
  { id: 'cw11', x: 57, y: 36, text: 'Helping customers finalize their vision creates real connection', sentiment: 'gain', labelPosition: 'top' },
  { id: 'cw12', x: 66, y: 55, text: 'Irrelevant upsell prompts at checkout create awkward situations', sentiment: 'risk', labelPosition: 'bottom' },
  { id: 'cw13', x: 85, y: 65, text: 'Assembly support calls surge after high-volume delivery weekends', sentiment: 'pain', labelPosition: 'bottom' },
  { id: 'cw14', x: 94, y: 30, text: 'Customer appreciation and success stories are genuinely motivating', sentiment: 'gain', labelPosition: 'top' },
  { id: 'cw15', x: 99, y: 60, text: 'Limited tools to proactively re-engage customers after the sale', sentiment: 'risk', labelPosition: 'bottom' },
]
