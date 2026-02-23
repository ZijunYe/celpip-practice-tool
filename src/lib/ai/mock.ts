import type { SpeakingScoreResult, WritingScoreResult } from "@/types/ai";
import type { WritingTaskType } from "@/types/database";

export function mockGenerateSpeakingPrompt(): string {
  return `You are at a community centre. The coordinator asks you to give a short talk about a hobby or interest.

**Task:** Talk about a hobby or interest you have. Explain why you enjoy it and how often you do it.

**Preparation time:** 30 seconds
**Speaking time:** 90 seconds

Begin after the preparation time.`;
}

export function mockGenerateWritingPrompt(taskType: WritingTaskType): string {
  if (taskType === "task2_survey") {
    return `Your city is conducting a survey about public transit.

**Survey question:** How could public transit in your area be improved? What would encourage you to use it more often?

**Task:** Write your response (150–200 words). Include:
- At least two specific suggestions for improvement
- Your reasons for each suggestion
- How often you currently use transit (if at all)

Write your response below.`;
  }
  return `You are writing an email to a community program coordinator.

**Situation:** You saw a poster for a free weekend workshop on digital skills. You want to register and need more information.

**Task:** Write an email (150–200 words) to the coordinator. In your email:
- Say where you saw the poster
- Ask for the exact date and time of the workshop
- Ask whether you need to bring a laptop
- Ask how to register

Write your email below.`;
}

export function mockTranscribe(): string {
  return "This is a mock transcript. Enable speech-to-text API for real transcription.";
}

export function mockScoreSpeaking(): SpeakingScoreResult {
  return {
    score: 8.5,
    band: 9,
    breakdown: {
      content: 8,
      coherence: 9,
      vocabulary: 8,
      grammar: 9,
    },
    feedback:
      "Clear response with good task fulfillment. Consider varying sentence structure and using more precise vocabulary to reach a higher band.",
    improvements: [
      "Use a wider range of linking words (e.g., furthermore, in addition).",
      "Include a brief conclusion that restates your main point.",
    ],
  };
}

export function mockScoreWriting(
  _taskType: WritingTaskType,
  _questionText: string,
  answerText: string
): WritingScoreResult {
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
  return {
    score: 7.5,
    band: 8,
    breakdown: {
      task_achievement: 8,
      organization: 7,
      vocabulary: 8,
      grammar: 7,
    },
    feedback: `You addressed the task with ${wordCount} words. Structure your email with a clear greeting, body paragraphs for each point, and a closing. Check subject-verb agreement.`,
    grammar_corrections: [],
    improvements: [
      "Use a clear greeting (e.g., Dear Coordinator).",
      "Separate each question into its own short paragraph.",
    ],
  };
}
