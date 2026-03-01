import { D } from "../constants/palette.js";
import { ACHIEVEMENTS } from "../hooks/useAchievements.js";

function StreakCalendar({ history }) {
  const dateMap = {};
  history.forEach(s => {
    if (!s.date) return;
    const d = new Date(s.date);
    if (isNaN(d)) return;
    const key = d.toDateString();
    dateMap[key] = Math.max(dateMap[key] || 0, s.pct || 0);
  });
  const cells = [];
  for (let i = 34; i >= 0; i--) {
    const d   = new Date(Date.now() - i * 86400000);
    const key = d.toDateString();
    const pct = dateMap[key];
    const active = pct !== undefined;
    const color  = !active ? D.currentLine : pct >= 90 ? D.cyan : pct >= 70 ? D.green : pct >= 50 ? D.yellow : D.orange;
    cells.push({ key, active, color, pct });
  }
  return (
    <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.comment, marginBottom: 12 }}>Activity — Last 35 Days</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map(({ key, active, color, pct }) => (
          <div key={key} title={active ? `${key}: ${pct}%` : key}
            style={{ height: 20, borderRadius: 3, background: color, opacity: active ? 1 : 0.35 }}/>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {[[D.cyan, "90–100%"], [D.green, "70–89%"], [D.yellow, "50–69%"], [D.orange, "<50%"], [D.currentLine, "None"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: c }}/>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Dashboard({ history, onClear, onBack, isMobile, earned = new Set() }) {
  if (history.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 48, marginBottom: 16 }}>📊</div>
      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 18, fontWeight: 700, color: D.fg, marginBottom: 8 }}>No sessions yet</div>
      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 13, color: D.comment, marginBottom: 32 }}>Complete a quiz to see your stats here</div>
      <button onClick={onBack} style={{ background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", border: "none", borderRadius: 8, padding: "14px 28px", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
        ← Back to Menu
      </button>
    </div>
  );

  const topicMisses = {};
  history.forEach(s => { (s.missed || []).forEach(t => { topicMisses[t] = (topicMisses[t] || 0) + 1; }); });
  const weakSpots = Object.entries(topicMisses).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalQ    = history.reduce((a, s) => a + (s.total || 0), 0);
  const totalC    = history.reduce((a, s) => a + (s.score || 0), 0);
  const bestStreak = Math.max(...history.map(s => s.bestStreak || 0));

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: D.comment, cursor: "pointer", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 20, minHeight: 44, padding: "0 4px" }}>
        ← Back
      </button>
      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: D.comment, marginBottom: 16 }}>Your Stats</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Sessions",    value: history.length,                                           color: D.purple },
          { label: "Accuracy",    value: `${totalQ ? Math.round((totalC / totalQ) * 100) : 0}%`,  color: D.cyan   },
          { label: "Best Streak", value: `${bestStreak}🔥`,                                        color: D.orange },
        ].map(({ label, value, color }, i) => (
          <div key={i} style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 20 : 24, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, color: D.comment, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      <StreakCalendar history={history}/>

      <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.comment, marginBottom: 14 }}>Recent Sessions</div>
        {history.slice(0, 7).map((s, i) => {
          const pct   = s.pct || 0;
          const color = pct >= 90 ? D.cyan : pct >= 70 ? D.green : pct >= 50 ? D.yellow : D.red;
          const d     = new Date(s.date);
          const label = isNaN(d) ? s.chapter || "Quiz" : `${d.getMonth() + 1}/${d.getDate()} · ${s.chapter || "Quiz"}`;
          return (
            <div key={i} style={{ marginBottom: i < Math.min(history.length, 7) - 1 ? 10 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.fg }}>{label}</span>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: D.currentLine, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {weakSpots.length > 0 && (
        <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.red, marginBottom: 12 }}>Weak Spots</div>
          {weakSpots.map(([topic, count], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, marginBottom: 8 }}>
              <span>✗ {topic}</span>
              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.red }}>{count} miss{count > 1 ? "es" : ""}</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(topicMisses).length > 0 && (
        <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.comment, marginBottom: 14 }}>Topic Miss History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(topicMisses).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([topic, count], i) => {
              const badgeColor = count >= 3 ? D.red : count === 2 ? D.yellow : D.green;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topic}</span>
                  <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 700, color: badgeColor, background: `${badgeColor}18`, border: `1px solid ${badgeColor}44`, borderRadius: 5, padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {count} ✗
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.comment, marginBottom: 14 }}>
          Achievements <span style={{ color: D.purple, fontFamily: "'Fira Code',monospace" }}>{earned.size}/{ACHIEVEMENTS.length}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 8 }}>
          {ACHIEVEMENTS.map(a => {
            const unlocked = earned.has(a.id);
            return (
              <div key={a.id} title={a.desc}
                style={{ background: unlocked ? `${D.purple}18` : D.bgDark, border: `1.5px solid ${unlocked ? D.purple + "66" : D.currentLine}`, borderRadius: 8, padding: "12px 10px", textAlign: "center", opacity: unlocked ? 1 : 0.45, transition: "all 0.2s" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{unlocked ? a.icon : "🔒"}</div>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, color: unlocked ? D.fg : D.comment, marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: D.comment, lineHeight: 1.4 }}>{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={onClear}
        style={{ background: "none", border: `1px solid ${D.red}44`, borderRadius: 8, padding: "10px 18px", fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.red, cursor: "pointer", marginTop: 4 }}>
        Clear All History
      </button>
    </div>
  );
}
