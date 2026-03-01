import { useState, useCallback } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("pyquiz-bookmarks") || "[]")); }
    catch { return new Set(); }
  });

  const toggle = useCallback((id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("pyquiz-bookmarks", JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { bookmarks, toggle };
}
