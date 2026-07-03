import './App.css'
import { ProposalNav } from './ProposalNav.tsx'
import { SkapaProvider } from './skapa/SkapaProvider.tsx'

function App() {
  return (
    <SkapaProvider>
      <ProposalNav />
    </SkapaProvider>
  )
}

export default App
