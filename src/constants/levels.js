export const LEVELS = [
  { level:1, label:"Earthling",  icon:"🌍",  xp:0    },
  { level:2, label:"Abductee",   icon:"🛸",  xp:100  },
  { level:3, label:"Cadet",      icon:"🔭",  xp:300  },
  { level:4, label:"Navigator",  icon:"🪐",  xp:600  },
  { level:5, label:"Commander",  icon:"👽",  xp:1100 },
  { level:6, label:"Overlord",   icon:"🌌",  xp:1800 },
  { level:7, label:"The Alien",  icon:"👾",  xp:3000 },
];

export function getLevel(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i;
  const cur = LEVELS[idx], nxt = LEVELS[idx + 1];
  return { ...cur, next: nxt, pct: nxt ? (xp - cur.xp) / (nxt.xp - cur.xp) : 1 };
}
