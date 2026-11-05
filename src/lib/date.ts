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
