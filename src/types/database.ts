export type WritingTaskType = "task1_email" | "task2_survey";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SpeakingSession {
  id: string;
  user_id: string;
  question_text: string;
  transcript: string | null;
  audio_url: string | null;
  score: number | null;
  feedback: string | null;
  created_at: string;
}

export interface WritingSession {
  id: string;
  user_id: string;
  task_type: WritingTaskType;
  question_text: string;
  answer_text: string;
  score: number | null;
  feedback: string | null;
  grammar_corrections: GrammarCorrection[] | null;
  created_at: string;
}

export interface GrammarCorrection {
  offset: number;
  length: number;
  message: string;
  suggestion?: string;
}

export interface PracticeStats {
  id: string;
  user_id: string;
  total_speaking_attempts: number;
  total_writing_attempts: number;
  avg_score: number | null;
  last_practice_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpeakingSessionInsert {
  user_id: string;
  question_text: string;
  transcript?: string | null;
  audio_url?: string | null;
  score?: number | null;
  feedback?: string | null;
}

export interface WritingSessionInsert {
  user_id: string;
  task_type: WritingTaskType;
  question_text: string;
  answer_text?: string;
  score?: number | null;
  feedback?: string | null;
  grammar_corrections?: GrammarCorrection[] | null;
}
