export interface Candidate {
  name: string;
  matchScore: number;
  summary: string;
  highlights: string[];
  missingSkills: string[];
}

export interface RankedCandidatesResponse {
  rankedCandidates: Candidate[];
}
