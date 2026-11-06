import { Loader2 } from "lucide-react";

interface RouteLoadingSpinnerProps {
  message?: string;
}

export function RouteLoadingSpinner({
  message = "Preparando tu espacio...",
}: RouteLoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-50"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-teal-700"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-neutral-500">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
