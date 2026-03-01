import { D } from "../constants/palette.js";

export function ProgressBar({ current, total, color = D.purple }) {
  return (
    <div style={{ height: 3, background: D.currentLine, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg,${color},${D.pink})`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }}/>
    </div>
  );
}
