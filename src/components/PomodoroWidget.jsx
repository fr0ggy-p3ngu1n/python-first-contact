import { D } from "../constants/palette.js";

export function PomodoroWidget({ timeLeft, active, finished, start, pause, reset, fmt, total, isMobile }) {
  const pct   = timeLeft / total;
  const color = finished ? D.red : active ? D.green : D.comment;
  return (
    <div style={{ background: D.bg, border: `1px solid ${finished ? D.red : D.currentLine}`, borderRadius: 10, padding: isMobile ? "10px 14px" : "12px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🛸</span>
          <div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 18 : 22, fontWeight: 700, color, lineHeight: 1 }}>{fmt(timeLeft)}</div>
            <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, color: D.comment, marginTop: 2 }}>
              {finished ? "Break time!" : active ? "Focus session" : "25 min focus timer"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!finished && (
            <button onClick={active ? pause : start}
              style={{ background: active ? `${D.orange}20` : D.currentLine, border: `1px solid ${active ? D.orange : D.currentLine}`, borderRadius: 6, padding: "6px 16px", fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: 700, color: active ? D.orange : D.fg, cursor: "pointer", minHeight: 34 }}>
              {active ? "Pause" : "Start"}
            </button>
          )}
          <button onClick={reset}
            style={{ background: "none", border: `1px solid ${D.currentLine}`, borderRadius: 6, padding: "6px 12px", fontFamily: "'Fira Code',monospace", fontSize: 14, color: D.comment, cursor: "pointer", minHeight: 34 }}>
            ↺
          </button>
        </div>
      </div>
      <div style={{ height: 3, background: D.currentLine, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: finished ? D.red : D.green, borderRadius: 2, transition: "width 1s linear" }}/>
      </div>
    </div>
  );
}
