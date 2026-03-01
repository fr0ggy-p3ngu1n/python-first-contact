import { useState, useEffect } from "react";

export function useTimer(duration, active, resetKey, onExpire) {
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => { setTimeLeft(duration); }, [resetKey, duration]);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { onExpire(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, resetKey]);
  return timeLeft;
}
