import { useState, useEffect } from "react";

export function useIsMobile() {
  const [v, setV] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const h = () => setV(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return v;
}
