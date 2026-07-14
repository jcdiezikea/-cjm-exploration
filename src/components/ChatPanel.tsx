import { useState, useRef, useEffect } from 'react'
import {
  STAGE_METRICS, STAGES, BACKLOG_ITEMS, FEATURES, cjmOf, CJM_STAGES,
  type StageMetrics, type BacklogItem,
} from '../data/journeyData.ts'
import { ALL_ACTIVITIES, type RoadmapActivity } from '../data/roadmapData.ts'

// ── Text renderer ─────────────────────────────────────────────────────────────
function renderText(text: string) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <span
        key={i}
        style={{ display: 'block', ...(line === '' && i < arr.length - 1 ? { marginTop: '0.4rem' } : {}) }}
      >
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p,
        )}
      </span>
    )
  })
}

// ── Response engine ───────────────────────────────────────────────────────────
const fmt = (n: number) => `${n > 0 ? '+' : ''}${n}`

function metricRow(m: StageMetrics) {
  return `NPS ${fmt(m.nps)} · Conv ${m.conversion}% · Drop-off ${m.dropOff}% · Effort ${m.effort}/10`
}

function actList(acts: RoadmapActivity[]) {
  return acts.map((a) => `• ${a.title} [${a.effort} · ${a.impact}${a.priority ? ' · ✓' : ''}]`).join('\n')
}

function backlogList(items: BacklogItem[]) {
  return items.map((i) => `• **${i.stage}** — ${i.title} [${i.horizon} · ${i.storyPoints}sp]`).join('\n')
}

