import { ALL_QUESTIONS } from "../constants/questions.js";

function seededRand(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0x100000000; };
}

export function getDailyQuestion() {
  const today = new Date().toDateString();
  const seed  = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ALL_QUESTIONS[Math.floor(seededRand(seed)() * ALL_QUESTIONS.length)];
}
