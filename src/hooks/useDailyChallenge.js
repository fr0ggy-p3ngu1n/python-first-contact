import { useState, useEffect, useCallback } from "react";

export function useDailyChallenge() {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const [record, setRecord] = useState(null);
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const r = localStorage.getItem("pyquiz-daily");
    const s = localStorage.getItem("pyquiz-daily-streak");
    if (r) setRecord(JSON.parse(r));
    if (s) setStreak(parseInt(s, 10) || 0);
  }, []);
  const todayDone = record?.date === today;
  const markDone = useCallback((correct) => {
    const r = { date: today, correct };
    setRecord(r);
    localStorage.setItem("pyquiz-daily", JSON.stringify(r));
    setStreak(prev => {
      const newStreak = record?.date === yesterday ? prev + 1 : 1;
      localStorage.setItem("pyquiz-daily-streak", String(newStreak));
      return newStreak;
    });
  }, [today, yesterday, record]);
  return { today, todayDone, record, streak, markDone };
}
