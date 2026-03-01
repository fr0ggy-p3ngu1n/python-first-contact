import { D } from "../constants/palette.js";

export function DailyChallengeCard({ dailyQ, todayDone, record, streak, onStart, isMobile }) {
  return (
    <div style={{ background: D.bg, border: `1.5px solid ${todayDone ? `${D.green}55` : `${D.yellow}55`}`, borderRadius: 10, padding: isMobile ? "13px 15px" : "14px 18px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${D.yellow},${D.orange})` }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13 }}>⭐</span>
            <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.yellow }}>Daily Challenge</span>
            {streak > 1 && <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.orange }}>🔥 {streak} day streak</span>}
          </div>
          <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment, marginBottom: 4 }}>{dailyQ.topic}</div>
          {todayDone
            ? <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 600, color: record?.correct ? D.green : D.red }}>{record?.correct ? "✓ Completed today!" : "✗ Better luck tomorrow"}</div>
            : <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.comment }}>1 question · +20 XP bonus</div>
          }
        </div>
        {!todayDone && (
          <button onClick={onStart}
            style={{ background: `linear-gradient(135deg,${D.yellow},${D.orange})`, color: D.bgDark, border: "none", borderRadius: 7, padding: "9px 20px", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, minHeight: 40, whiteSpace: "nowrap" }}>
            Play →
          </button>
        )}
      </div>
    </div>
  );
}
