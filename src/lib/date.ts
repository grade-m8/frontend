function toDate(value: unknown): Date | null {
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value && typeof value === "object") {
    const seconds =
      "_seconds" in value
        ? (value as { _seconds: unknown })._seconds
        : "seconds" in value
          ? (value as { seconds: unknown }).seconds
          : undefined;

    if (typeof seconds === "number") {
      return new Date(seconds * 1000);
    }
  }

  return null;
}

/** Epoch millis of an API date (ISO string), or `undefined` if absent/invalid. */
export function toMillis(value: unknown): number | undefined {
  return toDate(value)?.getTime();
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: unknown): string {
  const date = toDate(value);
  return date ? DATE_FORMATTER.format(date) : "—";
}

const MS_PER_MINUTE = 60_000;

/**
 * Value for an `<input type="datetime-local">`: local time as "YYYY-MM-DDTHH:mm".
 * Accepts what the API returns (ISO UTC string). "" if it is not a valid date.
 */
export function toDateTimeLocalValue(value: unknown): string {
  const date = toDate(value);
  if (!date) return "";
  const localMillis = date.getTime() - date.getTimezoneOffset() * MS_PER_MINUTE;
  return new Date(localMillis).toISOString().slice(0, 16);
}

/**
 * Inverse of `toDateTimeLocalValue`: the input's local time → ISO 8601 UTC
 * string, which is what the API requires (an explicit timezone, never a bare
 * local time). `undefined` if the input is empty or invalid.
 */
export function fromDateTimeLocalValue(value: string): string | undefined {
  if (value === "") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Current local time, to the minute, in `datetime-local` format. */
export function getNowDateTimeLocal(): string {
  return toDateTimeLocalValue(new Date().toISOString());
}

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

/** "MM:SS", or "H:MM:SS" from one hour up. Rounds up: "00:00" only at 0 ms. */
export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.ceil(Math.max(remainingMs, 0) / MS_PER_SECOND);
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

const WARNING_THRESHOLD_MS = 5 * MS_PER_MINUTE;
const CRITICAL_THRESHOLD_MS = MS_PER_MINUTE;

/**
 * Tailwind classes for the exam countdown, by how much time is left:
 * neutral above 5 min, amber from 5 min down to 1 min, red (pulsing) in the
 * last minute. Pure: it only reads `remainingMs`, it starts no timers.
 */
export function getTimerColorClass(remainingMs: number): {
  labelClass: string;
  digitsClass: string;
} {
  if (remainingMs > WARNING_THRESHOLD_MS) {
    return {
      labelClass: "text-neutral-650",
      digitsClass: "font-bold tabular-nums text-neutral-900",
    };
  }
  if (remainingMs > CRITICAL_THRESHOLD_MS) {
    return {
      labelClass: "text-amber-600",
      digitsClass: "font-black tabular-nums text-amber-600",
    };
  }
  return {
    labelClass: "font-semibold text-danger-500",
    digitsClass: "animate-pulse font-black tabular-nums text-danger-500",
  };
}
