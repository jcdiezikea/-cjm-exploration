// Home Planning: Key Development Activities FY27
// Joint Ingka & Inter IKEA Group · Draft for FY27 planning session · May 2026

export const ROADMAP_META = {
  title: 'Home Planning: Key Development Activities FY27',
  subtitle: 'Joint Ingka & Inter IKEA Group · Draft for FY27 planning session · May 2026',
  lastEdited: { date: '2026-06-17', by: 'Thilek Silvadorai' },
}

export interface RoadmapActivity {
  id: string
  title: string
  priority: boolean
  effort: 'S' | 'M' | 'L' | 'XL'
  impact: 'Low' | 'Med' | 'High'
  tags: string[]
  cardNumber: number
  team?: string | null
  objectiveId: string
  objectiveName: string
}

export interface RoadmapTaskItem {
  id: string
  title: string
  source: string
  status: 'roadmap' | 'pending' | 'done' | 'risk'
  linkedCards: string[]
  group: string
  stage: string
}

export const ALL_ACTIVITIES: RoadmapActivity[] = [
  // ── Objective 1: Connect ─────────────────────────────────────────────────────
  { id: 'a1',  title: 'System furniture in space planning (Phase 1)',        priority: true,  effort: 'M',  impact: 'High', tags: ['GP28','Ingka','Inter','Seamless'],              cardNumber: 1,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a2',  title: 'Customer Space Planning migration (Phase 1)',         priority: true,  effort: 'L',  impact: 'High', tags: ['Ingka','Inter','Seamless'],                     cardNumber: 2,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a3',  title: 'Omni-channel continuity: expose designs from anywhere', priority: true, effort: 'M', impact: 'Med', tags: ['GP28','Ingka','Inter'],                          cardNumber: 3,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a4',  title: 'Omni-channel continuity: edit designs from anywhere', priority: true,  effort: 'M',  impact: 'Med', tags: ['Ingka'],                                         cardNumber: 4,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a5',  title: 'System furniture imagination (Find My Fit)',          priority: true,  effort: 'M',  impact: 'High', tags: ['GP28','Ingka','Inter'],                          cardNumber: 5,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a6',  title: 'Boost awareness of home planning',                    priority: true,  effort: 'M',  impact: 'Med',  tags: ['Ingka','Boost'],                                 cardNumber: 6,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a7',  title: 'New Kitchen Planner (incl. Quick METOD / Redskap)',   priority: true,  effort: 'XL', impact: 'High', tags: ['Inter','Kraftsamla-Kitchen'],   team: 'REX',     cardNumber: 7,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a8',  title: 'Room scanning in system & configuration planners',    priority: true,  effort: 'L',  impact: 'Med',  tags: ['Joint','Inter','Ingka','Seamless'],              cardNumber: 8,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a9',  title: 'Room & space modelling: walls, windows & elements',   priority: false, effort: 'L',  impact: 'Med',  tags: ['Ingka','Inter'],                                 cardNumber: 9,  objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a10', title: 'Support new ranges (e.g. INKÖPARE)',                  priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','GP28','Operational Exellency','GP27'], team: 'REX', cardNumber: 10, objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a11', title: 'Re-engagement of inactive customers',                 priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','Boost'],                                 cardNumber: 11, objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a12', title: 'New Home Planning Hub',                               priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint'],                                         cardNumber: 12, objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a13', title: 'System furniture in space planning (Phase 2)',        priority: true,  effort: 'L',  impact: 'High', tags: ['Joint','Seamless'],                              cardNumber: 13, objectiveId: 'obj1', objectiveName: 'Connect' },
  { id: 'a14', title: 'Customer Space Planning migration (Phase 2)',         priority: true,  effort: 'L',  impact: 'High', tags: ['Joint','Seamless'],                              cardNumber: 14, objectiveId: 'obj1', objectiveName: 'Connect' },
  // ── Objective 2: Build ───────────────────────────────────────────────────────
  { id: 'a15', title: 'One unified 3D ecosystem (product & rendering)',      priority: true,  effort: 'XL', impact: 'High', tags: ['GP28','Transformation','Inter','3D Pipeline'],   cardNumber: 15, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a16', title: 'Harmonised product information & relations backend',  priority: true,  effort: 'L',  impact: 'Med',  tags: ['Inter','Ingka'],                                 cardNumber: 16, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a17', title: 'Standardised data sharing between Ingka and Inter',   priority: true,  effort: 'L',  impact: 'Med',  tags: ['Joint'],                                         cardNumber: 17, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a18', title: 'Unified Smart Furnishing platform (Blinka + Smarta)', priority: true,  effort: 'L',  impact: 'Med',  tags: ['Ingka','NextGen'],                               cardNumber: 18, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a19', title: 'AI Interior Design: guided design experience (Decora)', priority: true, effort: 'XL', impact: 'High', tags: ['Ingka','NextGen'],                              cardNumber: 19, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a20', title: 'Home planning AI strategy (gen AI, personalisation)', priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','NextGen'],                               cardNumber: 20, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a21', title: 'Gen AI system planning (METOD kitchen & PAX)',        priority: true,  effort: 'L',  impact: 'High', tags: ['Inter','NextGen'],                               cardNumber: 21, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a22', title: 'Shared Planning Knowledge & Recommendation Platform', priority: true,  effort: 'L',  impact: 'Med',  tags: ['Joint','Inter','Ingka','NextGen'],               cardNumber: 22, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a23', title: 'Harmonise room creation/capture',                     priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','Seamless'],                              cardNumber: 23, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a24', title: 'Visual consistency UI & UX across planning tools',    priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','Seamless'],                              cardNumber: 24, objectiveId: 'obj2', objectiveName: 'Build' },
  { id: 'a25', title: 'Planera (new kitchen planner foundation)',             priority: true,  effort: 'L',  impact: 'High', tags: ['Inter','Seamless'],                              cardNumber: 25, objectiveId: 'obj2', objectiveName: 'Build' },
  // ── Objective 3: Empower ─────────────────────────────────────────────────────
  { id: 'a26', title: 'Commercial Planning replaces Revit for in-store design', priority: true, effort: 'L', impact: 'High', tags: ['Ingka','Inter'],                                cardNumber: 26, objectiveId: 'obj3', objectiveName: 'Empower' },
  { id: 'a27', title: 'Home Planning for Interior Design Services',          priority: false, effort: 'M',  impact: 'High', tags: ['Transformation','Ingka','Inter'],                cardNumber: 27, objectiveId: 'obj3', objectiveName: 'Empower' },
  { id: 'a28', title: 'Harmonised data and analytics capabilities',          priority: true,  effort: 'L',  impact: 'Med',  tags: ['Joint'],                                         cardNumber: 28, objectiveId: 'obj3', objectiveName: 'Empower' },
  { id: 'a29', title: 'Data commercialisation: HFK data as product',        priority: true,  effort: 'M',  impact: 'Med',  tags: ['Joint','Data Product'],                          cardNumber: 29, objectiveId: 'obj3', objectiveName: 'Empower' },
  { id: 'a30', title: 'Co-worker collaboration & planning efficiency tools', priority: false, effort: 'M',  impact: 'Med',  tags: ['Ingka'],                                         cardNumber: 30, objectiveId: 'obj3', objectiveName: 'Empower' },
  { id: 'a31', title: 'Store Planning data tracking',                        priority: false, effort: 'S',  impact: 'Low',  tags: ['Joint'],                                         cardNumber: 31, objectiveId: 'obj3', objectiveName: 'Empower' },
  // ── Objective 4: Govern ──────────────────────────────────────────────────────
  { id: 'a32', title: 'Home Planning Forum: operational from Sep 2026',      priority: false, effort: 'S',  impact: 'Low',  tags: ['Joint'],                                         cardNumber: 32, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a33', title: 'Legal & DAA framework in place',                      priority: false, effort: 'M',  impact: 'High', tags: ['Joint'],                                         cardNumber: 33, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a34', title: 'Integrated FY27 roadmap: visible, current & accessible', priority: false, effort: 'S', impact: 'Med', tags: ['Joint'],                                       cardNumber: 34, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a35', title: 'Architecture North Star: joint capability blueprint', priority: false, effort: 'M',  impact: 'High', tags: ['Joint'],                                         cardNumber: 35, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a36', title: 'Communication package & stakeholder alignment',       priority: false, effort: 'S',  impact: 'Low',  tags: ['Joint'],                                         cardNumber: 36, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a37', title: 'People & Culture: transition & capability building',  priority: false, effort: 'M',  impact: 'Med',  tags: ['Joint'],                                         cardNumber: 37, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a38', title: 'Create a Home Planning Taxonomy',                     priority: false, effort: 'M',  impact: 'Med',  tags: ['Joint'],                                         cardNumber: 38, objectiveId: 'obj4', objectiveName: 'Govern' },
  { id: 'a39', title: 'Establish Home Planning matrix',                      priority: false, effort: 'S',  impact: 'Med',  tags: ['Ingka'],                                         cardNumber: 39, objectiveId: 'obj4', objectiveName: 'Govern' },
]

