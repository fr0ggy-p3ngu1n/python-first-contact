import { useState } from "react";
import { D } from "../constants/palette.js";

export function ShareCard({ score, total, pct, bestStreak, chapter, missed, isMobile }) {
  const [copied, setCopied] = useState(false);
  const weakList = missed.slice(0, 3).join(", ");
  const emoji = pct >= 90 ? "👾✨" : pct >= 70 ? "👽📚" : pct >= 50 ? "🛸💪" : "🌍😅";
  const card = [
    `${emoji} Python: First Contact · ${chapter}`,
    `📊 Score: ${pct}% (${score}/${total})`,
    `🔥 Best Streak: ${bestStreak}x`,
    missed.length > 0 ? `📌 Review: ${weakList}` : `🎯 Clean sweep!`,
    `🗓 ${new Date().toLocaleDateString()}`,
    ``,
    `▓`.repeat(Math.round(pct / 5)) + `░`.repeat(20 - Math.round(pct / 5)),
  ].join("\n");

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(card); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { alert(card); }
  };

  return (
    <div style={{ background: D.bgDark, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.comment, marginBottom: 10 }}>Share Your Score</div>
      <pre style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 11 : 12, color: D.fg, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, marginBottom: 12 }}>{card}</pre>
      <button onClick={handleCopy}
        style={{ background: copied ? `${D.green}20` : D.currentLine, border: `1px solid ${copied ? D.green : D.comment}44`, borderRadius: 7, padding: "10px 18px", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 700, color: copied ? D.green : D.fg, cursor: "pointer", transition: "all 0.2s" }}>
        {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
      </button>
    </div>
  );
}
