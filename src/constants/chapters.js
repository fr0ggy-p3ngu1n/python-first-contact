import { D } from "./palette.js";

export const CHAPTERS = [
  { label:"All Topics",            sub:"All 180 questions · shuffled",        ids:null,                                                                                         accent:D.purple },
  { label:"Ch. 1 — Basics",        sub:"Syntax, I/O, math, formatting",       ids:[1,2,3,4,5,6,7,8,52,53,54,55,83,84,85,86,87,88,89,90,161,162],                              accent:D.cyan   },
  { label:"Ch. 2 — Logic",         sub:"Booleans, operators, short-circuit",  ids:[9,10,11,56,57,58,59,91,92,93,94,95,96,97,98,99,100,101,102,103,163,164,165],                accent:D.pink   },
  { label:"Ch. 3 — If Statements", sub:"Conditions, elif, indentation",       ids:[12,13,60,61,62,63,104,105,106,107,108,109,110,111,112,113,114,115,116,117,166,167],         accent:D.yellow },
  { label:"Ch. 4 — Loops",         sub:"for, while, range, accumulator",      ids:[14,15,16,17,18,19,64,65,66,67,118,119,120,121,122,123,124,125,126,127,168,169,170],         accent:D.green  },
  { label:"Ch. 5 — Lists & Funcs", sub:"Lists, functions, scope, walrus",     ids:[20,21,22,23,24,25,68,69,70,71,128,129,130,131,132,133,134,135,136,137,171,172,173],         accent:D.orange },
  { label:"Ch. 6 — Lists Deep Dive", sub:"Indexing, tuples, range, slicing",  ids:[26,27,28,29,30,31,32,33,34,35,72,73,74,138,139,140,141,142,143,144,174,175],                accent:D.red    },
  { label:"Ch. 7 — Strings",       sub:"Slicing, split, strip, methods",      ids:[36,37,38,39,40,75,76,77,78,145,146,147,148,149,150,151,152,153,154,155,176,177,178],        accent:D.yellow },
  { label:"Ch. 8 — OOP",           sub:"Classes, objects, encapsulation, inheritance", ids:[41,42,43,44,45,46,47,48,49,50,51,79,80,81,82,156,157,158,159,160,179,180],         accent:D.cyan   },
];
