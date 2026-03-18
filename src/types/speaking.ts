/**
 * CELPIP – General Speaking full test (8 tasks) structure.
 * Used for daily-generated tests and scoring rubric.
 */

export type CelpipSpeakingTaskType =
  | "giving_advice"
  | "personal_experience"
  | "describing_scene"
  | "making_predictions"
  | "comparing_persuading"
  | "difficult_situation"
  | "expressing_opinions"
  | "unusual_situation";

export interface CelpipSpeakingTask {
  task_number: number;
  task_type: CelpipSpeakingTaskType;
  task_title: string;
  instructions: string;
  /** Optional image URL for "describe this image" style tasks (e.g. Task 3, 4). */
  image_url?: string | null;
  prep_time: string;
  speaking_time: string;
}

export interface ScoringRubric {
  content_coherence: string;
  vocabulary: string;
  listenability: string;
  task_fulfillment: string;
}

export interface Band10Expectations {
  content_coherence: string;
  vocabulary: string;
  listenability: string;
  task_fulfillment: string;
}

export interface CelpipSpeakingTest {
  test_title: string;
  tasks: CelpipSpeakingTask[];
  scoring_rubric: ScoringRubric;
  band_10_expectations: Band10Expectations;
}

/** Parse "30 seconds" or "90 seconds" to number. */
export function parseSpeakingSeconds(s: string): number {
  const match = s.match(/(\d+)\s*seconds?/i);
  return match ? Math.max(1, parseInt(match[1], 10)) : 60;
}
