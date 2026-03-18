"use client";

import type { GrammarMistake } from "@/types/ai";
import { PromptDisplay } from "@/features/writing/components/PromptDisplay";

interface SpeakingResultProps {
  score: number;
  band: number;
  breakdown: { content: number; coherence: number; vocabulary: number; grammar: number };
  feedback: string;
  improvements: string[];
  transcript?: string;
  grammar_mistakes?: GrammarMistake[];
}

export function SpeakingResult({
  score,
  band,
  breakdown,
  feedback,
  improvements,
  transcript,
  grammar_mistakes = [],
}: SpeakingResultProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-6 items-baseline">
        <span className="text-3xl font-bold">{score.toFixed(1)}</span>
        <span className="text-neutral-500">Band {band}</span>
        <span className="text-sm text-neutral-500">(CELPIP-style)</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-500">Content</p>
          <p className="font-semibold">{breakdown.content}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-500">Coherence</p>
          <p className="font-semibold">{breakdown.coherence}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-500">Vocabulary</p>
          <p className="font-semibold">{breakdown.vocabulary}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-500">Grammar</p>
          <p className="font-semibold">{breakdown.grammar}</p>
        </div>
      </div>
      {transcript && (
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-1">Transcript</h3>
          <p className="text-sm text-neutral-600 whitespace-pre-wrap border rounded-lg p-3 bg-neutral-50">
            {transcript}
          </p>
        </div>
      )}
      {grammar_mistakes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Grammar (CELPIP marker)</h3>
          <ul className="space-y-2">
            {grammar_mistakes.map((m, i) => (
              <li key={i} className="text-sm border border-amber-200 rounded-lg p-3 bg-amber-50">
                <span className="text-red-600 line-through">{m.phrase}</span>
                <span className="text-neutral-600"> → </span>
                <span className="text-green-700 font-medium">{m.correction}</span>
                {m.explanation && (
                  <p className="text-neutral-500 mt-1">{m.explanation}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-1">Feedback</h3>
        <PromptDisplay text={feedback} className="whitespace-pre-wrap text-neutral-600" />
      </div>
      {improvements.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Suggestions</h3>
          <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
