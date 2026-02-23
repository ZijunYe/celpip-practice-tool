"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { WritingEditor } from "@/features/writing/components/WritingEditor";
import { WritingResult } from "@/features/writing/components/WritingResult";
import {
  startWritingSession,
  submitWriting,
} from "@/features/writing/actions";
import type { WritingTaskType } from "@/types/database";

type Step = "choose" | "writing" | "result";

export default function WritingPage() {
  const [step, setStep] = useState<Step>("choose");
  const [taskType, setTaskType] = useState<WritingTaskType | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    band: number;
    feedback: string;
    breakdown: { task_achievement: number; organization: number; vocabulary: number; grammar: number };
    grammar_corrections: Array<{ offset: number; length: number; message: string; suggestion?: string }>;
    improvements: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = useCallback(async (type: WritingTaskType) => {
    setError(null);
    setIsStarting(true);
    const out = await startWritingSession(type);
    setIsStarting(false);
    if ("error" in out) {
      setError(out.error);
      toast.error(out.error);
      return;
    }
    setTaskType(type);
    setSessionId(out.sessionId);
    setQuestionText(out.questionText);
    setAnswerText("");
    setStep("writing");
    setResult(null);
    toast.success("Prompt ready. Your work will auto-save.");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!sessionId) return;
    const textarea = document.getElementById("writing-answer") as HTMLTextAreaElement;
    const text = textarea?.value ?? answerText;
    setAnswerText(text);
    setError(null);
    setIsSubmitting(true);
    const out = await submitWriting(sessionId);
    setIsSubmitting(false);
    if ("error" in out) {
      setError(out.error);
      toast.error(out.error);
      return;
    }
    setResult({
      score: out.score,
      band: out.band,
      feedback: out.feedback,
      breakdown: out.breakdown,
      grammar_corrections: out.grammar_corrections,
      improvements: out.improvements,
    });
    setStep("result");
    toast.success("Scoring complete.");
  }, [sessionId, answerText]);

  const handleReset = useCallback(() => {
    setStep("choose");
    setTaskType(null);
    setSessionId(null);
    setQuestionText("");
    setAnswerText("");
    setResult(null);
    setError(null);
  }, []);

  if (step === "choose") {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Writing practice</h1>
        <p className="text-neutral-600 mb-6">
          Choose a task type. Task 1 is an email; Task 2 is a survey response.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => handleStart("task1_email")}
            disabled={isStarting}
            className="rounded-lg border border-neutral-200 px-6 py-4 hover:bg-neutral-50 text-left"
          >
            <span className="font-medium">Task 1 — Email</span>
            <p className="text-sm text-neutral-500 mt-1">Write an email (150–200 words)</p>
          </button>
          <button
            type="button"
            onClick={() => handleStart("task2_survey")}
            disabled={isStarting}
            className="rounded-lg border border-neutral-200 px-6 py-4 hover:bg-neutral-50 text-left"
          >
            <span className="font-medium">Task 2 — Survey</span>
            <p className="text-sm text-neutral-500 mt-1">Respond to a survey (150–200 words)</p>
          </button>
        </div>
      </div>
    );
  }

  if (step === "writing") {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">
          Writing — {taskType === "task1_email" ? "Task 1: Email" : "Task 2: Survey"}
        </h1>
        <div className="rounded-lg border border-neutral-200 p-4 mb-6 bg-neutral-50">
          <p className="text-sm text-neutral-500 mb-2">Prompt</p>
          <p className="whitespace-pre-wrap">{questionText}</p>
        </div>
        <WritingEditor
          sessionId={sessionId!}
          initialAnswer={answerText}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Writing result</h1>
      {result && (
        <WritingResult
          score={result.score}
          band={result.band}
          breakdown={result.breakdown}
          feedback={result.feedback}
          grammar_corrections={result.grammar_corrections}
          improvements={result.improvements}
        />
      )}
      <button
        type="button"
        onClick={handleReset}
        className="mt-8 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
      >
        Practice again
      </button>
    </div>
  );
}
