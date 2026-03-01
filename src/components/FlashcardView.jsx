import { useState } from "react";
import { D } from "../constants/palette.js";
import { syntaxHighlight } from "../utils/syntaxHighlight.jsx";
import { ProgressBar } from "./ProgressBar.jsx";

export function FlashcardView({ questions, accent, sounds, isMobile, onDone }) {
  const [idx,      setIdx]      = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [knew,     setKnew]     = useState(new Set());
  const [learning, setLearning] = useState(new Set());
  const q     = questions[idx];
  const total = questions.length;
  const done  = idx >= total;

  const handleFlip     = () => { setFlipped(f => !f); sounds.flip(); };
  const handleKnew     = () => { sounds.correct(); setKnew(s => new Set([...s, q.id]));     setFlipped(false); setIdx(i => i + 1); };
  const handleLearning = () => { sounds.wrong();   setLearning(s => new Set([...s, q.id])); setFlipped(false); setIdx(i => i + 1); };

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 64, fontWeight: 700, color: D.green, lineHeight: 1, marginBottom: 8 }}>{knew.size}</div>
      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 18, fontWeight: 700, color: D.fg, marginBottom: 4 }}>Knew it!</div>
      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 13, color: D.comment, marginBottom: 32 }}>{learning.size} still learning</div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onDone}
          style={{ background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", border: "none", borderRadius: 8, padding: "14px 28px", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Back to Menu
        </button>
        {learning.size > 0 && (
          <button onClick={() => { setIdx(0); setFlipped(false); setKnew(new Set()); setLearning(new Set()); }}
            style={{ background: "transparent", color: D.orange, border: `1.5px solid ${D.orange}66`, borderRadius: 8, padding: "14px 24px", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Retry Learning ({learning.size})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.comment }}>{idx + 1} / {total}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.green }}>✓ {knew.size}</span>
          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.orange }}>~ {learning.size}</span>
        </div>
      </div>
      <ProgressBar current={idx} total={total} color={accent}/>
      <div style={{ marginTop: 16 }}/>

      <div className="flashcard-wrap" onClick={handleFlip} style={{ perspective: 1000, cursor: "pointer", marginBottom: 16 }}>
        <div className={`flashcard-inner${flipped ? " flipped" : ""}`} style={{ position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s", height: isMobile ? 340 : 360 }}>
          {/* Front */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 12, padding: isMobile ? "20px 18px" : "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: 6, padding: "4px 10px", marginBottom: 12 }}>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 600, color: accent }}>{q.topic}</span>
              </div>
              <h2 style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 16 : 18, fontWeight: 700, color: D.fg, lineHeight: 1.45, marginBottom: 12 }}>{q.question}</h2>
              <div style={{ background: D.bgDark, borderRadius: 8, padding: "10px 12px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <pre style={{ margin: 0, fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 11 : 12, lineHeight: 1.7 }}>{syntaxHighlight(q.code)}</pre>
              </div>
            </div>
            <div style={{ textAlign: "center", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.comment, marginTop: 12 }}>👆 Tap to reveal answer</div>
          </div>
          {/* Back */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: D.bg, border: `1px solid ${accent}66`, borderRadius: 12, padding: isMobile ? "20px 18px" : "28px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: accent, marginBottom: 10 }}>Answer</div>
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 17 : 20, fontWeight: 700, color: D.fg, marginBottom: 16, lineHeight: 1.4 }}>{q.options[q.correct]}</div>
            <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 14 : 15, fontWeight: 500, color: D.fg, lineHeight: 1.65, opacity: 0.85 }}>{q.explanation}</div>
          </div>
        </div>
      </div>

      {flipped && (
        <div style={{ display: "flex", gap: 10, animation: "fadeIn 0.3s ease" }}>
          <button onClick={handleLearning}
            style={{ flex: 1, padding: "14px", borderRadius: 8, border: `1.5px solid ${D.orange}66`, background: `${D.orange}14`, color: D.orange, fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 48 }}>
            Still Learning 🔁
          </button>
          <button onClick={handleKnew}
            style={{ flex: 1, padding: "14px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${D.green},${D.cyan})`, color: D.bgDark, fontFamily: "'Fira Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 48 }}>
            Got it! ✓
          </button>
        </div>
      )}
      {!flipped && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDone}
            style={{ background: "none", border: `1px solid ${D.currentLine}`, borderRadius: 8, padding: "12px 20px", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.comment, cursor: "pointer" }}>
            ← Menu
          </button>
        </div>
      )}
    </div>
  );
}
