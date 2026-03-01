import { useState, useEffect, useCallback } from "react";

export function useXP() {
  const [xp, setXP] = useState(0);
  const [xpHydrated, setXpHydrated] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("pyquiz-xp");
    setXP(parseInt(v, 10) || 0);
    setXpHydrated(true);
  }, []);
  const addXP = useCallback((amount) => {
    setXP(prev => {
      const next = prev + amount;
      localStorage.setItem("pyquiz-xp", String(next));
      return next;
    });
  }, []);
  return { xp, xpHydrated, addXP };
}
