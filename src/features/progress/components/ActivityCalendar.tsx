"use client";

import { useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

interface DayActivity {
  speaking: number;
  writing: number;
}

interface ActivityCalendarProps {
  year: number;
  month: number;
  activity: Record<string, DayActivity>;
  onSelectDate: (dateStr: string) => void;
  selectedDate: string | null;
}

export function ActivityCalendar({
  year,
  month,
  activity,
  onSelectDate,
  selectedDate,
}: ActivityCalendarProps) {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const rows: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
  }

  const getActivity = useCallback(
    (d: Date) => {
      const key = format(d, "yyyy-MM-dd");
      return activity[key] ?? { speaking: 0, writing: 0 };
    },
    [activity]
  );

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 text-center text-xs text-neutral-500 border-b border-neutral-200 bg-neutral-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w} className="py-2">
            {w}
          </div>
        ))}
      </div>
      {rows.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const act = getActivity(d);
            const total = act.speaking + act.writing;
            const inMonth = isSameMonth(d, monthStart);
            const isSelected = selectedDate === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDate(key)}
                className={`
                  min-h-10 p-1 text-sm border border-neutral-100
                  ${inMonth ? "text-neutral-900 bg-white" : "text-neutral-300 bg-neutral-50"}
                  ${isSelected ? "ring-2 ring-neutral-900" : ""}
                  hover:bg-neutral-50
                `}
              >
                {format(d, "d")}
                {total > 0 && (
                  <span className="block text-xs text-neutral-500">
                    {total} practice{total !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function CalendarNav({
  year,
  month,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const d = new Date(year, month - 1);
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={onPrev}
        className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
      >
        Previous
      </button>
      <span className="font-medium">{format(d, "MMMM yyyy")}</span>
      <button
        type="button"
        onClick={onNext}
        className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
      >
        Next
      </button>
    </div>
  );
}
