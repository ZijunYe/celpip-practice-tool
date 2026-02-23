import type { SpeakingScoreResult, WritingScoreResult } from "@/types/ai";
import type { WritingTaskType } from "@/types/database";
import {
  mockGenerateSpeakingPrompt,
  mockGenerateWritingPrompt,
  mockScoreSpeaking,
  mockScoreWriting,
  mockTranscribe,
} from "./mock";

const hasOpenAIKey = Boolean(
  process.env.OPENAI_API_KEY?.trim()
);

export async function generateSpeakingPrompt(): Promise<string> {
  if (!hasOpenAIKey) {
    return mockGenerateSpeakingPrompt();
  }
  // Optional: call OpenAI to generate a varied prompt
  return mockGenerateSpeakingPrompt();
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
