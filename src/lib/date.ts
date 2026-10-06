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
