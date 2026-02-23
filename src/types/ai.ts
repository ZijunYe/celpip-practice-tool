export interface SpeakingScoreBreakdown {
  content: number;
  coherence: number;
  vocabulary: number;
  grammar: number;
}

export interface SpeakingScoreResult {
  score: number;
  band: number;
  breakdown: SpeakingScoreBreakdown;
  feedback: string;
  improvements: string[];
}

export interface WritingScoreResult {
  score: number;
  band: number;
  breakdown: {
    task_achievement: number;
    organization: number;
    vocabulary: number;
    grammar: number;
  };
  feedback: string;
  grammar_corrections: Array<{
    offset: number;
    length: number;
    message: string;
    suggestion?: string;
  }>;
  improvements: string[];
}
