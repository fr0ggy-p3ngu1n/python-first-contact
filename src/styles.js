export const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { background: #081c2c; }

  @keyframes popIn   { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }

  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:#1e1f29; }
  ::-webkit-scrollbar-thumb { background:#44475a; border-radius:3px; }
  ::selection { background:#44475a; color:#f8f8f2; }

  textarea { font-size: 16px !important; }
  @media (min-width: 640px) { textarea { font-size: 13px !important; } }

  input[type="text"], input:not([type]) { -webkit-appearance: none; }

  .chapter-btn:hover {
    border-color: var(--accent) !important;
    background: color-mix(in srgb, var(--accent) 12%, #44475a) !important;
  }
  .chapter-btn:hover > div > div:first-child { color: var(--accent) !important; }
  .chapter-btn:active { opacity: 0.85; transform: scale(0.99); }
  .option-btn:hover  { border-color: #bd93f9 !important; background: rgba(189,147,249,0.12) !important; }
  .option-btn:active { opacity: 0.85; }

  .flashcard-inner         { transform: rotateY(0deg); }
  .flashcard-inner.flipped { transform: rotateY(180deg); }
`;
