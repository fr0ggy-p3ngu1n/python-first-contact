import { D } from "../constants/palette.js";

export function Toast({ message, color }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: D.currentLine, border: `1px solid ${color}66`, borderRadius: 10, padding: "10px 20px", fontFamily: "'Fira Sans',sans-serif", fontSize: 13, fontWeight: 700, color, zIndex: 40, animation: "slideUp 0.3s ease", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      {message}
    </div>
  );
}
