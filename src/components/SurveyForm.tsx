import { useState } from 'react'
import { JSONBIN_KEY, JSONBIN_COLLECTION } from './surveyConfig.ts'

const ROLES   = ['Business stakeholder', 'Design', 'Engineering', 'Roadmap & Planning', 'Other']
const VIEWS   = ['P1 · Service Blueprint', 'P2 · Role Dashboard', 'P3 · Heatmap', 'P4 · Phase Filters', 'P5 · Story']
const STANDOUT = [
  'Clear information hierarchy', 'Team ownership visible', 'Easy to scan at a glance',
  'Tells a story / narrative', 'Actionable for planning decisions',
  'Covers the full customer journey', 'Good for stakeholder presentations',
]
const INFO = [
  'Customer pain points & emotions', 'Team ownership & accountability',
  'System & process layer', 'Backlog & delivery horizons',
  'Business KPIs', 'Co-worker experience', 'Roadmap sequencing',
]
const STYLES  = ['Blueprint / table layout', 'Emotion curves / line charts', 'Heatmap grid', 'Scroll narrative / story', 'Cards & Kanban']
const CONSUME = ['Quick overview dashboard', 'Deep-dive table', 'Story & narrative flow', 'Filtered by my role', 'Chat-based Q&A', 'Exportable report']
const CHAT    = [
  'Ask about a specific journey stage', 'Get a summary of key insights',
  'Explore what-if scenarios', 'Generate a stakeholder report',
  'Navigate to the right view for my needs',
]

type Form = {
  q1Role: string; q1Other: string
  q2Views: string[]
  q2bStandout: string[]; q2bOpen: string
  q3Info: string[]; q3Open: string
  q4Style: string[]; q4bWhy: string
  q5Missing: string
  q6Consume: string[]; q6Open: string
  q7Chat: string[]; q7Open: string
  q8Other: string
}

const EMPTY: Form = {
  q1Role: '', q1Other: '',
  q2Views: [],
  q2bStandout: [], q2bOpen: '',
  q3Info: [], q3Open: '',
  q4Style: [], q4bWhy: '',
  q5Missing: '',
  q6Consume: [], q6Open: '',
  q7Chat: [], q7Open: '',
  q8Other: '',
}

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
  padding: '1.5rem', marginBottom: '1rem',
}
const cardHL: React.CSSProperties = { ...card, borderColor: '#c7d9f5', background: '#f7faff' }
const qLabel: React.CSSProperties = { fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'block' }
const hint: React.CSSProperties   = { fontSize: '0.74rem', color: '#94a3b8', fontWeight: 400, marginLeft: '0.4rem' }
const textarea: React.CSSProperties = {
  width: '100%', marginTop: '0.75rem', padding: '0.6rem 0.75rem',
  borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.82rem',
  color: '#2f3237', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
}

function Chips({ options, selected, onToggle, max }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
      {options.map(o => {
        const on  = selected.includes(o)
        const dim = !on && max !== undefined && selected.length >= max
        return (
          <span
            key={o}
            onClick={() => !dim && onToggle(o)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem',
              border: `1.5px solid ${on ? '#1c4f8f' : '#e2e8f0'}`,
              background: on ? '#1c4f8f' : dim ? '#f8fafc' : '#fff',
              color: on ? '#fff' : dim ? '#cbd5e1' : '#334155',
              cursor: dim ? 'default' : 'pointer', userSelect: 'none', transition: 'all 0.14s',
            }}
          >
            {on && <span style={{ fontSize: '0.62rem' }}>✓</span>}
            {o}
          </span>
        )
      })}
    </div>
  )
}

