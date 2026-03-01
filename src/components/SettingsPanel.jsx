import { useState } from "react";
import { D } from "../constants/palette.js";

export function SettingsPanel({ settings, onChange, callsign, onCallsignSave, onClose }) {
  const [draft, setDraft] = useState(callsign);

  const handleCallsignBlur = () => onCallsignSave(draft);
  const handleCallsignKey  = (e) => { if (e.key === "Enter") { onCallsignSave(draft); e.target.blur(); } };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 14, padding: "24px 24px", width: "100%", maxWidth: 360, animation: "slideUp 0.25s ease-out" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 16, fontWeight: 800, color: D.fg, marginBottom: 20 }}>Settings</div>

        {/* Callsign */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: 600, color: D.comment, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Callsign</div>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value.toUpperCase().replace(/[^A-Z0-9 _-]/g, "").slice(0, 12))}
            onBlur={handleCallsignBlur}
            onKeyDown={handleCallsignKey}
            placeholder="e.g. ZARA"
            style={{ width: "100%", background: D.bgDark, border: `1.5px solid ${D.currentLine}`, borderRadius: 8, padding: "10px 14px", fontFamily: "'Fira Code',monospace", fontSize: 14, color: D.fg, outline: "none", boxSizing: "border-box", caretColor: D.purple }}
          />
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, color: D.comment, marginTop: 5 }}>Shown on your level badge. Up to 12 characters.</div>
        </div>

        {/* Sound */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: 600, color: D.comment, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Sound Effects</div>
          <button onClick={() => onChange({ ...settings, sound: !settings.sound })}
            style={{ background: settings.sound ? `${D.green}20` : D.currentLine, border: `1.5px solid ${settings.sound ? D.green : D.comment}44`, borderRadius: 8, padding: "10px 16px", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 700, color: settings.sound ? D.green : D.comment, cursor: "pointer", transition: "all 0.2s" }}>
            {settings.sound ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>
        </div>

        {/* Timer */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: 600, color: D.comment, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Timer Duration (Timed Mode)</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(t => (
              <button key={t} onClick={() => onChange({ ...settings, timerDuration: t })}
                style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1.5px solid ${settings.timerDuration === t ? D.purple : D.currentLine}`, background: settings.timerDuration === t ? `${D.purple}20` : D.bgDark, color: settings.timerDuration === t ? D.purple : D.comment, fontFamily: "'Fira Code',monospace", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {t}s
              </button>
            ))}
          </div>
        </div>


        <button onClick={onClose}
          style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Done
        </button>
      </div>
    </div>
  );
}
