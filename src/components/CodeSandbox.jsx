import { useState, useEffect } from "react";
import { D } from "../constants/palette.js";
import { syntaxHighlight } from "../utils/syntaxHighlight.jsx";

export function CodeSandbox({ defaultCode, runCode, pyodideLoading, pyodideError }) {
  const [code,    setCode]    = useState(defaultCode);
  const [output,  setOutput]  = useState(null);
  const [running, setRunning] = useState(false);
  const [isErr,   setIsErr]   = useState(false);
  useEffect(() => { setCode(defaultCode); setOutput(null); }, [defaultCode]);

  const handleRun = async () => {
    setRunning(true);
    const r = await runCode(code);
    setOutput(r.error || r.output); setIsErr(!!r.error); setRunning(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = e.target.selectionStart;
      setCode(c => c.substring(0, s) + "    " + c.substring(e.target.selectionEnd));
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRun();
  };

  const busy = running || pyodideLoading;
  return (
    <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${D.currentLine}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: D.bgDark, borderBottom: `1px solid ${D.currentLine}` }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }}/>)}
        </div>
        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment }}>area51.py</span>
        <button onClick={handleRun} disabled={busy || !!pyodideError}
          style={{ background: busy ? D.currentLine : D.purple, color: busy ? D.comment : D.bg, border: "none", borderRadius: 6, padding: "5px 14px", fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", minHeight: 32, minWidth: 90 }}>
          {pyodideLoading ? "Loading…" : running ? "Running…" : "▶  Run"}
        </button>
      </div>
      <textarea value={code} onChange={e => { setCode(e.target.value); setOutput(null); }} onKeyDown={handleKeyDown} spellCheck={false}
        style={{ width: "100%", minHeight: 120, padding: "12px 14px", background: D.bg, border: "none", outline: "none", resize: "vertical", fontFamily: "'Fira Code',monospace", fontSize: 13, lineHeight: 1.7, color: D.green, caretColor: D.purple, boxSizing: "border-box", WebkitTextSizeAdjust: "100%" }}/>
      {output !== null && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${D.currentLine}`, background: D.bgDark }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: D.comment, marginBottom: 6 }}>Output</div>
          <pre style={{ margin: 0, fontFamily: "'Fira Code',monospace", fontSize: 13, lineHeight: 1.6, color: isErr ? D.red : D.cyan, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}</pre>
        </div>
      )}
      {pyodideError && <div style={{ padding: "8px 14px" }}><span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.orange }}>⚠ {pyodideError}</span></div>}
    </div>
  );
}
