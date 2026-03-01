import { useEffect } from "react";
import { D } from "../constants/palette.js";

export function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [achievement?.id]); // re-arm timer for each new achievement

  if (!achievement) return null;
  return (
    <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", background: D.bg, border: `1.5px solid ${D.yellow}`, borderRadius: 12, padding: "14px 22px", display: "flex", alignItems: "center", gap: 14, zIndex: 200, animation: "slideUp 0.35s ease", boxShadow: "0 6px 32px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 28 }}>{achievement.icon}</span>
      <div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: D.yellow, marginBottom: 3 }}>Achievement Unlocked!</div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, color: D.fg, marginBottom: 2 }}>{achievement.label}</div>
        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment }}>{achievement.desc}</div>
      </div>
    </div>
  );
}
