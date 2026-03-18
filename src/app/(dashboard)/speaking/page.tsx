"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AudioRecorder } from "@/features/speaking/components/AudioRecorder";
import { SpeakingResult } from "@/features/speaking/components/SpeakingResult";
import { PromptDisplay } from "@/features/writing/components/PromptDisplay";
import {
  getSpeakingTest,
  startSpeakingSession,
  saveSpeakingAudio,
  transcribeAndScoreSpeaking,
} from "@/features/speaking/actions";
import type { GrammarMistake } from "@/types/ai";
import type { CelpipSpeakingTest, CelpipSpeakingTask } from "@/types/speaking";
import { parseSpeakingSeconds } from "@/types/speaking";

type Step = "idle" | "prompt" | "recording" | "uploading" | "scoring" | "result";

function formatTaskAsQuestionText(task: CelpipSpeakingTask): string {
  return `**${task.task_title}**\n\n${task.instructions}`;
}

export default function SpeakingPage() {
  const [step, setStep] = useState<Step>("idle");
  const [test, setTest] = useState<CelpipSpeakingTest | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    band: number;
    breakdown: { content: number; coherence: number; vocabulary: number; grammar: number };
    feedback: string;
    improvements: string[];
    transcript?: string;
    grammar_mistakes?: GrammarMistake[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tasks = test?.tasks ?? [];
  const totalQuestions = tasks.length;
  const currentTask = tasks[currentIndex] ?? null;
  const currentQuestionNumber = currentIndex + 1;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalQuestions - 1;
  const questionText = currentTask
    ? formatTaskAsQuestionText(currentTask)
    : "";

  const handleStart = useCallback(async () => {
    setError(null);
    const out = await getSpeakingTest();
    if ("error" in out) {
      setError(out.error);
      toast.error(out.error);
      return;
    }
    setTest(out.test);
    setCurrentIndex(0);
    setStep("prompt");
    toast.success(`${out.test.test_title} — ${out.test.tasks.length} tasks loaded.`);
  }, []);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setCurrentIndex(currentIndex - 1);
  }, [canGoPrev, currentIndex]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    setCurrentIndex(currentIndex + 1);
  }, [canGoNext, currentIndex]);

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      setError(null);
      setStep("uploading");
      const out = await startSpeakingSession(questionText);
      if ("error" in out) {
        setError(out.error);
        setStep("prompt");
        toast.error(out.error);
        return;
      }
      const newSessionId = out.sessionId;
      const formData = new FormData();
      formData.set("audio", blob, "recording.webm");
      const uploadOut = await saveSpeakingAudio(newSessionId, formData);
      if ("error" in uploadOut) {
        setError(uploadOut.error);
        setStep("prompt");
        toast.error(uploadOut.error);
        return;
      }
      setStep("scoring");
      toast.success("Audio saved. Transcribing and scoring...");
      const scoreOut = await transcribeAndScoreSpeaking(newSessionId);
      if ("error" in scoreOut) {
        setError(scoreOut.error);
        setStep("prompt");
        toast.error(scoreOut.error);
        return;
      }
      setResult({
        score: scoreOut.score,
        band: scoreOut.band,
        breakdown: scoreOut.breakdown,
        feedback: scoreOut.feedback,
        improvements: scoreOut.improvements,
        transcript: scoreOut.transcript,
        grammar_mistakes: scoreOut.grammar_mistakes,
      });
      setStep("result");
      toast.success("Scoring complete.");
    },
    [questionText]
  );

  const handleReset = useCallback(() => {
    setStep("prompt");
    setResult(null);
    setError(null);
  }, []);

  const handlePracticeAnother = useCallback(() => {
    setStep("prompt");
    setResult(null);
    setError(null);
  }, []);

  if (step === "idle") {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Speaking practice</h1>
        <p className="text-neutral-600 mb-6">
          Full CELPIP Speaking test: 8 different task types (advice, experience, scene, predictions, comparing, difficult situation, opinions, unusual situation). Prep and speaking times vary by task. You will receive a score, transcript, and feedback.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="button"
          onClick={handleStart}
          className="rounded-lg bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800"
        >
          Start new session
        </button>
      </div>
    );
  }

  if (step === "prompt" || step === "recording" || step === "uploading" || step === "scoring") {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Speaking practice</h1>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-neutral-600">
              Task {currentQuestionNumber} of {totalQuestions}
            </p>
            {currentTask && (
              <p className="text-sm font-semibold text-neutral-800 mt-0.5">
                {currentTask.task_title}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4 mb-6 bg-neutral-50">
          {currentTask?.image_url && (
            <div className="mb-4">
              <img
                src={currentTask.image_url}
                alt="Task image"
                className="rounded-lg border border-neutral-200 max-h-80 w-full object-contain bg-white"
              />
            </div>
          )}
          <p className="text-sm text-neutral-500 mb-2">Instructions</p>
          <PromptDisplay text={questionText} />
        </div>

        {(step === "uploading" || step === "scoring") && (
          <p className="text-neutral-500 mb-4">
            {step === "uploading" ? "Uploading..." : "Transcribing and scoring..."}
          </p>
        )}

        {(step === "prompt" || step === "recording") && currentTask && (
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            disabled={false}
            withPrepare={true}
            prepSeconds={parseSpeakingSeconds(currentTask.prep_time)}
            recordSeconds={parseSpeakingSeconds(currentTask.speaking_time)}
          />
        )}

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Speaking result</h1>
      {result && (
        <SpeakingResult
          score={result.score}
          band={result.band}
          breakdown={result.breakdown}
          feedback={result.feedback}
          improvements={result.improvements}
          transcript={result.transcript}
          grammar_mistakes={result.grammar_mistakes}
        />
      )}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={handlePracticeAnother}
          className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
        >
          Practice another question
        </button>
        <button
          type="button"
          onClick={() => {
            handleReset();
            setStep("idle");
            setTest(null);
            setCurrentIndex(0);
          }}
          className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
        >
          Back to start
        </button>
      </div>
    </div>
  );
}
