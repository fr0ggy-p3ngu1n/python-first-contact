import { useState, useEffect, useRef } from "react";

import { D }            from "./constants/palette.js";
import { ALL_QUESTIONS } from "./constants/questions.js";
import { CHAPTERS }     from "./constants/chapters.js";
import { getLevel }     from "./constants/levels.js";

import { useIsMobile }       from "./hooks/useIsMobile.js";
import { useSounds }         from "./hooks/useSounds.js";
import { useTimer }          from "./hooks/useTimer.js";
import { useSessionHistory } from "./hooks/useSessionHistory.js";
import { useXP }             from "./hooks/useXP.js";
import { useDailyChallenge } from "./hooks/useDailyChallenge.js";
import { usePomodoro }       from "./hooks/usePomodoro.js";
import { usePyodide }        from "./hooks/usePyodide.js";
import { useCallsign }       from "./hooks/useCallsign.js";
import { useAchievements }   from "./hooks/useAchievements.js";

import { AlienLogo }          from "./components/AlienLogo.jsx";
import { ProgressBar }        from "./components/ProgressBar.jsx";
import { CodeSandbox }        from "./components/CodeSandbox.jsx";
import { FlashcardView }      from "./components/FlashcardView.jsx";
import { Dashboard }          from "./components/Dashboard.jsx";
import { Results }            from "./components/Results.jsx";
import { SettingsPanel }      from "./components/SettingsPanel.jsx";
import { Toast }              from "./components/Toast.jsx";
import { LevelBadge }         from "./components/LevelBadge.jsx";
import { PomodoroWidget }     from "./components/PomodoroWidget.jsx";
import { DailyChallengeCard } from "./components/DailyChallengeCard.jsx";
import { AchievementToast }   from "./components/AchievementToast.jsx";
import { LevelUpModal }       from "./components/LevelUpModal.jsx";
import { KeyboardModal }      from "./components/KeyboardModal.jsx";

import { syntaxHighlight }  from "./utils/syntaxHighlight.jsx";
import { getDailyQuestion } from "./utils/dailyQuestion.js";
import { CSS }              from "./styles.js";

