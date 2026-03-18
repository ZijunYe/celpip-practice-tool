import type { SpeakingScoreResult, WritingScoreResult } from "@/types/ai";
import type { WritingTaskType } from "@/types/database";
import type { CelpipSpeakingTest } from "@/types/speaking";

const MOCK_SPEAKING_PROMPTS = [
  `You are at a community centre. The coordinator asks you to give a short talk about a hobby or interest.

**Task:** Talk about a hobby or interest you have. Explain why you enjoy it and how often you do it.

**Preparation time:** 30 seconds
**Speaking time:** 90 seconds

Begin after the preparation time.`,
  `You are speaking to a neighbour who is new to the area.

**Task:** Describe your favourite place in your neighbourhood. Explain what you do there and why you like it.

**Preparation time:** 30 seconds
**Speaking time:** 90 seconds

Begin after the preparation time.`,
];

/** One complete CELPIP-style 8-task speaking test (realistic, Canadian context). */
function buildMockCelpipSpeakingTest(): CelpipSpeakingTest {
  return {
    test_title: "CELPIP – General Speaking Practice Test",
    tasks: [
      {
        task_number: 1,
        task_type: "giving_advice",
        task_title: "Giving Advice",
        instructions: `Your colleague Marcus is moving to Vancouver from another province. He has never lived in a rainy climate and is worried about the winter. He asks you for advice on how to prepare.

**Task:** Give Marcus practical advice on how to prepare for Vancouver's weather and what to expect in his first winter. Speak directly to him.

**Preparation time:** 30 seconds
**Speaking time:** 90 seconds

Begin after the preparation time.`,
        prep_time: "30 seconds",
        speaking_time: "90 seconds",
      },
      {
        task_number: 2,
        task_type: "personal_experience",
        task_title: "Talking About a Personal Experience",
        instructions: `A friend is applying for a job that requires volunteer experience. They ask you to describe a time when volunteering made a difference.

**Task:** Describe a specific experience when you volunteered (e.g., at a food bank, community event, or school). Explain what you did, what happened, and why it was meaningful to you.

**Preparation time:** 30 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        prep_time: "30 seconds",
        speaking_time: "60 seconds",
      },
      {
        task_number: 3,
        task_type: "describing_scene",
        task_title: "Describing a Scene",
        instructions: `You are shown an image. In the image, you see a busy Canadian public library. There are several people at study tables with laptops and books. A librarian is standing at a help desk near the entrance. In the background, there are tall bookshelves and a noticeboard with community event posters. A family is browsing in the children's section, which has colourful furniture.

**Task:** Describe in detail what you see in this image: the setting, the people, their activities, and any notable details. Speak as if you are describing the scene to someone who cannot see it.

**Preparation time:** 30 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
        prep_time: "30 seconds",
        speaking_time: "60 seconds",
      },
      {
        task_number: 4,
        task_type: "making_predictions",
        task_title: "Making Predictions",
        instructions: `Using the SAME image from Task 3 (the busy public library with study tables, a librarian at the help desk, bookshelves, and a family in the children's section):

**Task:** What do you think might happen next in this scene? Give two or three realistic predictions and briefly explain why.

**Preparation time:** 30 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
        prep_time: "30 seconds",
        speaking_time: "60 seconds",
      },
      {
        task_number: 5,
        task_type: "comparing_persuading",
        task_title: "Comparing and Persuading",
        instructions: `Your workplace is deciding how to spend a small team social budget this quarter.

**Option A:** A one-time dinner at a local restaurant.
**Option B:** Several smaller activities (e.g., coffee runs, a picnic, or a board game afternoon).

Your manager asks for your view before making the decision.

**Task:** Persuade your manager to choose one option (A or B). Compare both options and give clear reasons why your choice is better for the team.

**Preparation time:** 60 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        prep_time: "60 seconds",
        speaking_time: "60 seconds",
      },
      {
        task_number: 6,
        task_type: "difficult_situation",
        task_title: "Dealing with a Difficult Situation",
        instructions: `You and a coworker were both asked to prepare a short presentation for the same meeting. You each prepared separately, but your coworker's slides are very similar to yours and they are presenting first. You are worried it will look like you copied them, and you are upset.

**Task:** Explain the situation and how you would resolve it. Address what you would say or do so that the situation is handled professionally and fairly.

**Preparation time:** 60 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        prep_time: "60 seconds",
        speaking_time: "60 seconds",
      },
      {
        task_number: 7,
        task_type: "expressing_opinions",
        task_title: "Expressing Opinions",
        instructions: `In Canada, some cities are reducing the number of cars in downtown areas by adding bike lanes and pedestrian zones. Supporters say it improves safety and the environment; others say it makes driving and deliveries harder.

**Task:** State your opinion on whether downtown areas should prioritize bikes and pedestrians over cars. Give at least two clear reasons to support your view.

**Preparation time:** 30 seconds
**Speaking time:** 90 seconds

Begin after the preparation time.`,
        prep_time: "30 seconds",
        speaking_time: "90 seconds",
      },
      {
        task_number: 8,
        task_type: "unusual_situation",
        task_title: "Describing an Unusual Situation",
        instructions: `You walk into your local grocery store and notice that all the staff are wearing costumes (e.g., superheroes or animals), and there are balloons and a small stage near the entrance. You hear an announcement that today is "Customer Appreciation Day" and that there will be free samples and a draw every hour.

**Task:** Describe this unusual situation clearly. Explain what you see and hear, and what you think is going on.

**Preparation time:** 30 seconds
**Speaking time:** 60 seconds

Begin after the preparation time.`,
        prep_time: "30 seconds",
        speaking_time: "60 seconds",
      },
    ],
    scoring_rubric: {
      content_coherence:
        "Ideas are relevant, logically organized, and easy to follow. Clear progression and connections between ideas.",
      vocabulary:
        "Uses a range of vocabulary appropriate to the task. Word choice is precise and fits the context.",
      listenability:
        "Pronunciation, pace, and fluency support understanding. Speech is clear and natural with minimal hesitation.",
      task_fulfillment:
        "Addresses all parts of the task. Role and audience are appropriate. Time is used effectively.",
    },
    band_10_expectations: {
      content_coherence:
        "Fully developed, well-organized response with clear logic and smooth transitions. No irrelevant or confusing ideas.",
      vocabulary:
        "Wide and precise vocabulary. Natural and idiomatic use; no awkward or inaccurate word choice.",
      listenability:
        "Highly clear pronunciation and natural pace. Fluent with minimal pauses; easy for any listener to follow.",
      task_fulfillment:
        "Completely fulfills the task. Role and audience are clearly respected. All requirements met within the time.",
    },
  };
}

/** Pool of alternate tests for variety (e.g. day-based). */
const MOCK_CELPIP_TESTS: CelpipSpeakingTest[] = [
  buildMockCelpipSpeakingTest(),
];

/** Returns a full 8-task CELPIP speaking test. For "daily" variety, pass a date string to pick deterministically. */
export function mockGenerateCelpipSpeakingTest(
  _dateKey?: string
): CelpipSpeakingTest {
  // Use dateKey to pick from pool or rotate; for now return the first (only) test.
  const index = _dateKey
    ? Math.abs(hashString(_dateKey)) % MOCK_CELPIP_TESTS.length
    : 0;
  return JSON.parse(
    JSON.stringify(MOCK_CELPIP_TESTS[index] ?? MOCK_CELPIP_TESTS[0])
  );
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export function mockGenerateSpeakingPrompt(): string {
  const test = mockGenerateCelpipSpeakingTest();
  return formatTaskAsPrompt(test.tasks[0]);
}

export function mockGenerateSpeakingPrompts(): string[] {
  const test = mockGenerateCelpipSpeakingTest();
  return test.tasks.map((t) => formatTaskAsPrompt(t));
}

function formatTaskAsPrompt(t: {
  task_title: string;
  instructions: string;
}): string {
  return `**${t.task_title}**\n\n${t.instructions}`;
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
    grammar_mistakes: [
      { phrase: "I have went", correction: "I have gone", explanation: "Use past participle after 'have'." },
      { phrase: "more better", correction: "better", explanation: "Avoid double comparative." },
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
