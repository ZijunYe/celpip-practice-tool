"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { autoSaveWriting } from "../actions";

const DEBOUNCE_MS = 2500;

interface WritingEditorProps {
  sessionId: string;
  initialAnswer?: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function WritingEditor({
  sessionId,
  initialAnswer = "",
  onSubmit,
  isSubmitting = false,
}: WritingEditorProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialAnswer);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      const value = (document.getElementById("writing-answer") as HTMLTextAreaElement)?.value ?? answer;
      if (value !== lastSavedRef.current) {
        await autoSaveWriting(sessionId, value);
        lastSavedRef.current = value;
      }
      saveTimeoutRef.current = null;
    }, DEBOUNCE_MS);
  }, [sessionId, answer]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(() => {
    const textarea = document.getElementById("writing-answer") as HTMLTextAreaElement;
    if (textarea) setAnswer(textarea.value);
    scheduleSave();
  }, [scheduleSave]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label htmlFor="writing-answer" className="text-sm font-medium text-neutral-700">
          Your response
        </label>
        <span className="text-sm text-neutral-500">
          {wordCount(answer)} words
        </span>
      </div>
      <textarea
        id="writing-answer"
        defaultValue={initialAnswer}
        onChange={handleChange}
        onBlur={handleChange}
        rows={12}
        className="w-full border border-neutral-300 rounded-lg p-3 text-neutral-900 resize-y"
        placeholder="Type your email or survey response here..."
        disabled={isSubmitting}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || wordCount(answer) < 10}
        className="rounded-lg bg-neutral-900 text-white px-6 py-2 hover:bg-neutral-800 disabled:opacity-50 self-end"
      >
        {isSubmitting ? "Submitting..." : "Submit for scoring"}
      </button>
    </div>
  );
}
