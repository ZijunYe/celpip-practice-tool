"use client";

import { format, parseISO } from "date-fns";
import type { SpeakingSession } from "@/types/database";
import type { WritingSession } from "@/types/database";

interface SessionListProps {
  dateStr: string;
  speaking: SpeakingSession[];
  writing: WritingSession[];
}

export function SessionList({ dateStr, speaking, writing }: SessionListProps) {
  const date = format(parseISO(dateStr), "MMMM d, yyyy");
  const hasAny = speaking.length > 0 || writing.length > 0;

  if (!hasAny) {
    return (
      <div className="mt-6">
        <h3 className="font-medium mb-2">{date}</h3>
        <p className="text-sm text-neutral-500">No practice sessions on this day.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">{date}</h3>
      <ul className="space-y-2">
        {speaking.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2"
          >
            <span className="font-medium">Speaking</span>
            {s.score != null && (
              <span className="text-sm text-neutral-600">Score: {s.score.toFixed(1)}</span>
            )}
          </li>
        ))}
        {writing.map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2"
          >
            <span className="font-medium">
              Writing — {w.task_type === "task1_email" ? "Task 1" : "Task 2"}
            </span>
            {w.score != null && (
              <span className="text-sm text-neutral-600">Score: {w.score.toFixed(1)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

