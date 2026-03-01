import { D } from "./palette.js";

export const CHAPTERS = [
  { label:"All Topics",            sub:"All 51 questions · shuffled",        ids:null,                                         accent:D.purple },
  { label:"Ch. 1 — Basics",        sub:"Syntax, I/O, math, formatting",      ids:[1,2,3,4,5,6,7,8],                           accent:D.cyan   },
  { label:"Ch. 2 — Logic",         sub:"Booleans, operators, short-circuit", ids:[9,10,11],                                   accent:D.pink   },
  { label:"Ch. 3 — If Statements", sub:"Conditions, elif, indentation",      ids:[12,13],                                     accent:D.yellow },
  { label:"Ch. 4 — Loops",         sub:"for, while, range, accumulator",     ids:[14,15,16,17,18,19],                         accent:D.green  },
  { label:"Ch. 5 — Lists & Funcs", sub:"Lists, functions, scope, walrus",    ids:[20,21,22,23,24,25],                         accent:D.orange },
  { label:"Ch. 6 — Lists Deep Dive", sub:"Indexing, tuples, range, slicing", ids:[26,27,28,29,30,31,32,33,34,35],             accent:D.red    },
  { label:"Ch. 7 — Strings",       sub:"Slicing, split, strip, methods",     ids:[36,37,38,39,40],                            accent:D.yellow },
  { label:"Ch. 8 — OOP",           sub:"Classes, objects, encapsulation, inheritance", ids:[41,42,43,44,45,46,47,48,49,50,51], accent:D.cyan  },
];
