"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PREP_SECONDS = 30;
const DEFAULT_RECORD_SECONDS = 90;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
  /** When true, show "Start prepare" first; after prepare countdown, show Record with countdown. */
  withPrepare?: boolean;
  /** Preparation time in seconds (e.g. 30 or 60). Default 30. */
  prepSeconds?: number;
  /** Recording time limit in seconds (e.g. 60 or 90). Default 90. */
  recordSeconds?: number;
}

export function AudioRecorder({
  onRecordingComplete,
  disabled,
  withPrepare = true,
  prepSeconds = DEFAULT_PREP_SECONDS,
  recordSeconds = DEFAULT_RECORD_SECONDS,
}: AudioRecorderProps) {
  const [phase, setPhase] = useState<"idle" | "preparing" | "ready" | "recording">(
    withPrepare ? "idle" : "ready"
  );
  const [prepareSecondsLeft, setPrepareSecondsLeft] = useState(prepSeconds);
  const [recordSecondsLeft, setRecordSecondsLeft] = useState(recordSeconds);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync timer limits when task changes (e.g. Task 1 → Task 5)
  useEffect(() => {
    setPrepareSecondsLeft(prepSeconds);
    setRecordSecondsLeft(recordSeconds);
  }, [prepSeconds, recordSeconds]);

  // Prepare countdown
  useEffect(() => {
    if (phase !== "preparing") return;
    if (prepareSecondsLeft <= 0) {
      setPhase("ready");
      return;
    }
    const t = setInterval(() => setPrepareSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, prepareSecondsLeft]);

  // Record countdown and auto-stop
  useEffect(() => {
    if (phase !== "recording") return;
    if (recordSecondsLeft <= 0) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      return;
    }
    recordTimerRef.current = setInterval(
      () => setRecordSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    };
  }, [phase, recordSecondsLeft]);

  const startPrepare = useCallback(() => {
    setError(null);
    setPhase("preparing");
    setPrepareSecondsLeft(prepSeconds);
  }, [prepSeconds]);

  const startRecording = useCallback(async () => {
    setError(null);
    setRecordSecondsLeft(recordSeconds);
    setPhase("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onRecordingComplete(blob);
        setPhase(withPrepare ? "ready" : "ready");
        setRecordSecondsLeft(recordSeconds);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not access microphone"
      );
      setPhase("ready");
    }
  }, [onRecordingComplete, withPrepare, recordSeconds]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setPhase("ready");
    setRecordSecondsLeft(recordSeconds);
  }, [recordSeconds]);

  if (phase === "preparing") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium text-neutral-700">
          Preparation time: {formatTime(prepareSecondsLeft)}
        </p>
        <p className="text-sm text-neutral-500">
          When the timer reaches 0:00, click Record to start speaking.
        </p>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="flex flex-col gap-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-sm text-neutral-600">
          Recording time limit: {formatTime(recordSeconds)}. Click Record when ready.
        </p>
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700 disabled:opacity-50"
        >
          Record
        </button>
      </div>
    );
  }

  if (phase === "recording") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium text-red-600">
          Recording: {formatTime(recordSecondsLeft)} remaining
        </p>
        <p className="text-sm text-neutral-500">
          Recording will stop automatically at 0:00.
        </p>
        <button
          type="button"
          onClick={stopRecording}
          className="rounded-lg bg-neutral-800 text-white px-4 py-2 hover:bg-neutral-700"
        >
          Stop recording
        </button>
      </div>
    );
  }

  // phase === "idle" (with prepare)
  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-sm text-neutral-600">
        You will have {prepSeconds} seconds to prepare, then {recordSeconds} seconds to record.
      </p>
      <button
        type="button"
        onClick={startPrepare}
        disabled={disabled}
        className="rounded-lg bg-neutral-800 text-white px-4 py-2 hover:bg-neutral-700 disabled:opacity-50"
      >
        Start prepare
      </button>
    </div>
  );
}
