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
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
        <h3 className="font-medium text-neutral-900 mb-2">{date}</h3>
        <p className="text-sm text-neutral-500">No practice sessions on this day.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <h3 className="font-medium text-neutral-900">{date}</h3>
      </div>
      <ul className="divide-y divide-neutral-100">
        {speaking.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors"
          >
            <span className="font-medium text-neutral-900">Speaking</span>
            {s.score != null && (
              <span className="text-sm text-neutral-600">Score: {s.score.toFixed(1)}</span>
            )}
          </li>
        ))}
        {writing.map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors"
          >
            <span className="font-medium text-neutral-900">
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

