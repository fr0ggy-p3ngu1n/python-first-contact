import { D } from "./palette.js";

export const CHAPTERS = [
  { label:"All Topics",            sub:"All 25 questions · shuffled",        ids:null,               accent:D.purple },
  { label:"Ch. 1 — Basics",        sub:"Syntax, I/O, math, formatting",      ids:[1,2,3,4,5,6,7,8],  accent:D.cyan   },
  { label:"Ch. 2 — Logic",         sub:"Booleans, operators, short-circuit", ids:[9,10,11],           accent:D.pink   },
  { label:"Ch. 3 — If Statements", sub:"Conditions, elif, indentation",      ids:[12,13],             accent:D.yellow },
  { label:"Ch. 4 — Loops",         sub:"for, while, range, accumulator",     ids:[14,15,16,17,18,19], accent:D.green  },
  { label:"Ch. 5 — Lists & Funcs", sub:"Lists, functions, scope, walrus",    ids:[20,21,22,23,24,25], accent:D.orange },
];
