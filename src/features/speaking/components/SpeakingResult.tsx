"use client";

interface SpeakingResultProps {
  score: number;
  band: number;
  breakdown: { content: number; coherence: number; vocabulary: number; grammar: number };
  feedback: string;
  improvements: string[];
  transcript?: string;
}

export function SpeakingResult({
  score,
  band,
  breakdown,
  feedback,
  improvements,
  transcript,
}: SpeakingResultProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-6 items-baseline">
        <span className="text-3xl font-bold">{score.toFixed(1)}</span>
        <span className="text-neutral-500">Band {band}</span>
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
      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-1">Feedback</h3>
        <p className="text-neutral-600">{feedback}</p>
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
