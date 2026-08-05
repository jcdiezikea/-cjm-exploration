import { useState } from 'react'
import { JSONBIN_KEY, JSONBIN_COLLECTION, ADMIN_PASSWORD } from './surveyConfig.ts'

type Response = {
  name: string
  q1Role: string; q1Other: string
  q2Views: string[]; q2None: boolean; q2Open: string
  q2bStandout: string[]; q2bOpen: string
  q3Info: string[]; q3Open: string
  q4Style: string[]; q4Open: string; q4bWhy: string
  q5Missing: string
  q6Consume: string[]; q6Open: string
  q6bChatRating: number | null
  q7Chat: string[]; q7Open: string
  q8Other: string
  submittedAt: string
}

function counts(responses: Response[], key: keyof Response): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of responses) {
    const v = r[key]
    const items = Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []
    for (const item of items) out[item] = (out[item] ?? 0) + 1
  }
  return out
}

function sorted(obj: Record<string, number>): [string, number][] {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])
}

function BarChart({ data, total }: { data: Record<string, number>; total: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {sorted(data).map(([label, n]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: '#334155', minWidth: 230, flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, height: 16, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(n / total) * 100}%`, minWidth: n > 0 ? 4 : 0, height: '100%', background: '#1c4f8f', borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', minWidth: 20, textAlign: 'right' }}>{n}</span>
        </div>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {title}
      </h4>
      {children}
    </div>
  )
}

export function SurveyAdmin({ onClose }: { onClose: () => void }) {
  const [pw, setPw]         = useState('')
  const [unlocked, unlock]  = useState(false)
  const [pwErr, setPwErr]   = useState(false)
  const [responses, setRes] = useState<Response[]>([])
  const [loading, setLoad]  = useState(false)
  const [fetchErr, setFErr] = useState(false)

  async function tryUnlock() {
    if (pw !== ADMIN_PASSWORD) { setPwErr(true); return }
    unlock(true)
    setLoad(true)
    try {
      const listRes  = await fetch(`https://api.jsonbin.io/v3/c/${JSONBIN_COLLECTION}/bins`, {
        headers: { 'X-Master-Key': JSONBIN_KEY },
      })
      const listData = await listRes.json()
      // API returns a bare array, not { result: [] }
      const items = Array.isArray(listData) ? listData : (listData.result ?? [])
      const ids: string[] = items.map((b: { record: string }) => b.record)
      const bins = await Promise.all(
        ids.map(id =>
          fetch(`https://api.jsonbin.io/v3/b/${id}`, { headers: { 'X-Master-Key': JSONBIN_KEY } })
            .then(r => r.json())
            .then(d => d.record as Response)
        )
      )
      setRes(bins)
    } catch {
      setFErr(true)
    } finally {
      setLoad(false)
    }
  }

  if (!unlocked) return (
    <div style={{ maxWidth: 340, margin: '3rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🔒</div>
      <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '0 0 1rem' }}>Admin access</h3>
      <input
        type="password" value={pw} autoFocus
        onChange={e => { setPw(e.target.value); setPwErr(false) }}
        onKeyDown={e => e.key === 'Enter' && tryUnlock()}
        placeholder="Password"
        style={{
          width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, boxSizing: 'border-box',
          border: `1.5px solid ${pwErr ? '#e53e3e' : '#e2e8f0'}`, fontSize: '0.9rem', marginBottom: '0.5rem',
        }}
      />
      {pwErr && <p style={{ color: '#e53e3e', fontSize: '0.78rem', margin: '0 0 0.5rem' }}>Incorrect password</p>}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={tryUnlock} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', background: '#1c4f8f', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
          Unlock
        </button>
        <button onClick={onClose} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading responses…</div>

  if (fetchErr) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#e53e3e' }}>
      <p>Failed to load — check JSONBin credentials in surveyConfig.ts.</p>
      <button onClick={onClose} style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', background: '#fff' }}>Back</button>
    </div>
  )

  if (responses.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
      <p>No responses yet.</p>
      <button onClick={onClose} style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', background: '#fff' }}>Back</button>
    </div>
  )

  const total = responses.length
  const openFields: { q: string; field: keyof Response }[] = [
    { q: 'Views open (Q2)',                field: 'q2Open'   },
    { q: 'What makes views stand out (Q2)', field: 'q2bOpen' },
    { q: 'Most important information (Q3)', field: 'q3Open'  },
    { q: 'Why that format (Q4)',            field: 'q4Open'  },
    { q: 'Missing information (Q5)',        field: 'q5Missing'},
    { q: 'Consumption preference (Q6)',     field: 'q6Open'  },
    { q: 'Chat assistant usage (Q8)',       field: 'q7Open'  },
    { q: 'Other feedback (Q9)',             field: 'q8Other' },
  ]
  const comments = openFields.flatMap(({ q, field }) =>
    responses
      .filter(r => typeof r[field] === 'string' && (r[field] as string).trim())
      .map(r => ({ q, answer: r[field] as string, role: r.q1Role || '—', name: r.name || '—' }))
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Survey Results</h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{total} response{total !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={onClose} style={{ padding: '0.4rem 0.9rem', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      <Section title="Respondents">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {responses.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155', padding: '0.3rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 700, minWidth: 160 }}>{r.name || '(anonymous)'}</span>
              <span style={{ color: '#64748b' }}>{r.q1Role || '—'}</span>
              <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.68rem' }}>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : ''}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Roles">
        <BarChart data={counts(responses, 'q1Role')} total={total} />
      </Section>
      <Section title="Most useful views (Q2)">
        <BarChart data={counts(responses, 'q2Views')} total={total} />
      </Section>
      <Section title="What makes views stand out (Q2b)">
        <BarChart data={counts(responses, 'q2bStandout')} total={total} />
      </Section>
      <Section title="Information that matters most (Q3)">
        <BarChart data={counts(responses, 'q3Info')} total={total} />
      </Section>
      <Section title="Preferred visualization style (Q4)">
        <BarChart data={counts(responses, 'q4Style')} total={total} />
      </Section>
      <Section title="Preferred consumption mode (Q6)">
        <BarChart data={counts(responses, 'q6Consume')} total={total} />
      </Section>
      <Section title="Chat assistant usefulness rating (Q7)">
        {(() => {
          const ratings = responses.map(r => r.q6bChatRating).filter((n): n is number => n != null)
          if (ratings.length === 0) return <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>No ratings yet.</p>
          const avg = (ratings.reduce((s, n) => s + n, 0) / ratings.length).toFixed(1)
          const dist: Record<string, number> = {}
          ratings.forEach(n => { dist[String(n)] = (dist[String(n)] ?? 0) + 1 })
          return (
            <>
              <p style={{ fontSize: '0.88rem', color: '#1e293b', margin: '0 0 0.75rem' }}>Average: <strong>{avg} / 7</strong> ({ratings.length} rating{ratings.length !== 1 ? 's' : ''})</p>
              <BarChart data={dist} total={ratings.length} />
            </>
          )
        })()}
      </Section>
      <Section title="Conversational assistant usage (Q8)">
        <BarChart data={counts(responses, 'q7Chat')} total={total} />
      </Section>

      {comments.length > 0 && (
        <Section title="Open comments">
          {comments.map((c, i) => (
            <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>
                {c.q} · {c.name} ({c.role})
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155' }}>{c.answer}</div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
