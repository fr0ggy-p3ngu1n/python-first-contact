import { useState, useRef, useCallback } from "react";

export function usePyodide() {
  const [pyodide, setPy]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const started = useRef(false);

  const load = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setLoading(true);
    (async () => {
      try {
        if (!window.loadPyodide) await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          s.onload = res; s.onerror = rej; document.head.appendChild(s);
        });
        const py = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
        setPy(py); setLoading(false);
      } catch { setError("Python runtime unavailable."); setLoading(false); }
    })();
  }, []);

  const runCode = useCallback(async (code) => {
    if (!pyodide) return { output: "", error: "Python not loaded." };
    try {
      pyodide.runPython(`import sys,io;_b=io.StringIO();sys.stdout=_b`);
      pyodide.runPython(code);
      pyodide.runPython(`sys.stdout=sys.__stdout__`);
      const out = pyodide.runPython(`_b.getvalue()`);
      return { output: out || "(no output)", error: null };
    } catch (e) {
      try { pyodide.runPython(`sys.stdout=sys.__stdout__`); } catch {}
      return { output: "", error: String(e) };
    }
  }, [pyodide]);

  return { loading, error, runCode, load };
}
