import { useState, useEffect, useRef } from "react";

export function useTimer(duration, active, resetKey, onExpire) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Keep ref pointing to the latest callback so the interval never uses a stale closure
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; });

  // Reset when question changes
  useEffect(() => { setTimeLeft(duration); }, [resetKey, duration]);

  // Countdown — pure state updater; fire onExpire via setTimeout to stay outside the updater
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setTimeout(() => onExpireRef.current(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, resetKey]);

  return timeLeft;
}
