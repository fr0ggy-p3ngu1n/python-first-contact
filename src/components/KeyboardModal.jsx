import { D } from "../constants/palette.js";

const SHORTCUTS = [
  ["1 – 4",         "Answer instantly"],
  ["Enter / Space", "Confirm selection · advance"],
  ["H",             "Toggle hint"],
  ["T",             "Toggle Python sandbox"],
  ["?",             "Show this keyboard reference"],
  ["Esc",           "Return to menu"],
];

export function KeyboardModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 14, padding: "26px 24px", width: "100%", maxWidth: 380, animation: "slideUp 0.25s ease-out" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 16, fontWeight: 800, color: D.fg, marginBottom: 20 }}>⌨ Keyboard Shortcuts</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <kbd style={{ background: D.currentLine, border: `1px solid ${D.purple}55`, borderRadius: 6, padding: "5px 12px", fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.purple, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                {key}
              </kbd>
              <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, textAlign: "right" }}>{desc}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose}
          style={{ marginTop: 20, width: "100%", padding: "12px", borderRadius: 8, border: "none", background: D.currentLine, color: D.fg, fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  );
}
