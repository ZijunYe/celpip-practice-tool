"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AudioRecorder } from "@/features/speaking/components/AudioRecorder";
import { SpeakingResult } from "@/features/speaking/components/SpeakingResult";
import {
  startSpeakingSession,
  saveSpeakingAudio,
  transcribeAndScoreSpeaking,
} from "@/features/speaking/actions";

type Step = "idle" | "prompt" | "recording" | "uploading" | "scoring" | "result";

export default function SpeakingPage() {
  const [step, setStep] = useState<Step>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [result, setResult] = useState<{
    score: number;
    band: number;
    breakdown: { content: number; coherence: number; vocabulary: number; grammar: number };
    feedback: string;
    improvements: string[];
    transcript?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async () => {
    setError(null);
    setStep("prompt");
    const out = await startSpeakingSession();
    if ("error" in out) {
      setError(out.error);
      setStep("idle");
      toast.error(out.error);
      return;
    }
    setSessionId(out.sessionId);
    setQuestionText(out.questionText);
    toast.success("Prompt ready. Record when prepared.");
  }, []);

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      if (!sessionId) return;
      setError(null);
      setStep("uploading");
      const formData = new FormData();
      formData.set("audio", blob, "recording.webm");
      const out = await saveSpeakingAudio(sessionId, formData);
      if ("error" in out) {
        setError(out.error);
        setStep("prompt");
        toast.error(out.error);
        return;
      }
      setStep("scoring");
      toast.success("Audio saved. Scoring...");
      const scoreOut = await transcribeAndScoreSpeaking(sessionId);
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
      });
      setStep("result");
      toast.success("Scoring complete.");
    },
    [sessionId]
  );

  const handleReset = useCallback(() => {
    setStep("idle");
    setSessionId(null);
    setQuestionText("");
    setResult(null);
    setError(null);
  }, []);

  if (step === "idle") {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">Speaking practice</h1>
        <p className="text-neutral-600 mb-6">
          Get a CELPIP-style prompt, then record your response. You will receive a score and feedback.
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
        <div className="rounded-lg border border-neutral-200 p-4 mb-6 bg-neutral-50">
          <p className="text-sm text-neutral-500 mb-2">Task</p>
          <p className="whitespace-pre-wrap">{questionText}</p>
        </div>
        {(step === "uploading" || step === "scoring") && (
          <p className="text-neutral-500 mb-4">
            {step === "uploading" ? "Uploading..." : "Transcribing and scoring..."}
          </p>
        )}
        {(step === "prompt" || step === "recording") && (
          <>
            <p className="text-sm text-neutral-600 mb-4">
              Prepare (30 sec), then record (90 sec). Click Start when ready.
            </p>
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={false}
            />
          </>
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
