import type { JourneyPoint } from '../data/journeyData.ts'

export type ProposalProps = {
  points: JourneyPoint[]
  activeFeatureIds: string[]
}
