import { useEffect, useState } from "react";

const TICK_MS = 1000;

/**
 * Milisegundos que faltan para `deadlineMillis` (0 cuando ya pasó), o
 * `undefined` si no hay límite. Cada tick recalcula contra `Date.now()` en
 * lugar de restar 1 s, así que no acumula desfase.
 */
export function useCountdown(deadlineMillis: number | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (deadlineMillis === undefined) return;

    const tick = () => setNow(Date.now());
    // Primer tick inmediato: `now` puede venir de antes de conocer el límite.
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, TICK_MS);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [deadlineMillis]);

  return deadlineMillis === undefined
    ? undefined
    : Math.max(deadlineMillis - now, 0);
}