export const TASK_ITEMS: RoadmapTaskItem[] = [
  // IBD-578 — Home Imagination
  { id: 'miro-1',  title: 'Position instant visualisation across all IKEA touchpoints (PCMP, DCMP, app, social)', source: 'Thilek & team', status: 'roadmap', linkedCards: ['a3','a4','a6'], group: 'IBD-578', stage: 'Exploring' },
  { id: 'miro-2',  title: 'GenAI room generation, style transfer & realistic product rendering',                   source: 'Thilek',        status: 'pending', linkedCards: [],            group: 'IBD-578', stage: 'Exploring' },
  { id: 'miro-3',  title: 'Data bridge: instant visualisation to space planning (import scenes without rework)',  source: 'Thilek',        status: 'pending', linkedCards: ['a3','a4'],   group: 'IBD-578', stage: 'Exploring' },
  { id: 'miro-4',  title: 'Leverage existing IMC showrooms for quick room type visualisation',                    source: 'Team input',    status: 'pending', linkedCards: [],            group: 'IBD-578', stage: 'Exploring' },
  { id: 'miro-5',  title: 'Shared AI infrastructure (MCP, orchestration framework, responsible AI governance)',  source: 'Anand',         status: 'pending', linkedCards: ['a18'],       group: 'IBD-578', stage: 'Exploring' },
  { id: 'miro-6',  title: 'Shared Planning Knowledge & Recommendation Platform (HFK, templates, models)',        source: 'Anand',         status: 'pending', linkedCards: ['a22'],       group: 'IBD-578', stage: 'Exploring' },
  // IBD-653 — Home Planning (customer & co-worker)
  { id: 'miro-7',  title: 'Single shared planning engine for customer & co-worker, shareable design files',      source: 'Thilek',        status: 'roadmap', linkedCards: ['a2','a14'],  group: 'IBD-653', stage: 'Choosing' },
  { id: 'miro-8',  title: 'Embed system furniture in GPC/Kreativ + conversion tracking',                         source: 'Team input',    status: 'roadmap', linkedCards: ['a1','a28'],  group: 'IBD-653', stage: 'Choosing' },
  { id: 'miro-9',  title: 'Continue GPC commercial planning development based on MVP results',                   source: 'Team input',    status: 'roadmap', linkedCards: ['a26'],       group: 'IBD-653', stage: 'Integrating' },
  { id: 'miro-10', title: 'Cross-team integration (Home Projects, Navigation Tool) for customer journey',        source: 'Team input',    status: 'pending', linkedCards: [],            group: 'IBD-653', stage: 'Choosing' },
  { id: 'miro-11', title: 'Construction features to replicate customer home space (walls, windows, structure)',  source: 'Team input',    status: 'pending', linkedCards: ['a9'],        group: 'IBD-653', stage: 'Exploring' },
  { id: 'miro-12', title: 'Shared co-worker collaboration (bundle generators, commenting, remote collab)',       source: 'Team input',    status: 'pending', linkedCards: [],            group: 'IBD-653', stage: 'Integrating' },
  { id: 'miro-13', title: 'AI-powered interior design lead generation for Interior Design Services',             source: 'Daniel',        status: 'roadmap', linkedCards: ['a19'],       group: 'IBD-653', stage: 'Recognising' },
  { id: 'miro-14', title: 'Improve GPC planning accuracy — operations & technical drawings',                     source: 'Daniel',        status: 'pending', linkedCards: ['a26'],       group: 'IBD-653', stage: 'Integrating' },
  { id: 'miro-15', title: 'Improve co-worker journey in Kreativ (quick viz, share designs with end users)',      source: 'Team input',    status: 'roadmap', linkedCards: ['a27'],       group: 'IBD-653', stage: 'Integrating' },
  { id: 'miro-16', title: 'Enable room scanning in system & configuration planners',                             source: 'Team input',    status: 'pending', linkedCards: ['a8'],        group: 'IBD-653', stage: 'Exploring' },
  { id: 'miro-17', title: 'Support new ranges in configuration tools (e.g. INKÖPARE)',                          source: 'Team input',    status: 'pending', linkedCards: ['a10'],       group: 'IBD-653', stage: 'Committing' },
  // IBD-754 — Unified Inter/Ingka collaboration
  { id: 'miro-18', title: 'Common technical standard and data model (Inter + Ingka)',                            source: 'Thilek',        status: 'roadmap', linkedCards: ['a35'],       group: 'IBD-754', stage: 'Living' },
  { id: 'miro-19', title: 'Align FY27–28 roadmaps, define ownership & shared dependencies',                     source: 'Thilek',        status: 'roadmap', linkedCards: ['a34'],       group: 'IBD-754', stage: 'Living' },
  { id: 'miro-20', title: 'Unified global Home Planning North Star + UX framework',                              source: 'Thilek',        status: 'roadmap', linkedCards: ['a35'],       group: 'IBD-754', stage: 'Living' },
  { id: 'miro-21', title: 'Import Rex Planners into GPC for whole-room planning experience',                     source: 'Team input',    status: 'roadmap', linkedCards: ['a1'],        group: 'IBD-754', stage: 'Choosing' },
  { id: 'miro-22', title: 'Shared APIs, integration patterns & home planning topology definition',               source: 'Anand',         status: 'pending', linkedCards: ['a35'],       group: 'IBD-754', stage: 'Living' },
  { id: 'miro-23', title: 'Franchise enablement principles',                                                     source: 'Anand',         status: 'pending', linkedCards: ['a35'],       group: 'IBD-754', stage: 'Living' },
  { id: 'miro-24', title: 'Omni-channel Planning Continuity Platform (cross-device sync, handover)',             source: 'Anand',         status: 'roadmap', linkedCards: ['a3','a4'],   group: 'IBD-754', stage: 'Exploring' },
  { id: 'miro-25', title: 'INTER–INGKA Space Planner & System Configurator Integration (PAX/METOD)',            source: 'Anand',         status: 'roadmap', linkedCards: ['a1','a7'],   group: 'IBD-754', stage: 'Choosing' },
  { id: 'miro-26', title: 'Shared 3D Asset & Design Exchange (IMC as golden source, metadata contracts)',       source: 'Anand',         status: 'roadmap', linkedCards: ['a15'],       group: 'IBD-754', stage: 'Choosing' },
  { id: 'miro-27', title: 'Conversational & Agentic Home Planning Framework',                                   source: 'Anand',         status: 'roadmap', linkedCards: ['a21'],       group: 'IBD-754', stage: 'Choosing' },
  { id: 'miro-28', title: 'Shared Observability, Analytics & Planning Intelligence',                            source: 'Anand',         status: 'roadmap', linkedCards: ['a28','a17'], group: 'IBD-754', stage: 'Receiving' },
  { id: 'miro-29', title: 'Governance, Ownership & Capability Boundaries (forum, joint prioritisation)',        source: 'Anand',         status: 'roadmap', linkedCards: ['a35','a33'], group: 'IBD-754', stage: 'Living' },
]
