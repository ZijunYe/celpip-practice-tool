import type { SpeakingScoreResult, WritingScoreResult } from "@/types/ai";
import type { WritingTaskType } from "@/types/database";
import type { CelpipSpeakingTest } from "@/types/speaking";
import {
  mockGenerateCelpipSpeakingTest,
  mockGenerateSpeakingPrompt,
  mockGenerateSpeakingPrompts,
  mockGenerateWritingPrompt,
  mockScoreSpeaking,
  mockScoreWriting,
  mockTranscribe,
} from "./mock";

const hasOpenAIKey = Boolean(
  process.env.OPENAI_API_KEY?.trim()
);

/** Generate a full CELPIP Speaking test (8 tasks). Use dateKey (e.g. YYYY-MM-DD) for daily variety. */
export async function generateCelpipSpeakingTest(
  dateKey?: string
): Promise<CelpipSpeakingTest> {
  if (!hasOpenAIKey) {
    return mockGenerateCelpipSpeakingTest(dateKey);
  }
  // Optional: call OpenAI with the user's CELPIP prompt to generate a new test per day
  return mockGenerateCelpipSpeakingTest(dateKey);
}

export async function generateSpeakingPrompt(): Promise<string> {
  if (!hasOpenAIKey) {
    return mockGenerateSpeakingPrompt();
  }
  return mockGenerateSpeakingPrompt();
}

export async function generateSpeakingPrompts(): Promise<string[]> {
  if (!hasOpenAIKey) {
    return mockGenerateSpeakingPrompts();
  }
  return mockGenerateSpeakingPrompts();
}

export async function generateWritingPrompt(
  taskType: WritingTaskType
): Promise<string> {
  if (!hasOpenAIKey) {
    return mockGenerateWritingPrompt(taskType);
  }
  return mockGenerateWritingPrompt(taskType);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for Whisper API
export async function transcribeAudio(_audioUrl: string): Promise<string> {
  if (!hasOpenAIKey) {
    return mockTranscribe();
  }
  // Optional: use Whisper API with fetch to audio URL or upload
  return mockTranscribe();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for OpenAI scoring
export async function scoreSpeaking(
  _transcript: string,
  _questionText: string
): Promise<SpeakingScoreResult> {
  if (!hasOpenAIKey) {
    return mockScoreSpeaking();
  }
  // Optional: call OpenAI with structured output (JSON mode) for scoring
  return mockScoreSpeaking();
}

export async function scoreWriting(
  taskType: WritingTaskType,
  questionText: string,
  answerText: string
): Promise<WritingScoreResult> {
  if (!hasOpenAIKey) {
    return mockScoreWriting(taskType, questionText, answerText);
  }
  return mockScoreWriting(taskType, questionText, answerText);
}