export function SurveyForm() {
  const [form, setForm]     = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'err'>('idle')

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function toggle(k: 'q2Views' | 'q2bStandout' | 'q3Info' | 'q4Style' | 'q6Consume' | 'q7Chat', v: string, max?: number) {
    setForm(p => {
      const cur = p[k] as string[]
      if (cur.includes(v)) return { ...p, [k]: cur.filter(x => x !== v) }
      if (max && cur.length >= max) return p
      return { ...p, [k]: [...cur, v] }
    })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.q1Role) return
    setStatus('busy')
    try {
      const res = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_KEY,
          'X-Collection-Id': JSONBIN_COLLECTION,
          'X-Bin-Name': `survey-${Date.now()}`,
        },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'done') return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🙏</div>
      <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 0.4rem' }}>Thank you!</h3>
      <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Your response has been recorded.</p>
    </div>
  )

  return (
    <form onSubmit={submit} style={{ maxWidth: 680, margin: '0 auto' }}>

      <div style={card}>
        <span style={qLabel}>1 — What is your role?<span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span></span>
        <Chips options={ROLES} selected={form.q1Role ? [form.q1Role] : []} onToggle={v => set('q1Role', v)} />
        {form.q1Role === 'Other' && (
          <input
            value={form.q1Other} onChange={e => set('q1Other', e.target.value)}
            placeholder="Please specify…"
            style={{ ...textarea, marginTop: '0.75rem', resize: 'none', height: 36 }}
          />
        )}
      </div>

      <div style={card}>
        <span style={qLabel}>2 — Which views are useful to you?<span style={hint}>Select all that apply</span></span>
        <Chips options={VIEWS} selected={form.q2Views} onToggle={v => toggle('q2Views', v)} />
      </div>

      {form.q2Views.length > 0 && (
        <div style={cardHL}>
          <span style={qLabel}>2b — What makes those views stand out?<span style={hint}>Pick up to 3</span></span>
          <Chips options={STANDOUT} selected={form.q2bStandout} onToggle={v => toggle('q2bStandout', v, 3)} max={3} />
          <textarea value={form.q2bOpen} onChange={e => set('q2bOpen', e.target.value)} placeholder="Anything to add…" rows={2} style={textarea} />
        </div>
      )}

      <div style={card}>
        <span style={qLabel}>3 — What information matters most to you?<span style={hint}>Pick up to 3</span></span>
        <Chips options={INFO} selected={form.q3Info} onToggle={v => toggle('q3Info', v, 3)} max={3} />
        <textarea value={form.q3Open} onChange={e => set('q3Open', e.target.value)} placeholder="Anything to add…" rows={2} style={textarea} />
      </div>

      <div style={card}>
        <span style={qLabel}>4 — Which visualization style do you prefer?<span style={hint}>Pick up to 2</span></span>
        <Chips options={STYLES} selected={form.q4Style} onToggle={v => toggle('q4Style', v, 2)} max={2} />
      </div>

      {form.q4Style.length > 0 && (
        <div style={cardHL}>
          <span style={qLabel}>4b — Why does that format work for you?</span>
          <textarea value={form.q4bWhy} onChange={e => set('q4bWhy', e.target.value)} placeholder="Tell us why…" rows={3} style={textarea} />
        </div>
      )}

      <div style={card}>
        <span style={qLabel}>5 — What's the most important information missing from this tool?</span>
        <textarea value={form.q5Missing} onChange={e => set('q5Missing', e.target.value)} placeholder="Missing metrics, views, or context you need…" rows={3} style={textarea} />
      </div>

      <div style={card}>
        <span style={qLabel}>6 — How would you prefer to consume this data?<span style={hint}>Pick up to 2</span></span>
        <Chips options={CONSUME} selected={form.q6Consume} onToggle={v => toggle('q6Consume', v, 2)} max={2} />
        <textarea value={form.q6Open} onChange={e => set('q6Open', e.target.value)} placeholder="Anything to add…" rows={2} style={textarea} />
      </div>

      <div style={card}>
        <span style={qLabel}>7 — How would you use the conversational assistant?<span style={hint}>Select all that apply</span></span>
        {/* Drop a screenshot at public/chat-preview.png to populate this preview */}
        <img
          src="/chat-preview.png"
          alt="Conversational assistant preview"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          style={{ width: '100%', maxWidth: 480, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: '0.75rem', display: 'block' }}
        />
        <Chips options={CHAT} selected={form.q7Chat} onToggle={v => toggle('q7Chat', v)} />
        <textarea value={form.q7Open} onChange={e => set('q7Open', e.target.value)} placeholder="Describe how you'd use it…" rows={2} style={textarea} />
      </div>

      <div style={card}>
        <span style={qLabel}>8 — Anything else you'd add or change?<span style={hint}>Optional</span></span>
        <textarea value={form.q8Other} onChange={e => set('q8Other', e.target.value)} placeholder="Open feedback…" rows={3} style={textarea} />
      </div>

      {status === 'err' && (
        <p style={{ color: '#e53e3e', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          Submission failed — check your network and JSONBin credentials in surveyConfig.ts.
        </p>
      )}

      <button
        type="submit"
        disabled={!form.q1Role || status === 'busy'}
        style={{
          width: '100%', padding: '0.8rem', borderRadius: 10, border: 'none',
          background: form.q1Role ? '#1c4f8f' : '#e2e8f0',
          color: form.q1Role ? '#fff' : '#94a3b8',
          fontSize: '0.9rem', fontWeight: 700,
          cursor: form.q1Role ? 'pointer' : 'default',
          transition: 'all 0.15s', marginBottom: '2rem',
        }}
      >
        {status === 'busy' ? 'Submitting…' : 'Submit →'}
      </button>
    </form>
  )
}
