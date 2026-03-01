import { useRef, useCallback } from "react";

export function useSounds(enabled) {
  const ctxRef = useRef(null);
  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };
  const tone = useCallback((freq, type, start, dur, vol = 0.15) => {
    if (!enabled) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, c.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
      osc.start(c.currentTime + start);
      osc.stop(c.currentTime + start + dur + 0.05);
    } catch {}
  }, [enabled]);
  return {
    correct: () => { tone(523, "sine", 0, 0.12); tone(659, "sine", 0.1, 0.15); },
    wrong:   () => { tone(220, "sawtooth", 0, 0.08, 0.12); tone(180, "sawtooth", 0.07, 0.13, 0.10); },
    streak:  () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, "sine", i * 0.07, 0.14)); },
    flip:    () => { tone(880, "sine", 0, 0.06, 0.08); },
    hint:    () => { tone(440, "triangle", 0, 0.1, 0.1); },
    tick:    () => { tone(1200, "sine", 0, 0.03, 0.04); },
    timeUp:  () => { tone(180, "sawtooth", 0, 0.35, 0.18); },
    select:  () => { tone(660, "sine", 0, 0.05, 0.07); },
  };
}
