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

const WEEK_STARTS_MONDAY = { weekStartsOn: 1 } as const;
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

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
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function ActivityCalendar({
  year,
  month,
  activity,
  onSelectDate,
  selectedDate,
  onPrevMonth,
  onNextMonth,
}: ActivityCalendarProps) {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, WEEK_STARTS_MONDAY);
  const calendarEnd = endOfWeek(monthEnd, WEEK_STARTS_MONDAY);

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

  const monthTitle = format(monthStart, "MMMM yyyy");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Header: chevrons + month/year */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-medium text-neutral-900">{monthTitle}</span>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-sm text-neutral-500 px-2 pt-3 pb-1">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="px-2 pb-4">
        {rows.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.5">
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
                    min-h-9 flex flex-col items-center justify-center text-sm transition-colors
                    ${!isSelected && "hover:bg-neutral-100 rounded-lg"}
                  `}
                >
                  {isSelected ? (
                    <span className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium">
                      {format(d, "d")}
                    </span>
                  ) : (
                    <>
                      <span className={inMonth ? "text-neutral-800" : "text-neutral-400"}>
                        {format(d, "d")}
                      </span>
                      {total > 0 && (
                        <span className="text-[10px] text-neutral-400 leading-tight">
                          {total}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
