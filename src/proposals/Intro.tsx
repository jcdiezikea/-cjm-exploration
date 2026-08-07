import Button from '@ingka/button'
import InlineMessage from '@ingka/inline-message'

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="intro-page">
      <div className="intro-hero">
        <span className="intro-kicker">IKEA · Home Planning Journey · FY27</span>
        <h1 className="intro-heading">
          Exploring the Customer<br />Journey Map FY27
        </h1>
        <p className="intro-sub">
          Five different ways to visualise and navigate the same data — each designed to
          surface a different angle of the customer experience. Browse them, compare them,
          and decide which format works best for your needs.
        </p>
      </div>

      <div className="intro-cards">
        <div className="intro-card">
          <span className="intro-card-num">P1</span>
          <div>
            <strong>Service Blueprint</strong>
            <p>A swimlane table mapping customer actions, touchpoints, and co-worker support across every stage.</p>
          </div>
        </div>
        <div className="intro-card">
          <span className="intro-card-num">P2</span>
          <div>
            <strong>Role Dashboard</strong>
            <p>Filter the journey by organisational role to see which stages each team owns.</p>
          </div>
        </div>
        <div className="intro-card">
          <span className="intro-card-num">P3</span>
          <div>
            <strong>Heatmap</strong>
            <p>A satisfaction heatmap that highlights pain points and high-performance moments at a glance.</p>
          </div>
        </div>
        <div className="intro-card">
          <span className="intro-card-num">P4</span>
          <div>
            <strong>Phase Filters</strong>
            <p>Emotion curves for customers and co-workers, with backlog horizon pills that show planned improvements.</p>
          </div>
        </div>
        <div className="intro-card">
          <span className="intro-card-num">P5</span>
          <div>
            <strong>Story</strong>
            <p>A scroll-driven narrative that takes you through each stage of the journey as a visual story.</p>
          </div>
        </div>
      </div>

      <div className="intro-steps">
        <h2 className="intro-steps-heading">How to use this tool</h2>
        <ol className="intro-step-list">
          <li>
            <span className="intro-step-badge">1</span>
            <div>
              <strong>Navigate and explore the variations</strong>
              <p>Use the tabs above to switch between P1 – P5. Each view tells a different story — spend a few minutes in each one.</p>
              <InlineMessage
                variant="cautionary"
                subtle
                className="intro-skapa-msg"
                body={<>Don't just skim — <strong>click, zoom, and interact</strong> with each version. Toggle filters, tap insight cards, and explore the backlog panels to get a real feel for what each format can show you.</>}
              />
              <InlineMessage
                variant="negative"
                subtle
                className="intro-skapa-msg"
                body={<><strong>The data shown throughout this tool is mocked and does not necessarily correspond to reliable or accurate business information.</strong> It is illustrative only — intended to demonstrate the format, not to inform decisions.</>}
              />
            </div>
          </li>
          <li>
            <span className="intro-step-badge">2</span>
            <div>
              <strong>Go to the Survey tab and complete the test</strong>
              <p>Once you've explored the variations, open the <strong>📋 Survey</strong> tab and answer the short questionnaire. Your feedback helps us decide which format to develop further.</p>
            </div>
          </li>
        </ol>
      </div>

      <div className="intro-cta">
        <Button type="primary" text="Start exploring →" onClick={onStart} />
      </div>
    </div>
  )
}