function answer(question: string): string {
  const q = question.toLowerCase().trim()
  const mentionedStages = CJM_STAGES.filter((s) => q.includes(s.toLowerCase()))
  const stage = mentionedStages[0] ?? null

  // ── Help ────────────────────────────────────────────────────────────────────
  if (/^(help|what can you|what do you know|commands?)/.test(q)) {
    return `I can answer questions about the **FY27 Home Planning journey**. Try:\n\n` +
      `• "Give me an executive summary"\n` +
      `• "What are the quick wins?"\n` +
      `• "What's in the T1 backlog?"\n` +
      `• "Tell me about the Choosing stage"\n` +
      `• "Compare Exploring and Choosing"\n` +
      `• "Which stage has the most activities?"\n` +
      `• "What activities are tagged NextGen?"\n` +
      `• "What are the pain points?"\n` +
      `• "Which stage has the highest drop-off?"`
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  if (/\b(summary|overview|exec|tell me|explain|whole|full journey|about the data)\b/.test(q)) {
    const sorted = [...STAGE_METRICS].sort((a, b) => b.nps - a.nps)
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]
    const t1 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T1').length
    const high = ALL_ACTIVITIES.filter((a) => a.impact === 'High').length
    return `**FY27 Home Planning Journey — Executive Summary**\n\n` +
      `${ALL_ACTIVITIES.length} activities across **7 stages** map Ingka × Inter FY27 planning work.\n\n` +
      `• **Strongest stage:** ${best.stage} (NPS ${fmt(best.nps)}, ${best.conversion}% conversion)\n` +
      `• **Most at-risk:** ${worst.stage} (NPS ${fmt(worst.nps)}, ${worst.dropOff}% drop-off)\n` +
      `• **High-impact activities:** ${high}/${ALL_ACTIVITIES.length} (${Math.round((high / ALL_ACTIVITIES.length) * 100)}%)\n` +
      `• **Current sprint (T1):** ${t1} of ${BACKLOG_ITEMS.length} backlog items\n\n` +
      `**Choosing** is the busiest stage (${STAGES.find((s) => s.name === 'Choosing')?.weight} activities) covering 3D ecosystem, Kitchen Planner, and space planning. **Living** handles governance — joint forum, DAA, and architecture alignment.`
  }

  // ── Quick wins ──────────────────────────────────────────────────────────────
  if (/\b(quick win|easy win|low.{0,8}effort|bang.{0,10}buck|low.{0,8}hang)\b/.test(q)) {
    const qws = ALL_ACTIVITIES.filter((a) => a.impact === 'High' && (a.effort === 'S' || a.effort === 'M'))
    if (qws.length === 0) return 'No High-impact, S/M-effort activities found in the current dataset.'
    return `**Quick wins** — High impact at S or M effort (${qws.length} found):\n\n` +
      qws.map((a) => `• **${cjmOf(a)}** — ${a.title} [${a.effort} effort]`).join('\n')
  }

  // ── Pain points ─────────────────────────────────────────────────────────────
  if (/\b(pain|pains|pain point|low.{0,8}impact|problem|friction)\b/.test(q) && !stage) {
    const pains = ALL_ACTIVITIES.filter((a) => a.impact === 'Low')
    return pains.length === 0
      ? 'No Low-impact activities in the current dataset.'
      : `**Low-impact activities** (${pains.length} pain points):\n\n` +
          pains.map((a) => `• **${cjmOf(a)}** — ${a.title} [${a.effort} effort]`).join('\n')
  }

  // ── Most at-risk ────────────────────────────────────────────────────────────
  if (/\b(at.{0,5}risk|worst|most.{0,8}risk|failing|danger)\b/.test(q) && !stage) {
    const worst = [...STAGE_METRICS].sort((a, b) => a.nps - b.nps)[0]
    const acts = ALL_ACTIVITIES.filter((a) => cjmOf(a) === worst.stage)
    return `**Most at-risk: ${worst.stage}**\n\n${metricRow(worst)}\n\n` +
      `${acts.length} activities · ${acts.filter((a) => a.priority).length} prioritised\n\n` +
      actList(acts.slice(0, 5))
  }

  // ── Best stage ──────────────────────────────────────────────────────────────
  if (/\b(best|highest nps|strongest|top.{0,8}stage|performing well)\b/.test(q) && !stage) {
    const best = [...STAGE_METRICS].sort((a, b) => b.nps - a.nps)[0]
    const acts = ALL_ACTIVITIES.filter((a) => cjmOf(a) === best.stage && a.impact === 'High')
    return `**Best performing: ${best.stage}**\n\n${metricRow(best)}\n\nTop High-impact activities:\n` + actList(acts.slice(0, 4))
  }

  // ── Conversion ──────────────────────────────────────────────────────────────
  if (/\bconversion\b/.test(q) && !stage) {
    const sorted = [...STAGE_METRICS].sort((a, b) => b.conversion - a.conversion)
    return `**Conversion by stage:**\n\n` + sorted.map((m) => `• ${m.stage}: ${m.conversion}% conv · ${m.dropOff}% drop-off`).join('\n')
  }

  // ── Drop-off ────────────────────────────────────────────────────────────────
  if (/\bdrop.?off\b/.test(q) && !stage) {
    const sorted = [...STAGE_METRICS].sort((a, b) => b.dropOff - a.dropOff)
    return `**Drop-off rates (worst first):**\n\n` +
      sorted.map((m) => `• ${m.stage}: ${m.dropOff}%${m.dropOff > 50 ? ' ⚠' : ''}`).join('\n')
  }

  // ── Effort ──────────────────────────────────────────────────────────────────
  if (/\beffort\b/.test(q) && !stage) {
    const sorted = [...STAGE_METRICS].sort((a, b) => b.effort - a.effort)
    return `**Effort scores by stage:**\n\n` + sorted.map((m) => `• ${m.stage}: ${m.effort}/10`).join('\n')
  }

  // ── Horizon T1/T2/T3 ────────────────────────────────────────────────────────
  const horizons = [
    { h: 'T1', label: 'this quarter (T1)', pat: /\bt1\b|this quarter|now|current sprint/ },
    { h: 'T2', label: 'next quarter (T2)',  pat: /\bt2\b|next quarter|next sprint/ },
    { h: 'T3', label: 'future (T3)',         pat: /\bt3\b|future|later|long.term/ },
  ]
  for (const { h, label, pat } of horizons) {
    if (pat.test(q)) {
      const items = BACKLOG_ITEMS.filter((b) => b.horizon === h)
      return `**${h} backlog** — ${label} (${items.length} items):\n\n` + backlogList(items)
    }
  }

  // ── Activity counts ──────────────────────────────────────────────────────────
  if (/most activit|most work|busiest stage/.test(q)) {
    const top = [...STAGES].sort((a, b) => b.weight - a.weight)[0]
    return `**${top.name}** has the most activities (${top.weight}).\n\nAll stages:\n` +
      [...STAGES].sort((a, b) => b.weight - a.weight).map((s) => `• ${s.name}: ${s.weight}`).join('\n')
  }

  if (/fewest activit|least work|least.{0,10}stage|under.?resourc/.test(q)) {
    const min = Math.min(...STAGES.map((s) => s.weight))
    const gaps = STAGES.filter((s) => s.weight === min)
    return `**${gaps.map((s) => s.name).join(' and ')}** have the fewest activities (${min} each).\n\nFull breakdown:\n` +
      [...STAGES].sort((a, b) => a.weight - b.weight).map((s) => `• ${s.name}: ${s.weight}`).join('\n')
  }

  // ── How many ────────────────────────────────────────────────────────────────
  if (/\bhow many\b/.test(q)) {
    if (/activit/.test(q) && !stage) {
      return `**Activity counts by stage:**\n\n` + STAGES.map((s) => `• ${s.name}: ${s.weight}`).join('\n') +
        `\n\nTotal: **${ALL_ACTIVITIES.length}** across 4 FY27 objectives.`
    }
    if (/backlog|item/.test(q) && !stage) {
      const t1 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T1').length
      const t2 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T2').length
      const t3 = BACKLOG_ITEMS.filter((b) => b.horizon === 'T3').length
      return `**Backlog counts:**\n\n• T1 (now): ${t1}\n• T2 (next): ${t2}\n• T3 (future): ${t3}\n• Total: ${BACKLOG_ITEMS.length}`
    }
    if (/high.{0,8}impact/.test(q)) {
      const n = ALL_ACTIVITIES.filter((a) => a.impact === 'High').length
      return `**${n}** of ${ALL_ACTIVITIES.length} activities are High-impact (${Math.round((n / ALL_ACTIVITIES.length) * 100)}%).`
    }
    if (/priorit/.test(q)) {
      const n = ALL_ACTIVITIES.filter((a) => a.priority).length
      return `**${n}** of ${ALL_ACTIVITIES.length} activities are marked priority (${Math.round((n / ALL_ACTIVITIES.length) * 100)}%).`
    }
  }

  // ── Compare two stages ───────────────────────────────────────────────────────
  if (/\bcompare\b/.test(q) && mentionedStages.length >= 2) {
    const [s1, s2] = mentionedStages.slice(0, 2)
    const m1 = STAGE_METRICS.find((m) => m.stage === s1)!
    const m2 = STAGE_METRICS.find((m) => m.stage === s2)!
    const a1 = ALL_ACTIVITIES.filter((a) => cjmOf(a) === s1).length
    const a2 = ALL_ACTIVITIES.filter((a) => cjmOf(a) === s2).length
    const winner = m1.nps > m2.nps ? s1 : m2.nps > m1.nps ? s2 : null
    return `**${s1} vs ${s2}**\n\n` +
      `• NPS: ${fmt(m1.nps)} vs ${fmt(m2.nps)}\n` +
      `• Conversion: ${m1.conversion}% vs ${m2.conversion}%\n` +
      `• Drop-off: ${m1.dropOff}% vs ${m2.dropOff}%\n` +
      `• Effort: ${m1.effort}/10 vs ${m2.effort}/10\n` +
      `• Activities: ${a1} vs ${a2}\n\n` +
      (winner ? `**${winner}** scores higher on NPS.` : 'Both stages have an equal NPS.')
  }

  // ── Tag queries ──────────────────────────────────────────────────────────────
  const tagMap: [RegExp, string][] = [
    [/\bnext.?gen\b|gen ai|generative ai/,    'NextGen'],
    [/\bseamless\b/,                           'Seamless'],
    [/\b3d.?pipeline\b|3d ecosystem/,          '3D Pipeline'],
    [/\bingka\b/,                              'Ingka'],
    [/\binter\b|inter.?ikea/,                  'Inter'],
    [/\bjoint\b/,                              'Joint'],
    [/\btransformation\b/,                     'Transformation'],
    [/\bboost\b/,                              'Boost'],
  ]
  for (const [pat, tag] of tagMap) {
    if (pat.test(q)) {
      const tagged = ALL_ACTIVITIES.filter((a) => a.tags.includes(tag))
      return `**Activities tagged "${tag}"** (${tagged.length}):\n\n` +
        tagged.map((a) => `• **${cjmOf(a)}** — ${a.title} [${a.effort} · ${a.impact}]`).join('\n')
    }
  }

  // ── Feature toggles ──────────────────────────────────────────────────────────
  if (/\bfeature|toggle|seamless planning|nextgen ai|3d pipeline\b/.test(q)) {
    return `**Feature toggles** (3 available in the top bar):\n\n` +
      FEATURES.map((f) => `• **${f.name}** — ${f.description} (shifts ${Object.keys(f.pointChanges).length} activities)`).join('\n') +
      `\n\nToggle them in the feature bar above the proposals to see before/after in the emotion curves.`
  }

  // ── Specific stage ───────────────────────────────────────────────────────────
  if (stage) {
    const m = STAGE_METRICS.find((sm) => sm.stage === stage)!
    const acts = ALL_ACTIVITIES.filter((a) => cjmOf(a) === stage)
    const bl = BACKLOG_ITEMS.filter((b) => b.stage === stage)
    const t1 = bl.filter((b) => b.horizon === 'T1').length
    const hi = acts.filter((a) => a.impact === 'High')

    if (/\bactivit/.test(q))    return `**Activities in ${stage}** (${acts.length}):\n\n` + actList(acts)
    if (/\bbacklog|item|work\b/.test(q)) return `**Backlog for ${stage}** (${bl.length} items):\n\n` + backlogList(bl)
    if (/\bmetric|nps|kpi\b/.test(q)) return `**${stage} metrics**\n\n${metricRow(m)}`

    return `**${stage}**\n\n` +
      `${metricRow(m)}\n\n` +
      `${acts.length} activit${acts.length === 1 ? 'y' : 'ies'} · ${hi.length} High-impact · ${bl.length} backlog items (${t1} in T1)\n\n` +
      (hi.length > 0
        ? `High-impact activities:\n` + actList(hi.slice(0, 5))
        : `Activities:\n` + actList(acts.slice(0, 5)))
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  return `I'm not sure how to answer that from the available data. Type **help** to see what I can answer, or try asking about a specific stage like "Tell me about Choosing" or "What's in T1?"`
}



// ── Gemini integration ────────────────────────────────────────────────────────
function buildSystemPrompt(): string {
  const actLines = ALL_ACTIVITIES.map((a) =>
    `${a.id}|${a.title}|stage:${cjmOf(a)}|effort:${a.effort}|impact:${a.impact}|priority:${a.priority}|objective:${a.objectiveName}|tags:${a.tags.join(',')}`
  ).join('\n')
  const metricLines = STAGE_METRICS.map((m) =>
    `${m.stage}: NPS=${m.nps}, conv=${m.conversion}%, dropOff=${m.dropOff}%, effort=${m.effort}/10`
  ).join('\n')
  const backlogLines = BACKLOG_ITEMS.map((b) =>
    `[${b.horizon}] ${b.stage} — ${b.title} (${b.storyPoints}sp)`
  ).join('\n')
  const featureLines = FEATURES.map((f) => `${f.name}: ${f.description}`).join('\n')
  return `You are an AI assistant embedded in an IKEA FY27 Home Planning CJM visualisation tool.
Answer questions about the data concisely. Use **bold** for emphasis. Keep answers under 300 words.
Stages: ${CJM_STAGES.join(' → ')}
Stage metrics:\n${metricLines}
Activities (${ALL_ACTIVITIES.length}):\n${actLines}
Backlog (${BACKLOG_ITEMS.length}):\n${backlogLines}
Features:\n${featureLines}`
}

type GeminiContent = { role: string; parts: { text: string }[] }

async function askGemini(history: { role: 'user' | 'bot'; text: string }[], key: string): Promise<string> {
  const contents: GeminiContent[] = history
    .slice(1).slice(-12)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))

  // API key (AIzaSy…) → query param; anything else → OAuth Bearer header
  const isApiKey = key.startsWith('AIzaSy')
  const url = isApiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`
    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!isApiKey) headers['Authorization'] = `Bearer ${key}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      contents,
      generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}) as Record<string, unknown>) as { error?: { message?: string } }
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`)
  }
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

// ── Suggested prompts ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'Executive summary',
  'Quick wins',
  'T1 backlog',
  'Most at-risk stage',
  'Tell me about Choosing',
  'Compare Exploring and Choosing',
  'Activities tagged NextGen',
  'Highest drop-off',
]

// ── Component ─────────────────────────────────────────────────────────────────
type Msg = { role: 'user' | 'bot'; text: string }

export function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [apiKey] = useState<string>(() => localStorage.getItem('gemini-api-key') ?? '')
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: 'Hi! Ask me anything about the **FY27 Home Planning** journey — stages, activities, backlog, metrics, or comparisons. Type **help** for example questions.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(text: string) {
    const t = text.trim()
    if (!t || isLoading) return
    const newMessages: Msg[] = [...messages, { role: 'user', text: t }]
    setMessages(newMessages)
    setInput('')
    if (apiKey) {
      setIsLoading(true)
      try {
        const reply = await askGemini(newMessages, apiKey)
        setMessages([...newMessages, { role: 'bot', text: reply }])
      } catch (e) {
        const fallback = `⚠️ **Gemini error:** ${(e as Error).message}\n\nFalling back:\n\n${answer(t)}`
        setMessages([...newMessages, { role: 'bot', text: fallback }])
      } finally {
        setIsLoading(false)
      }
    } else {
      setMessages([...newMessages, { role: 'bot', text: answer(t) }])
    }
  }

  const isFirstMessage = messages.length === 1

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title={open ? 'Close' : 'Ask about the data'}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 60,
          width: 48, height: 48,
          background: open ? '#374151' : '#111',
          color: '#fff', border: 'none', borderRadius: '50%',
          fontSize: '1.25rem', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, transform 0.15s',
        }}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Panel */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(1.5rem + 56px)',
        right: '1.5rem',
        zIndex: 60,
        width: 390,
        maxHeight: 520,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transformOrigin: 'bottom right',
        transform: open ? 'scale(1)' : 'scale(0.92)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s',
      }}>
        {/* Header */}
        <div style={{ background: '#111', color: '#fff', padding: '0.7rem 1rem', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>💬 Ask the data</div>
          <div style={{ fontSize: '0.62rem', color: apiKey ? '#4ade80' : '#888', marginTop: 1 }}>
            {apiKey ? 'FY27 Home Planning · Gemini AI active' : 'FY27 Home Planning · rule-based'}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '88%',
                padding: '0.55rem 0.8rem',
                borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: msg.role === 'user' ? '#1c4f8f' : '#f0f4f8',
                color: msg.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: '0.72rem',
                lineHeight: 1.55,
              }}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {isLoading && (
          <div style={{ padding: '0 0.75rem 0.4rem', display: 'flex' }}>
            <div style={{ padding: '0.45rem 0.8rem', borderRadius: '14px 14px 14px 3px', background: '#f0f4f8', fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic' }}>
              Thinking…
            </div>
          </div>
        )}
        {isFirstMessage && (
          <div style={{ padding: '0 0.75rem 0.6rem', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  background: 'none',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  padding: '2px 9px',
                  fontSize: '0.64rem',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'border-color 0.1s',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display: 'flex', padding: '0.55rem 0.6rem', borderTop: '1px solid var(--line)', gap: 6, flexShrink: 0 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask about stages, activities, backlog…"
            disabled={isLoading}
            style={{
              flex: 1, border: '1px solid var(--line)', borderRadius: 8,
              padding: '0.45rem 0.7rem', fontSize: '0.72rem',
              background: '#f8fafc', outline: 'none',
              fontFamily: 'inherit',
              opacity: isLoading ? 0.5 : 1,
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            style={{
              background: '#1c4f8f', color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '0 0.85rem', fontSize: '0.9rem',
              cursor: (input.trim() && !isLoading) ? 'pointer' : 'default',
              opacity: (input.trim() && !isLoading) ? 1 : 0.35,
              transition: 'opacity 0.15s',
            }}
          >
            →
          </button>
        </div>
      </div>
    </>
  )
}
