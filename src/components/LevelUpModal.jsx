import { D } from "../constants/palette.js";

const FLAVOUR = {
  2: "The mothership has noticed your signal.",
  3: "You've been assigned to the Academy.",
  4: "Your neural link has been approved.",
  5: "Command frequencies are now open to you.",
  6: "You wield power beyond human comprehension.",
  7: "You ARE the algorithm.",
};

export function LevelUpModal({ levelData, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: D.bg, border: `2px solid ${D.purple}`, borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 360, textAlign: "center", animation: "popIn 0.4s ease-out", boxShadow: `0 0 60px ${D.purple}44` }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 60, marginBottom: 14, lineHeight: 1 }}>{levelData.icon}</div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: D.purple, marginBottom: 8 }}>Level Up!</div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 28, fontWeight: 800, color: D.fg, marginBottom: 6 }}>{levelData.label}</div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, color: D.comment, marginBottom: 6 }}>Level {levelData.level}</div>
        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 13, color: D.comment, marginBottom: 28, lineHeight: 1.7, fontStyle: "italic" }}>
          "{FLAVOUR[levelData.level] ?? "A new rank awaits."}"
        </div>
        <button onClick={onClose}
          style={{ background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", border: "none", borderRadius: 8, padding: "13px 36px", fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}
