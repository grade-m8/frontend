import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExamNavigationFooterProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onConfirmSubmit: () => void;
  isBusy?: boolean;
  isSubmitting?: boolean;
  pendingCount?: number;
}

export function ExamNavigationFooter({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onConfirmSubmit,
  isBusy = false,
  isSubmitting = false,
  pendingCount,
}: ExamNavigationFooterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const hasPending = typeof pendingCount === "number" && pendingCount > 0;

  const handleOpenDialog = () => {
    if (isBusy || isSubmitting) return;
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    submitButtonRef.current?.focus();
  };

  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    onConfirmSubmit();
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen]);

  return (
    <>
      <footer className="w-full flex flex-col">
        {/* Fila de navegación: Anterior y Siguiente */}
        <div className="flex w-full items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isBusy || isSubmitting}
            className="h-12 flex-1 min-w-0 sm:flex-initial sm:w-[186px] gap-2 border-2 border-teal-700 bg-surface-card text-teal-700 font-bold text-base hover:bg-teal-50 hover:text-teal-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Anterior</span>
          </Button>

          {canGoNext && (
            <Button
              type="button"
              onClick={onNext}
              disabled={isBusy || isSubmitting}
              className="h-12 flex-1 min-w-0 sm:flex-initial sm:w-[186px] ml-auto gap-2 border-2 border-transparent bg-teal-700 text-white font-bold text-base hover:bg-teal-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Siguiente</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          )}
        </div>

        {/* Separador y botón de entrega */}
        <div className="pt-12">
          <div className="border-t border-neutral-300 pt-6 flex flex-col items-stretch sm:items-end gap-3">
            {hasPending && (
              <p
                role="status"
                className="text-sm font-medium text-neutral-650 sm:text-right"
              >
                Te faltan {pendingCount} preguntas por responder.
              </p>
            )}

            <Button
              ref={submitButtonRef}
              type="button"
              onClick={handleOpenDialog}
              disabled={isBusy || isSubmitting}
              className="h-12 w-full sm:w-[366px] justify-center items-center gap-8 bg-action-danger text-white font-bold text-base hover:bg-action-danger-hover active:bg-action-danger-press cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span>Entregando…</span>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                </>
              ) : (
                <>
                  <span>Entregar Examen Definitivamente</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>

      {/* Diálogo modal de confirmación */}
      {isDialogOpen && (
        <div
          role="presentation"
          onClick={handleCloseDialog}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-exam-dialog-title"
            aria-describedby="submit-exam-dialog-description"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-300 p-6 flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h2
                id="submit-exam-dialog-title"
                className="text-h3 font-bold text-neutral-900 tracking-tight"
              >
                ¿Entregar el examen?
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="h-8 w-8 text-neutral-650 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
                aria-label="Cerrar diálogo"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p
              id="submit-exam-dialog-description"
              className="text-body text-neutral-700 leading-relaxed"
            >
              Una vez entregado no vas a poder modificar tus respuestas.
              ¿Entregar el examen?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                ref={cancelButtonRef}
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="h-10 px-5 text-sm font-semibold border-neutral-300 text-neutral-800 hover:bg-neutral-100 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmSubmit}
                className="h-10 px-5 text-sm font-semibold bg-action-danger text-white hover:bg-action-danger-hover active:bg-action-danger-press cursor-pointer"
              >
                Entregar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
