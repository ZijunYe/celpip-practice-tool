"use client";

import { useCallback, useState } from "react";
import { ActivityCalendar, CalendarNav } from "./components/ActivityCalendar";
import { SessionList } from "./components/SessionList";
import { getSessionsForDate, getActivityForMonth } from "./actions";
import type { SpeakingSession } from "@/types/database";
import type { WritingSession } from "@/types/database";

interface ProgressViewProps {
  initialYear: number;
  initialMonth: number;
  initialActivity: Record<string, { speaking: number; writing: number }>;
}

export function ProgressView({
  initialYear,
  initialMonth,
  initialActivity,
}: ProgressViewProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [activity, setActivity] = useState(initialActivity);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<{
    speaking: SpeakingSession[];
    writing: WritingSession[];
  } | null>(null);

  const handleSelectDate = useCallback(async (dateStr: string) => {
    setSelectedDate(dateStr);
    const data = await getSessionsForDate(dateStr);
    if (data) {
      setSessions({ speaking: data.speaking, writing: data.writing });
    } else {
      setSessions(null);
    }
  }, []);

  const handlePrevMonth = useCallback(async () => {
    const d = new Date(year, month - 2);
    const newYear = d.getFullYear();
    const newMonth = d.getMonth() + 1;
    setYear(newYear);
    setMonth(newMonth);
    const nextActivity = await getActivityForMonth(newYear, newMonth);
    setActivity(nextActivity);
    setSelectedDate(null);
    setSessions(null);
  }, [year, month]);

  const handleNextMonth = useCallback(async () => {
    const d = new Date(year, month);
    const newYear = d.getFullYear();
    const newMonth = d.getMonth() + 1;
    setYear(newYear);
    setMonth(newMonth);
    const nextActivity = await getActivityForMonth(newYear, newMonth);
    setActivity(nextActivity);
    setSelectedDate(null);
    setSessions(null);
  }, [year, month]);

  return (
    <div>
      <CalendarNav
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      <ActivityCalendar
        year={year}
        month={month}
        activity={activity}
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />
      {selectedDate && sessions && (
        <SessionList
          dateStr={selectedDate}
          speaking={sessions.speaking}
          writing={sessions.writing}
        />
      )}
    </div>
  );
}
