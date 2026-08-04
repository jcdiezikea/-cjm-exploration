import { useState } from 'react'
import { SurveyForm } from '../components/SurveyForm.tsx'
import { SurveyAdmin } from '../components/SurveyAdmin.tsx'
import type { ProposalProps } from './types.ts'

export function Survey(_props: ProposalProps) {
  const [showAdmin, setShowAdmin] = useState(false)
  return (
    <div>
      <h2 className="proposal-title">📋 User Survey</h2>
      <p className="proposal-desc">
        Help us understand which views, information types, and visualization styles work best for your role. Takes around 5 minutes.
      </p>
      {showAdmin ? (
        <SurveyAdmin onClose={() => setShowAdmin(false)} />
      ) : (
        <>
          <SurveyForm />
          <div style={{ textAlign: 'center', paddingBottom: '2.5rem' }}>
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                padding: '0.45rem 1.2rem', borderRadius: 8,
                border: '1.5px solid #e2e8f0', background: '#fff',
                color: '#64748b', fontSize: '0.78rem', cursor: 'pointer',
              }}
            >
              🔒 View Results
            </button>
          </div>
        </>
      )}
    </div>
  )
}
