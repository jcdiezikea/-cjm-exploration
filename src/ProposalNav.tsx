import { useState } from 'react'
import { BASE_POINTS } from './data/journeyData.ts'
import { Intro } from './proposals/Intro.tsx'
import { P5ServiceBlueprint } from './proposals/P5ServiceBlueprint.tsx'
import { P8RoleDashboard } from './proposals/P8RoleDashboard.tsx'
import { P13ScrollStory } from './proposals/P13ScrollStory.tsx'
import { P10Heatmap } from './proposals/P10Heatmap.tsx'
import { P11EmotionCurvePhases } from './proposals/P11EmotionCurvePhases.tsx'
import { Others } from './proposals/Others.tsx'
import { Survey } from './proposals/Survey.tsx'
import { StageDrawer } from './components/StageDrawer.tsx'
import { ChatPanel } from './components/ChatPanel.tsx'
import { ADMIN_PASSWORD } from './components/surveyConfig.ts'

const PROPOSALS = [
  { id: 1, label: 'P1 · Service Blueprint', component: P5ServiceBlueprint },
  { id: 2, label: 'P2 · Role Dashboard', component: P8RoleDashboard },
  { id: 3, label: 'P3 · Heatmap', component: P10Heatmap },
  { id: 4, label: 'P4 · Phase Filters', component: P11EmotionCurvePhases },
  { id: 5, label: 'P5 · Story', component: P13ScrollStory },
  { id: 6, label: 'Others', component: Others },
  { id: 7, label: '📋 Survey', component: Survey },
]

function OthersGate() {
  const [pw, setPw]       = useState('')
  const [unlocked, setUL] = useState(false)
  const [err, setErr]     = useState(false)

  function tryUnlock() {
    if (pw === ADMIN_PASSWORD) { setUL(true) }
    else { setErr(true) }
  }

  if (unlocked) return <Others points={BASE_POINTS} activeFeatureIds={[]} onStageClick={() => {}} />

  return (
    <div style={{ maxWidth: 320, margin: '4rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🔒</div>
      <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '0 0 0.5rem' }}>This section is password protected</h3>
      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem' }}>Enter the admin password to view the Others archive.</p>
      <input
        type="password" value={pw} autoFocus
        onChange={e => { setPw(e.target.value); setErr(false) }}
        onKeyDown={e => e.key === 'Enter' && tryUnlock()}
        placeholder="Password"
        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8, boxSizing: 'border-box', border: `1.5px solid ${err ? '#e53e3e' : '#e2e8f0'}`, fontSize: '0.9rem', marginBottom: '0.5rem' }}
      />
      {err && <p style={{ color: '#e53e3e', fontSize: '0.78rem', margin: '0 0 0.5rem' }}>Incorrect password</p>}
      <button
        onClick={tryUnlock}
        style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', background: '#111', color: '#ffc800', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
      >
        Unlock
      </button>
    </div>
  )
}

export function ProposalNav() {
  const [started, setStarted] = useState(false)
  const [active, setActive] = useState(0)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const proposal = PROPOSALS.find((p) => p.id === active)

  function handleStart() {
    setStarted(true)
    setActive(1)
  }

  return (
    <div className={active === 0 ? undefined : 'nav-shell'}>
      <nav className="proposal-nav">
        <button
          type="button"
          className={active === 0 ? 'active' : ''}
          onClick={() => setActive(0)}
        >
          🏠 Intro
        </button>
        {started && PROPOSALS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={active === p.id ? 'active' : ''}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </nav>

      {active === 0 ? (
        <Intro onStart={handleStart} />
      ) : proposal ? (
        <div className="proposal-body">
          {proposal.id === 6 ? (
            <OthersGate />
          ) : (
            <proposal.component
              points={BASE_POINTS}
              activeFeatureIds={[]}
              onStageClick={setSelectedStage}
            />
          )}
        </div>
      ) : null}

      <StageDrawer stageName={selectedStage} onClose={() => setSelectedStage(null)} />
      <ChatPanel />
    </div>
  )
}
