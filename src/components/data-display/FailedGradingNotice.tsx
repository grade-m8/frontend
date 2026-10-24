import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FailedGradingNoticeProps {
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function FailedGradingNotice({
  description,
  onRetry,
  isRetrying = false,
}: FailedGradingNoticeProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-12 text-center gap-3 p-4 bg-danger-50 border border-danger-200"
    >
      <AlertCircle className="w-8 h-8 text-danger-600 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-danger-900">
          La IA no pudo corregir esta respuesta.
        </p>
        {description && (
          <p className="text-xs font-mono text-danger-700 mt-1 break-words">
            {description}
          </p>
        )}
      </div>
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-action-danger hover:bg-action-danger-hover text-white cursor-pointer"
        >
          {isRetrying ? (
            <>
              <Loader2 className="animate-spin" />
              Reintentando…
            </>
          ) : (
            <>
              <RotateCcw />
              Reintentar corrección
            </>
          )}
        </Button>
      )}
    </div>
  );
}
