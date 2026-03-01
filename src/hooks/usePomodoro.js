import { useState, useEffect } from "react";

export function usePomodoro() {
  const DURATION = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [active,   setActive]   = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setActive(false); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);
  const fmt   = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const start = () => { setActive(true);  setFinished(false); };
  const pause = () =>   setActive(false);
  const reset = () => { setActive(false); setFinished(false); setTimeLeft(DURATION); };
  return { timeLeft, active, finished, start, pause, reset, fmt, total: DURATION };
}
