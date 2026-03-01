import { D } from "../constants/palette.js";
import { getLevel } from "../constants/levels.js";

export function LevelBadge({ xp, callsign, isMobile }) {
  const lv = getLevel(xp);
  return (
    <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: isMobile ? "10px 14px" : "12px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: isMobile ? 18 : 22 }}>{lv.icon}</span>
          <div>
            <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 700, color: D.purple }}>
              {callsign ? `${lv.label} · ${callsign}` : lv.label}
            </div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>Level {lv.level}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 12 : 13, fontWeight: 700, color: D.cyan }}>{xp.toLocaleString()} XP</div>
          {lv.next && <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, color: D.comment }}>{(lv.next.xp - xp).toLocaleString()} to {lv.next.label}</div>}
        </div>
      </div>
      <div style={{ height: 4, background: D.currentLine, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${lv.pct * 100}%`, background: `linear-gradient(90deg,${D.purple},${D.pink})`, borderRadius: 2, transition: "width 0.6s ease" }}/>
      </div>
    </div>
  );
}
