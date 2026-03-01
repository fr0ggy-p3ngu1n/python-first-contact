import { D } from "../constants/palette.js";

const KWS = new Set(["def","return","if","else","elif","for","while","in","not","and","or","True","False","None","import","from","class","pass","break","continue","global","lambda","with","as"]);
const BLT = new Set(["print","range","len","type","int","str","float","list","dict","set","tuple","input","enumerate","zip","map","sorted","sum","min","max","abs","round","bool","random","seed"]);
const COLORS = { keyword:D.pink, builtin:D.cyan, string:D.yellow, number:D.purple, comment:D.comment, op:D.fg, ident:D.fg, plain:D.fg };

export function syntaxHighlight(code) {
  return code.split("\n").map((line, li) => {
    const tokens = []; let i = 0;
    const push = (t, v) => tokens.push({ t, v });
    while (i < line.length) {
      if (line[i] === "#") { push("comment", line.slice(i)); break; }
      if (line[i] === '"' || line[i] === "'") {
        const q = line[i]; let j = i + 1;
        while (j < line.length && line[j] !== q) j++;
        push("string", line.slice(i, j + 1)); i = j + 1; continue;
      }
      if (/\d/.test(line[i])) { let j = i; while (j < line.length && /[\d.]/.test(line[j])) j++; push("number", line.slice(i, j)); i = j; continue; }
      if (/[a-zA-Z_]/.test(line[i])) { let j = i; while (j < line.length && /\w/.test(line[j])) j++; const w = line.slice(i, j); push(KWS.has(w) ? "keyword" : BLT.has(w) ? "builtin" : "ident", w); i = j; continue; }
      if (/[+\-*/%=<>!&|^~:@]/.test(line[i])) { push("op", line[i]); i++; continue; }
      push("plain", line[i]); i++;
    }
    return (
      <div key={li} style={{ minHeight: "1.5em" }}>
        {tokens.map((tk, ti) => <span key={ti} style={{ color: COLORS[tk.t] }}>{tk.v}</span>)}
      </div>
    );
  });
}
