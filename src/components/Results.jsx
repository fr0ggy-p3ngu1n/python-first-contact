import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { D } from "../constants/palette.js";
import { ALL_QUESTIONS } from "../constants/questions.js";
import { ShareCard } from "./ShareCard.jsx";

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec.toString().padStart(2, "0")}s` : `${s}s`;
}

export function Results({ score, total, pct, bestStreak, missed, confidenceData, timePerQ, chapter, isMobile, onRetryAll, onRetryMissed, xpEarned = 0, speedTime = null, speedPB = null }) {
  const tier = pct >= 90 ? { label: "Exam Ready", color: D.cyan } : pct >= 70 ? { label: "Almost There", color: D.green } : pct >= 50 ? { label: "Keep Studying", color: D.yellow } : { label: "More Practice Needed", color: D.red };

  useEffect(() => {
    if (pct < 100) return;
    const end = Date.now() + 3000;
    const colors = [D.purple, D.cyan, D.green, D.pink, D.yellow, D.orange];
    (function frame() {
      confetti({ particleCount: 4, angle: 60,  spread: 70, origin: { x: 0 }, colors, zIndex: 999 });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors, zIndex: 999 });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const topicMap = {};
  ALL_QUESTIONS.forEach(q => { topicMap[q.topic] = { correct: 0, total: 0 }; });
  confidenceData.forEach(({ topic, correct }) => {
    if (topicMap[topic]) { topicMap[topic].total++; if (correct) topicMap[topic].correct++; }
  });
  const attempted    = Object.entries(topicMap).filter(([, v]) => v.total > 0).sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total);
  const luckyGuesses = confidenceData.filter(d => d.correct && d.confidence === "guessed");
  const avgTime      = timePerQ.length > 0 ? Math.round(timePerQ.reduce((a, b) => a + b, 0) / timePerQ.length) : null;

  const [tab, setTab] = useState("overview");
  const tabs = [["overview", "Overview"], ["topics", "By Topic"], ["share", "Share"]];

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: isMobile ? "28px 0" : "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: D.comment, marginBottom: 10 }}>Final Score</div>
        <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 72 : 88, fontWeight: 700, color: tier.color, lineHeight: 1, marginBottom: 4 }}>
          {pct}<span style={{ fontSize: isMobile ? 28 : 34, color: D.comment }}>%</span>
        </div>
        <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: tier.color, marginBottom: 8 }}>{tier.label}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[
            { v: `${score}/${total}`, l: "correct" },
            { v: `${bestStreak}🔥`,  l: "best streak" },
            ...(avgTime !== null ? [{ v: `${avgTime}s`, l: "avg/question" }] : []),
            ...(xpEarned > 0     ? [{ v: `+${xpEarned}✨`, l: "xp earned" }] : []),
            ...(speedTime !== null ? [{ v: fmtTime(speedTime), l: speedPB === speedTime ? "new pb ⚡" : "run time" }] : []),
          ].map(({ v, l }, i) => {
            const isNewPB = l === "new pb ⚡";
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 15, fontWeight: 700, color: isNewPB ? D.yellow : D.fg }}>{v}</div>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, color: isNewPB ? D.yellow : D.comment, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: D.bgDark, borderRadius: 10, padding: 4 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex: 1, padding: "9px", borderRadius: 7, border: "none", background: tab === key ? D.currentLine : "transparent", color: tab === key ? D.fg : D.comment, fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          {luckyGuesses.length > 0 && (
            <div style={{ background: `${D.yellow}14`, border: `1px solid ${D.yellow}44`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.yellow, marginBottom: 8 }}>⚠ Lucky Guesses</div>
              <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, lineHeight: 1.6 }}>You got these right but weren't confident — review them:</div>
              {luckyGuesses.map((d, i) => (
                <div key={i} style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: D.yellow, marginTop: 4 }}>• {d.topic}</div>
              ))}
            </div>
          )}
          {missed.length > 0 && (
            <div style={{ background: `${D.red}10`, border: `1px solid ${D.red}33`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: D.red, marginBottom: 10 }}>Missed Topics</div>
              {missed.map((t, i) => (
                <div key={i} style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: D.red, fontFamily: "'Fira Code',monospace", fontSize: 12 }}>✗</span>{t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "topics" && (
        <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          {attempted.length === 0 ? <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 13, color: D.comment }}>No data yet</div> : (
            attempted.map(([topic, { correct, total: t }], i) => {
              const p = Math.round((correct / t) * 100);
              const c = p === 100 ? D.green : p >= 70 ? D.cyan : p >= 50 ? D.yellow : D.red;
              return (
                <div key={i} style={{ marginBottom: i < attempted.length - 1 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.fg }}>{topic}</span>
                    <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 700, color: c }}>{correct}/{t}</span>
                  </div>
                  <div style={{ height: 5, background: D.currentLine, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: c, borderRadius: 3 }}/>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "share" && (
        <ShareCard score={score} total={total} pct={pct} bestStreak={bestStreak} chapter={chapter} missed={missed} isMobile={isMobile}/>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
        <button onClick={onRetryAll}
          style={{ background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", border: "none", borderRadius: 8, padding: "14px 28px", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 48 }}>
          Restart Quiz
        </button>
        {missed.length > 0 && (
          <button onClick={onRetryMissed}
            style={{ background: "transparent", color: D.red, border: `1.5px solid ${D.red}66`, borderRadius: 8, padding: "14px 24px", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 48 }}>
            Retry Missed ({missed.length})
          </button>
        )}
      </div>
    </div>
  );
}
