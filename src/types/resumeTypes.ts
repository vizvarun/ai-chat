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

export interface JobDescriptionResponse {
  success: boolean;
  jobDescriptionId: string;
  message: string;
}

export interface ResumeProcessingResponse {
  success: boolean;
  resumeId: string;
  fileName: string;
  candidateId: string;
  candidateName: string;
  matchScore: number;
  rank: number;
  overallScore: number;
  resumeSummary: string;
  parsedResume: string;
}

export interface FinalRankingResponse {
  success: boolean;
  message: string;
  rankingCompleted: boolean;
}

export interface ResumeResultRow {
  serialNumber: number;
  fileName: string;
  resumeId?: string;
  candidateId?: string;
  candidateName?: string;
  matchScore?: number;
  rank?: number;
  overallScore?: number;
  resumeSummary?: string;
  parsedResume?: string;
  status: "pending" | "processing" | "completed" | "error";
  error?: string;
}
