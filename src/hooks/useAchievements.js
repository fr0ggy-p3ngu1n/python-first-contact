import { useState, useCallback } from "react";

export const ACHIEVEMENTS = [
  { id:"first_contact", icon:"🌍", label:"First Contact",   desc:"Complete your first quiz" },
  { id:"flawless",      icon:"✨", label:"Flawless",         desc:"Score 100% on any quiz" },
  { id:"no_hints",      icon:"🧠", label:"Mind Over Hints",  desc:"Finish a full quiz without using any hints" },
  { id:"on_fire",       icon:"🔥", label:"On Fire",          desc:"Reach a 10× answer streak" },
  { id:"speed_demon",   icon:"⚡", label:"Speed Demon",      desc:"Answer 5 questions each in under 5 seconds" },
  { id:"daily_devotee", icon:"📅", label:"Daily Devotee",    desc:"Complete the daily challenge 3 days in a row" },
  { id:"veteran",       icon:"👾", label:"Veteran",          desc:"Complete 10 quiz sessions" },
  { id:"overlord",      icon:"🌌", label:"Overlord",         desc:"Reach Level 6: Overlord" },
];

export function useAchievements() {
  const [earned, setEarned] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("pyquiz-achievements") || "[]")); }
    catch { return new Set(); }
  });
  const [pending, setPending] = useState([]); // queue of achievements to show

  const award = useCallback((id) => {
    setEarned(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("pyquiz-achievements", JSON.stringify([...next]));
      const found = ACHIEVEMENTS.find(a => a.id === id);
      if (found) setPending(q => [...q, found]);
      return next;
    });
  }, []);

  // Pop the next achievement from the queue
  const dismissFirst = useCallback(() => {
    setPending(q => q.slice(1));
  }, []);

  return { earned, award, current: pending[0] ?? null, dismissFirst };
}
