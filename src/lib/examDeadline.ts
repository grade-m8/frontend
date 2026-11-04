import { toMillis } from "@/lib/date.ts";
import type { Exam } from "@/types/exam";

const MS_PER_MINUTE = 60_000;

/**
 * Ventana grupal del examen: todos los alumnos comparten el mismo límite,
 * `inicio + durationMinutes`, con `inicio = scheduledAt ?? publishedAt`.
 * `undefined` si el examen no tiene ninguna fecha de inicio válida.
 */
export function getExamDeadlineMillis(
  exam: Pick<Exam, "scheduledAt" | "publishedAt" | "durationMinutes">,
): number | undefined {
  const startMillis = toMillis(exam.scheduledAt ?? exam.publishedAt);
  if (startMillis === undefined) return undefined;
  return startMillis + exam.durationMinutes * MS_PER_MINUTE;
}
