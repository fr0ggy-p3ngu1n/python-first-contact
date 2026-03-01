import { useState, useEffect, useCallback } from "react";

export function useSessionHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("pyquiz-history");
        if (r) setHistory(JSON.parse(r.value));
      } catch {}
    })();
  }, []);
  const save = useCallback(async (session) => {
    setHistory(prev => {
      const next = [session, ...prev].slice(0, 10);
      window.storage.set("pyquiz-history", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);
  const clear = useCallback(async () => {
    setHistory([]);
    try { await window.storage.delete("pyquiz-history"); } catch {}
  }, []);
  return { history, save, clear };
}