/* ─── Speed run PB helpers ──────────────────────────────────────────────── */
function fmtTime(s) {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
function getSpeedPB(chapterLabel) {
  try { return JSON.parse(localStorage.getItem("pyquiz-speedpb") || "{}")[chapterLabel] ?? null; }
  catch { return null; }
}
function setSpeedPB(chapterLabel, seconds) {
  try {
    const all = JSON.parse(localStorage.getItem("pyquiz-speedpb") || "{}");
    all[chapterLabel] = seconds;
    localStorage.setItem("pyquiz-speedpb", JSON.stringify(all));
  } catch {}
}

/* ─── MAIN APP ──────────────────────────────────────────────────────────── */
export default function PythonQuiz() {
  const isMobile  = useIsMobile();
  const [settings, setSettings] = useState({ sound: true, timerDuration: 30 });
  const sounds    = useSounds(settings.sound);
  const { history, save: saveSession, clear: clearHistory } = useSessionHistory();
  const { loading: pyLoading, error: pyError, runCode, load: loadPyodide } = usePyodide();
  const { xp, xpHydrated, addXP } = useXP();
  const daily      = useDailyChallenge();
  const pomodoro   = usePomodoro();
  const { callsign, save: saveCallsign } = useCallsign();
  const achieve    = useAchievements();

  const [isDailyMode, setIsDailyMode] = useState(false);
  const [sessionXP,   setSessionXP]   = useState(0);

  // ── Global overlay state ──
  const [showSettings,     setShowSettings]     = useState(false);
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [levelUpData,      setLevelUpData]      = useState(null);

  // Level-up detection: fires only after XP hydrates from localStorage
  const xpInitRef   = useRef(false);
  const prevLevelRef = useRef(null);
  useEffect(() => {
    if (!xpHydrated) return;
    const lvl = getLevel(xp).level;
    if (!xpInitRef.current) {
      xpInitRef.current = true;
      prevLevelRef.current = lvl;
      return;
    }
    if (prevLevelRef.current !== null && lvl > prevLevelRef.current) {
      setLevelUpData(getLevel(xp));
    }
    prevLevelRef.current = lvl;
  }, [xp, xpHydrated]);

  // Sound when pomodoro finishes
  useEffect(() => { if (pomodoro.finished) sounds.timeUp(); }, [pomodoro.finished]);

  // ── View + mode ──
  const [view,       setView]       = useState("menu");
  const [mode,       setMode]       = useState("standard");
  const [chapterIdx, setChapterIdx] = useState(0);
  const [questions,  setQuestions]  = useState([]);
  const [retriedIds, setRetriedIds] = useState(new Set());

  // ── Per-question state ──
  const [current,      setCurrent]      = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [confirmed,    setConfirmed]    = useState(false);
  const [fillInput,    setFillInput]    = useState("");
  const [fillCorrect,  setFillCorrect]  = useState(null);
  const [confidence,   setConfidence]   = useState(null);
  const [showHint,     setShowHint]     = useState(false);
  const [hintPenalized, setHintPenalized] = useState(false);
  const [showSandbox,  setShowSandbox]  = useState(false);
  const [shake,        setShake]        = useState(false);
  const [toast,        setToast]        = useState(null);

  // ── Scoring ──
  const [score,          setScore]         = useState(0);
  const [streak,         setStreak]        = useState(0);
  const [bestStreak,     setBestStreak]    = useState(0);
  const [missed,         setMissed]        = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);
  const [timePerQ,       setTimePerQ]      = useState([]);
  const [qStartTime,     setQStartTime]    = useState(Date.now());

  // ── Speed run ──
  const [speedElapsed,   setSpeedElapsed]  = useState(0);
  const quizStartTimeRef   = useRef(null);
  const sessionHintUsedRef = useRef(false);
  const fastAnswerCountRef = useRef(0);
  const confidenceLoggedRef = useRef(false);
  const fillRef = useRef(null);

  // Speed run interval
  useEffect(() => {
    if (mode !== "speed" || view !== "quiz") return;
    const id = setInterval(() => {
      setSpeedElapsed(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [mode, view]);

  const q           = questions[current];
  const isFillBlank = !!q?.fillBlankAnswer;
  const accentColor = CHAPTERS[chapterIdx]?.accent ?? D.purple;
  const isTimed     = mode === "timed";
  const isSpeedRun  = mode === "speed";
  const isReview    = q && retriedIds.has(q.id);

  // ── Timer (timed mode) ──
  const timerActive = isTimed && !confirmed && view === "quiz";
  const timeLeft    = useTimer(settings.timerDuration, timerActive, current, () => {
    if (!confirmed) { sounds.timeUp(); handleAutoExpire(); }
  });
  const timerPct   = (timeLeft / settings.timerDuration) * 100;
  const timerColor = timerPct > 50 ? D.green : timerPct > 25 ? D.yellow : D.red;

  const showToast = (msg, color = D.purple) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2200);
  };

  function handleAutoExpire() {
    // If user already tapped an answer, honour their selection — timer just auto-confirms it
    if (selected !== null) {
      handleConfirm();
      return;
    }
    setConfirmed(true);
    setStreak(0);
    setMissed(m => [...m, q.topic]);
    setConfidenceData(d => [...d, { topic: q.topic, correct: false, confidence: "timeup" }]);
    setTimePerQ(t => [...t, settings.timerDuration]);
    showToast("⏰ Time's up!", D.red);
  }

  // ── Start quiz ──
  const startQuiz = (chapIdx, pool, m = "standard", isDaily = false) => {
    const ch       = CHAPTERS[chapIdx];
    const qs       = pool || (ch.ids ? ALL_QUESTIONS.filter(q => ch.ids.includes(q.id)) : ALL_QUESTIONS);
    const shuffled = [...qs].sort(() => Math.random() - 0.5).map(qItem => {
      if (qItem.fillBlankAnswer) return qItem;
      // Fisher-Yates shuffle — unbiased, guaranteed correct index tracking
      const order = [0, 1, 2, 3];
      for (let i = 3; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return { ...qItem, options: order.map(i => qItem.options[i]), correct: order.indexOf(qItem.correct) };
    });
    setIsDailyMode(isDaily);
    setSessionXP(0);
    if (m === "flashcard") {
      setQuestions(shuffled); setChapterIdx(chapIdx); setMode(m); setView("flashcard");
      return;
    }
    setQuestions(shuffled);
    setChapterIdx(chapIdx); setMode(m);
    setCurrent(0); setSelected(null); setConfirmed(false);
    setFillInput(""); setFillCorrect(null); setConfidence(null);
    setShowHint(false); setHintPenalized(false); setShowSandbox(false);
    setScore(0); setStreak(0); setBestStreak(0);
    setMissed([]); setConfidenceData([]); setTimePerQ([]);
    setRetriedIds(new Set());
    setQStartTime(Date.now());
    quizStartTimeRef.current = Date.now();
    setSpeedElapsed(0);
    sessionHintUsedRef.current = false;
    fastAnswerCountRef.current = 0;
    confidenceLoggedRef.current = false;
    setView("quiz");
  };

  const startDailyChallenge = () => {
    if (daily.todayDone) return;
    startQuiz(0, [getDailyQuestion()], "standard", true);
  };

  const missedDrillQs = (() => {
    const topics = new Set();
    history.forEach(s => (s.missed || []).forEach(t => topics.add(t)));
    return ALL_QUESTIONS.filter(q => topics.has(q.topic));
  })();

  // ── Confirm answer ──
  const handleConfirm = (forceIdx = null) => {
    if (!q) return;
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    let correct;
    if (isFillBlank) {
      const raw     = fillInput.trim().toLowerCase();
      const expected = q.fillBlankAnswer.trim().toLowerCase();
      // Accept numeric equivalents: "22" matches "22.0", "24" matches "24.0", etc.
      const numRaw  = Number(raw);
      const numExp  = Number(expected);
      correct = raw === expected ||
                (!isNaN(numRaw) && !isNaN(numExp) && numRaw === numExp);
      setFillCorrect(correct);
    } else {
      const sel = forceIdx !== null ? forceIdx : selected;
      if (sel === null) return;
      setSelected(sel);
      correct = sel === q.correct;
    }
    setConfirmed(true);
    setTimePerQ(t => [...t, elapsed]);
    if (correct) {
      sounds.correct();
      setScore(s => s + 1);
      const ns = streak + 1; setStreak(ns); setBestStreak(b => Math.max(b, ns));
      // Fast answer tracking
      if (elapsed < 5) {
        fastAnswerCountRef.current += 1;
        if (fastAnswerCountRef.current >= 5) achieve.award("speed_demon");
      }
      // Streak achievement
      if (ns >= 10) achieve.award("on_fire");
      // XP
      let xpGain = 10;
      if (!hintPenalized) xpGain += 5;
      if (ns >= 3)        xpGain += 5;
      if (elapsed < 8)    xpGain += 5;
      if (isDailyMode)    xpGain += 20;
      addXP(xpGain);
      setSessionXP(p => p + xpGain);
      // Overlord achievement (check after addXP updates xp asynchronously — use optimistic check)
      if (getLevel(xp + xpGain).level >= 6) achieve.award("overlord");
      if (ns >= 3) { sounds.streak(); showToast(`🔥 ${ns}x  +${xpGain} XP`, D.orange); }
      else         {                   showToast(`+${xpGain} XP`, D.yellow); }
    } else {
      sounds.wrong();
      setShake(true); setTimeout(() => setShake(false), 600);
      setStreak(0);
      setMissed(m => [...m, q.topic]);
      if (!retriedIds.has(q.id)) {
        const insertAt = Math.min(current + 2 + Math.floor(Math.random() * 3), questions.length);
        setQuestions(qs => { const next = [...qs]; next.splice(insertAt, 0, q); return next; });
        setRetriedIds(s => new Set([...s, q.id]));
        showToast("↩ Coming back for review!", D.cyan);
      }
    }
  };

  const handleConfidence = (c) => {
    setConfidence(c);
    if (!confidenceLoggedRef.current) {
      confidenceLoggedRef.current = true;
      const correct = isFillBlank ? fillCorrect : selected === q.correct;
      setConfidenceData(d => [...d, { topic: q.topic, correct, confidence: c }]);
    }
  };

  // ── Next question / finish quiz ──
  const handleNext = () => {
    if (!confidenceLoggedRef.current) {
      confidenceLoggedRef.current = true;
      const correct = isFillBlank ? fillCorrect : selected === q.correct;
      setConfidenceData(d => [...d, { topic: q.topic, correct, confidence: "skipped" }]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (current + 1 >= questions.length) {
      // Finish quiz
      if (isDailyMode) {
        const correct = isFillBlank ? fillCorrect : selected === q?.correct;
        daily.markDone(correct);
        setIsDailyMode(false);
        if (daily.streak + 1 >= 3) achieve.award("daily_devotee");
      }
      const actualScore = score;
      const finalPct    = Math.round((actualScore / questions.length) * 100);
      const totalTime   = isSpeedRun ? Math.floor((Date.now() - quizStartTimeRef.current) / 1000) : null;

      // Speed run PB
      let isNewPB = false;
      if (isSpeedRun && totalTime !== null) {
        const chLabel = CHAPTERS[chapterIdx].label;
        const pb = getSpeedPB(chLabel);
        if (pb === null || totalTime < pb) { setSpeedPB(chLabel, totalTime); isNewPB = true; }
      }

      // Achievements
      achieve.award("first_contact");
      if (finalPct === 100)               achieve.award("flawless");
      if (!sessionHintUsedRef.current)    achieve.award("no_hints");
      if (history.length + 1 >= 10)       achieve.award("veteran");

      saveSession({
        date:       new Date().toISOString(),
        chapter:    CHAPTERS[chapterIdx].label,
        score:      actualScore,
        total:      questions.length,
        pct:        finalPct,
        bestStreak,
        missed:     [...new Set(missed)],
        speedTime:  totalTime,
      });

      if (isSpeedRun && isNewPB && totalTime !== null) {
        showToast(`⚡ New PB: ${fmtTime(totalTime)}!`, D.yellow);
      }

      setView("done");
    } else {
      // Track hint usage at session level
      if (hintPenalized) sessionHintUsedRef.current = true;
      setCurrent(c => c + 1);
      setSelected(null); setConfirmed(false);
      setFillInput(""); setFillCorrect(null); setConfidence(null);
      setShowHint(false); setHintPenalized(false); setShowSandbox(false);
      setQStartTime(Date.now());
      confidenceLoggedRef.current = false;
    }
  };

  // ── Keyboard navigation (ref pattern — always uses latest closures) ──
  const kbHandlerRef = useRef(null);
  useEffect(() => {
    if (view !== "quiz") { kbHandlerRef.current = null; return; }
    kbHandlerRef.current = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "textarea" || tag === "input") return;
      if (e.key >= "1" && e.key <= "4" && !confirmed && !isFillBlank) {
        const idx = parseInt(e.key) - 1;
        if (q && idx < q.options.length) {
          sounds.select();
          handleConfirm(idx);
        }
      }
      if ((e.key === "Enter" || e.key === " ") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (!confirmed) handleConfirm(); else handleNext();
      }
      if ((e.key === "h" || e.key === "H") && !confirmed) {
        setShowHint(h => { if (!h) { sounds.hint(); setHintPenalized(true); } return !h; });
      }
      if (e.key === "t" || e.key === "T") { setShowSandbox(s => !s); loadPyodide(); }
      if (e.key === "?" || e.key === "/")  setShowKeyboardModal(m => !m);
      if (e.key === "Escape") {
        if (showKeyboardModal) setShowKeyboardModal(false);
        else setView("menu");
      }
    };
  });
  useEffect(() => {
    const handler = (e) => kbHandlerRef.current?.(e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Global overlays (rendered in all views) ──
  const overlays = (
    <>
      {achieve.current && <AchievementToast achievement={achieve.current} onDone={achieve.dismissFirst}/>}
      {levelUpData      && <LevelUpModal levelData={levelUpData} onClose={() => setLevelUpData(null)}/>}
      {showKeyboardModal && <KeyboardModal onClose={() => setShowKeyboardModal(false)}/>}
      {showSettings && (
        <SettingsPanel
          settings={settings} onChange={setSettings}
          callsign={callsign} onCallsignSave={saveCallsign}
          onClose={() => setShowSettings(false)}
        />
      )}
      {toast && <Toast message={toast.msg} color={toast.color}/>}
    </>
  );

  /* ── MENU ─────────────────────────────────────────────────────────── */
  if (view === "menu") return (
    <>
      <style>{CSS}</style>
      {overlays}
      <div style={{ minHeight: "100vh", background: D.bgDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : "32px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40, animation: "slideUp 0.4s ease-out", width: "100%", maxWidth: 520 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button onClick={() => setView("dashboard")}
              style={{ background: "none", border: `1px solid ${D.currentLine}`, borderRadius: 7, padding: "7px 12px", fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.comment, cursor: "pointer", marginRight: 8 }}>
              📊 Stats
            </button>
            <button onClick={() => setShowSettings(true)}
              style={{ background: "none", border: `1px solid ${D.currentLine}`, borderRadius: 7, padding: "7px 12px", fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.comment, cursor: "pointer" }}>
              ⚙ Settings
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <AlienLogo size={isMobile ? 52 : 68}/>
          </div>
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: D.comment, marginBottom: 6 }}>Xeno Corp Presents</div>
          <h1 style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 24 : 32, fontWeight: 800, color: D.fg, margin: "0 0 6px", letterSpacing: -0.5 }}>Python: First Contact</h1>
          <p style={{ fontFamily: "'Fira Code',monospace", color: D.comment, fontSize: 12, margin: 0, lineHeight: 1.6 }}>51 questions · Chapters 1–8 · Shuffled each round</p>
        </div>

        <div style={{ width: "100%", maxWidth: 520, animation: "slideUp 0.4s ease-out 0.06s both" }}>
          <LevelBadge xp={xp} callsign={callsign} isMobile={isMobile}/>
          <PomodoroWidget {...pomodoro} isMobile={isMobile}/>
          <DailyChallengeCard
            dailyQ={getDailyQuestion()} todayDone={daily.todayDone}
            record={daily.record} streak={daily.streak}
            onStart={startDailyChallenge} isMobile={isMobile}
          />

          {/* Mode selector */}
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: D.comment, marginBottom: 8 }}>Mode</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { key: "standard",  icon: "📝", label: "Standard",  sub: "No time limit" },
              { key: "timed",     icon: "⏱",  label: "Timed",     sub: `${settings.timerDuration}s / Q` },
              { key: "flashcard", icon: "🃏", label: "Flashcard", sub: "Flip to reveal" },
              { key: "speed",     icon: "⚡", label: "Speed Run",  sub: "Beat your best" },
            ].map(({ key, icon, label, sub }) => (
              <button key={key} onClick={() => setMode(key)}
                style={{ background: mode === key ? `${D.purple}20` : D.currentLine, border: `1.5px solid ${mode === key ? D.purple : D.currentLine}`, borderRadius: 10, padding: "10px 4px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, color: mode === key ? D.purple : D.fg }}>{label}</div>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: D.comment, marginTop: 2 }}>{sub}</div>
              </button>
            ))}
          </div>

          {/* Chapter selector */}
          <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: D.comment, marginBottom: 8 }}>Chapter</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {CHAPTERS.map((ch, i) => (
              <button key={i} onClick={() => startQuiz(i, null, mode)} className="chapter-btn"
                style={{ background: D.currentLine, border: "1.5px solid transparent", borderRadius: 10, padding: isMobile ? "13px 15px" : "14px 18px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 56, "--accent": ch.accent }}>
                <div>
                  <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 700, color: D.fg, marginBottom: 1 }}>{ch.label}</div>
                  <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>{ch.sub}</div>
                </div>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment, whiteSpace: "nowrap", marginLeft: 12 }}>
                  {ch.ids ? `${ch.ids.length} Qs` : "51 Qs"} →
                </div>
              </button>
            ))}
          </div>

          {missedDrillQs.length > 0 && (
            <button onClick={() => startQuiz(0, missedDrillQs, mode)} className="chapter-btn"
              style={{ marginTop: 7, width: "100%", background: `${D.red}10`, border: `1.5px solid ${D.red}44`, borderRadius: 10, padding: isMobile ? "13px 15px" : "14px 18px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 56, "--accent": D.red }}>
              <div>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 700, color: D.red, marginBottom: 1 }}>🎯 Weak Spots Drill</div>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>Your historically missed topics</div>
              </div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment, whiteSpace: "nowrap", marginLeft: 12 }}>
                {missedDrillQs.length} Qs →
              </div>
            </button>
          )}

          {!isMobile && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: D.bg, borderRadius: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[["1–4", "Select"], ["Enter", "Confirm/Next"], ["H", "Hint"], ["T", "Sandbox"], ["?", "Keys"], ["Esc", "Menu"]].map(([k, v]) => (
                <span key={k} style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment }}>
                  <span style={{ color: D.purple }}>{k}</span> {v}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  /* ── DASHBOARD ─────────────────────────────────────────────────────── */
  if (view === "dashboard") return (
    <>
      <style>{CSS}</style>
      {overlays}
      <div style={{ minHeight: "100vh", background: D.bgDark, padding: isMobile ? "16px 16px" : "32px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <Dashboard history={history} onClear={clearHistory} onBack={() => setView("menu")} isMobile={isMobile} earned={achieve.earned}/>
        </div>
      </div>
    </>
  );

  /* ── FLASHCARD ─────────────────────────────────────────────────────── */
  if (view === "flashcard") return (
    <>
      <style>{CSS}</style>
      {overlays}
      <div style={{ minHeight: "100vh", background: D.bgDark, display: "flex", flexDirection: "column" }}>
        <div style={{ background: D.bg, borderBottom: `1px solid ${D.currentLine}`, height: isMobile ? 52 : 56, display: "flex", alignItems: "center", padding: `0 ${isMobile ? "16px" : "24px"}`, gap: 12 }}>
          <AlienLogo size={isMobile ? 24 : 28}/>
          <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 700, color: D.fg, flex: 1 }}>
            {CHAPTERS[chapterIdx].label} · Flashcards
          </span>
        </div>
        <FlashcardView questions={questions} accent={accentColor} sounds={sounds} isMobile={isMobile} onDone={() => setView("menu")}/>
      </div>
    </>
  );

  /* ── DONE ──────────────────────────────────────────────────────────── */
  if (view === "done") {
    const finalScore   = score;
    const finalPct     = Math.round((finalScore / questions.length) * 100);
    const uniqueMissed = [...new Set(missed)];
    const speedTime    = isSpeedRun ? Math.floor((Date.now() - quizStartTimeRef.current) / 1000) : null;
    const speedPB      = isSpeedRun ? getSpeedPB(CHAPTERS[chapterIdx].label) : null;
    return (
      <>
        <style>{CSS}</style>
        {overlays}
        <div style={{ minHeight: "100vh", background: D.bgDark, padding: isMobile ? "16px 16px" : "32px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 640 }}>
            <button onClick={() => setView("menu")} style={{ background: "none", border: "none", color: D.comment, cursor: "pointer", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 8, minHeight: 44, padding: "0 4px" }}>
              ← Back to Menu
            </button>
            <Results
              score={finalScore} total={questions.length} pct={finalPct}
              bestStreak={bestStreak} missed={uniqueMissed}
              confidenceData={confidenceData} timePerQ={timePerQ}
              chapter={CHAPTERS[chapterIdx].label} isMobile={isMobile}
              xpEarned={sessionXP} speedTime={speedTime} speedPB={speedPB}
              onRetryAll={() => startQuiz(chapterIdx, null, mode)}
              onRetryMissed={() => {
                const missedQs = ALL_QUESTIONS.filter(q => uniqueMissed.includes(q.topic));
                startQuiz(chapterIdx, missedQs, mode);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  /* ── QUIZ ──────────────────────────────────────────────────────────── */
  const isCorrect = confirmed && (isFillBlank ? fillCorrect : selected === q?.correct);

  return (
    <>
      <style>{CSS}</style>
      {overlays}
      <div style={{ minHeight: "100vh", background: D.bgDark, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ background: D.bg, borderBottom: `1px solid ${D.currentLine}`, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: `0 ${isMobile ? "14px" : "24px"}`, display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? 52 : 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ flexShrink: 0 }}><AlienLogo size={isMobile ? 22 : 26}/></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontWeight: 700, fontSize: isMobile ? 12 : 13, color: D.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {CHAPTERS[chapterIdx].label}
                  {isTimed    && <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: timerColor, marginLeft: 8, fontWeight: 700 }}>{timeLeft}s</span>}
                  {isSpeedRun && <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.cyan, marginLeft: 8, fontWeight: 700 }}>⚡ {fmtTime(speedElapsed)}</span>}
                </div>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>
                  {current + 1} / {questions.length}
                  {isReview && <span style={{ color: D.cyan, marginLeft: 6 }}>↩ review</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, flexShrink: 0 }}>
              {streak >= 2 && (
                <div style={{ background: `${D.orange}20`, border: `1px solid ${D.orange}44`, borderRadius: 6, padding: isMobile ? "3px 8px" : "4px 12px", fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 11 : 12, color: D.orange, fontWeight: 600, animation: "popIn 0.3s ease", whiteSpace: "nowrap" }}>
                  {streak >= 5 ? "🔥🔥🔥" : streak >= 3 ? "🔥🔥" : "🔥"} {streak}x
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 17 : 20, fontWeight: 700, color: accentColor, lineHeight: 1 }}>{score}</div>
                <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 9, color: D.comment, letterSpacing: 1, textTransform: "uppercase" }}>pts</div>
              </div>
              <button onClick={() => setView("menu")} style={{ background: "none", border: `1px solid ${D.currentLine}`, borderRadius: 6, padding: isMobile ? "6px 10px" : "6px 12px", fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: 600, color: D.comment, cursor: "pointer", minHeight: 34, minWidth: isMobile ? 40 : 52 }}>
                {isMobile ? "✕" : "Menu"}
              </button>
            </div>
          </div>
          <ProgressBar current={current} total={questions.length} color={accentColor}/>
          {isTimed && !confirmed && (
            <div style={{ height: 2, background: D.currentLine, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, transition: "width 1s linear", animation: timerPct <= 25 ? "pulse 0.5s infinite" : undefined }}/>
            </div>
          )}
        </div>

        {/* Question */}
        <div style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: isMobile ? "14px 12px 32px" : "24px 24px 40px" }}>
          <div key={current} style={{ animation: "slideUp 0.3s ease-out" }}>

            <div style={{ background: D.bg, border: `1px solid ${D.currentLine}`, borderRadius: 12, overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.3)", animation: shake ? "shake 0.6s ease" : "none" }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${accentColor},${D.purple})` }}/>
              <div style={{ padding: isMobile ? "16px 14px 20px" : "22px 26px 22px" }}>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", background: `${accentColor}18`, border: `1px solid ${accentColor}44`, borderRadius: 6, padding: "4px 10px" }}>
                    <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 600, color: accentColor }}>{q.topic}</span>
                  </div>
                  {isFillBlank && (
                    <div style={{ display: "inline-flex", alignItems: "center", background: `${D.pink}18`, border: `1px solid ${D.pink}44`, borderRadius: 6, padding: "4px 10px" }}>
                      <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 600, color: D.pink }}>✏ Fill-in</span>
                    </div>
                  )}
                  {isReview && (
                    <div style={{ display: "inline-flex", alignItems: "center", background: `${D.cyan}18`, border: `1px solid ${D.cyan}44`, borderRadius: 6, padding: "4px 10px" }}>
                      <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 600, color: D.cyan }}>↩ Review</span>
                    </div>
                  )}
                </div>

                <h2 style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: isMobile ? 15 : 17, fontWeight: 700, color: D.fg, margin: "0 0 14px", lineHeight: 1.45 }}>{q.question}</h2>

                {/* Code block */}
                <div style={{ background: D.bgDark, border: `1px solid ${D.currentLine}`, borderRadius: 8, padding: isMobile ? "10px 12px" : "12px 16px", marginBottom: 16, position: "relative", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <div style={{ position: "absolute", top: 9, right: 10, fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>python</div>
                  <pre style={{ margin: 0, fontFamily: "'Fira Code',monospace", fontSize: isMobile ? 11 : 12, lineHeight: 1.75, overflowX: "auto" }}>{syntaxHighlight(q.code)}</pre>
                </div>

                {/* Hint */}
                {showHint && (
                  <div style={{ background: `${D.yellow}14`, border: `1px solid ${D.yellow}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, animation: "fadeIn 0.3s ease" }}>
                    <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 700, color: D.yellow }}>💡 Hint: </span>
                    <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg }}>{q.hint}</span>
                  </div>
                )}

                {/* Fill-in-blank */}
                {isFillBlank && !confirmed && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.comment, marginBottom: 8 }}>Type the exact output:</div>
                    <input ref={fillRef} value={fillInput} onChange={e => setFillInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleConfirm(); }}
                      placeholder="Type the exact Python output"
                      style={{ width: "100%", background: D.bgDark, border: `1.5px solid ${D.currentLine}`, borderRadius: 8, padding: "12px 14px", fontFamily: "'Fira Code',monospace", fontSize: 16, color: D.fg, outline: "none", boxSizing: "border-box", caretColor: D.purple }}/>
                  </div>
                )}
                {isFillBlank && confirmed && (
                  <div style={{ marginBottom: 16, padding: "12px 14px", background: fillCorrect ? `${D.green}14` : `${D.red}14`, border: `1px solid ${fillCorrect ? D.green : D.red}44`, borderRadius: 8, animation: "fadeIn 0.3s ease" }}>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, color: fillCorrect ? D.green : D.red, fontWeight: 700, marginBottom: 6 }}>
                      {fillCorrect ? "✓ Correct!" : "✗ Expected: "}{!fillCorrect && <span style={{ color: D.fg }}>{q.fillBlankAnswer}</span>}
                    </div>
                    <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, lineHeight: 1.6 }}>{q.explanation}</div>
                  </div>
                )}

                {/* MC options */}
                {!isFillBlank && (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 7 : 8 }}>
                    {q.options.map((opt, idx) => {
                      let bg = D.currentLine, border = "transparent", color = D.comment, labelColor = D.comment;
                      if (selected === idx && !confirmed) { bg = `${D.purple}20`; border = D.purple; color = D.fg; labelColor = D.purple; }
                      if (confirmed && idx === q.correct) { bg = `${D.green}20`; border = D.green; color = D.green; labelColor = D.green; }
                      if (confirmed && selected === idx && !isCorrect) { bg = `${D.red}20`; border = D.red; color = D.red; labelColor = D.red; }
                      return (
                        <button key={idx} onClick={() => { if (!confirmed) { sounds.select(); setSelected(idx); } }} className="option-btn"
                          style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 8, padding: isMobile ? "11px 12px" : "10px 12px", textAlign: "left", cursor: confirmed ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 10, minHeight: isMobile ? 50 : 42, transition: "all 0.15s", WebkitTapHighlightColor: "transparent" }}>
                          <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 700, color: labelColor, minWidth: 16, marginTop: 1, flexShrink: 0 }}>{String.fromCharCode(65 + idx)}.</span>
                          <span style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color, lineHeight: 1.4, flex: 1 }}>{opt}</span>
                          {confirmed && idx === q.correct && <span style={{ marginLeft: "auto", color: D.green, fontFamily: "'Fira Code',monospace", flexShrink: 0 }}>✓</span>}
                          {confirmed && selected === idx && !isCorrect && <span style={{ marginLeft: "auto", color: D.red, fontFamily: "'Fira Code',monospace", flexShrink: 0 }}>✗</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MC explanation */}
                {!isFillBlank && confirmed && (
                  <div style={{ marginTop: 14, padding: isMobile ? "12px 12px" : "14px 16px", background: isCorrect ? `${D.green}14` : `${D.red}14`, border: `1px solid ${isCorrect ? D.green : D.red}44`, borderRadius: 8, animation: "fadeIn 0.3s ease" }}>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: isCorrect ? D.green : D.red, marginBottom: 6, fontWeight: 700 }}>
                      {isCorrect ? "✓  Correct" : "✗  Incorrect"}
                    </div>
                    {!isCorrect && selected !== null && (
                      <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 12, color: D.red, marginBottom: 8, opacity: 0.8 }}>
                        You selected: {q.options[selected]}
                      </div>
                    )}
                    <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 13, color: D.fg, lineHeight: 1.65 }}>{q.explanation}</div>
                  </div>
                )}

                {/* Confidence rating */}
                {confirmed && (
                  <div style={{ marginTop: 14, padding: "12px 14px", background: D.bgDark, borderRadius: 8, border: `1px solid ${D.currentLine}`, animation: "fadeIn 0.35s ease" }}>
                    <div style={{ fontFamily: "'Fira Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: D.comment, marginBottom: 10 }}>How confident were you?</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[
                        { key: "knew",    label: "Knew it ✓",  color: D.green  },
                        { key: "unsure",  label: "Unsure ~",   color: D.yellow },
                        { key: "guessed", label: "Guessed 🎲", color: D.orange },
                      ].map(({ key, label, color }) => (
                        <button key={key} onClick={() => handleConfidence(key)}
                          style={{ flex: 1, padding: "9px 6px", borderRadius: 7, border: `1.5px solid ${confidence === key ? color : D.currentLine}`, background: confidence === key ? `${color}20` : D.bg, color: confidence === key ? color : D.comment, fontFamily: "'Fira Sans',sans-serif", fontSize: 12, fontWeight: confidence === key ? 700 : 400, cursor: "pointer", transition: "all 0.2s", minHeight: 38, minWidth: 80 }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action row */}
            <div style={{ display: "flex", gap: 9, marginBottom: 12 }}>
              {!confirmed ? (
                <>
                  {!showHint && (
                    <button onClick={() => { sounds.hint(); setShowHint(true); setHintPenalized(true); sessionHintUsedRef.current = true; }}
                      style={{ padding: isMobile ? "13px 12px" : "12px 14px", borderRadius: 8, border: `1.5px solid ${D.yellow}44`, background: `${D.yellow}10`, color: D.yellow, fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 48, minWidth: isMobile ? 68 : 76, WebkitTapHighlightColor: "transparent", transition: "all 0.2s" }}>
                      💡 Hint
                    </button>
                  )}
                  <button onClick={handleConfirm} disabled={!isFillBlank && selected === null}
                    style={{ flex: 1, padding: isMobile ? "13px" : "12px", borderRadius: 8, border: "none", background: (!isFillBlank && selected === null) ? D.currentLine : `linear-gradient(135deg,${D.purple},${D.pink})`, color: (!isFillBlank && selected === null) ? D.comment : "#fff", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: (!isFillBlank && selected === null) ? "not-allowed" : "pointer", minHeight: 48, transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}>
                    Check Answer
                  </button>
                </>
              ) : (
                <button onClick={handleNext}
                  style={{ flex: 1, padding: isMobile ? "13px" : "12px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${D.purple},${D.pink})`, color: "#fff", fontFamily: "'Fira Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 48, WebkitTapHighlightColor: "transparent" }}>
                  {current + 1 >= questions.length ? "See Results →" : "Next Question →"}
                </button>
              )}
              <button onClick={() => { setShowSandbox(s => !s); loadPyodide(); }}
                style={{ padding: isMobile ? "13px 12px" : "12px 14px", borderRadius: 8, border: `1.5px solid ${showSandbox ? D.green : D.currentLine}`, background: showSandbox ? `${D.green}14` : D.bg, color: showSandbox ? D.green : D.comment, fontFamily: "'Fira Code',monospace", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", minHeight: 48, minWidth: isMobile ? 72 : 88, WebkitTapHighlightColor: "transparent", transition: "all 0.2s" }}>
                {showSandbox ? "▼ Hide" : "▶ Try it"}
              </button>
            </div>

            {showSandbox && (
              <div style={{ animation: "slideUp 0.25s ease-out", marginBottom: 24 }}>
                <CodeSandbox key={q.id} defaultCode={q.defaultRunnable} runCode={runCode} pyodideLoading={pyLoading} pyodideError={pyError}/>
              </div>
            )}

            {!isMobile && (
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "6px 2px" }}>
                {[["1–4", "Select"], ["Enter", "Confirm/Next"], ["H", "Hint"], ["T", "Sandbox"], ["?", "Keys"], ["Esc", "Menu"]].map(([k, v]) => (
                  <span key={k} style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: D.comment }}>
                    <span style={{ color: D.comment + "88" }}>{k}</span> {v}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {pyLoading && showSandbox && (
          <div style={{ padding: "0 16px 12px", textAlign: "center", fontFamily: "'Fira Code',monospace", fontSize: 11, color: D.comment }}>
            Loading Python sandbox…
          </div>
        )}
      </div>
    </>
  );
}
