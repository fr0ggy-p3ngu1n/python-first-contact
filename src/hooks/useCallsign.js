import { useState, useEffect, useCallback } from "react";

export function useCallsign() {
  const [callsign, setCallsign] = useState("");
  useEffect(() => {
    const v = localStorage.getItem("pyquiz-callsign");
    if (v) setCallsign(v);
  }, []);
  const save = useCallback((raw) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9 _-]/g, "").slice(0, 12);
    setCallsign(clean);
    if (clean) localStorage.setItem("pyquiz-callsign", clean);
    else localStorage.removeItem("pyquiz-callsign");
  }, []);
  return { callsign, save };
}
