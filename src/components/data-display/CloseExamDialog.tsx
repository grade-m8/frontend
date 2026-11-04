import { useEffect, useRef } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// Componente presentacional: no conoce al backend, el padre ejecuta el cierre.
interface CloseExamDialogProps {
  isOpen: boolean;
  isClosing?: boolean; // hay un cierre en curso: bloquea cancelar y reconfirmar
  onCancel: () => void;
  onConfirm: () => void;
}

export function CloseExamDialog({
  isOpen,
  isClosing = false,
  onCancel,
  onConfirm,
}: CloseExamDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // El foco arranca en la opción segura: confirmar es irreversible.
    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClosing) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosing, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={isClosing ? undefined : onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="close-exam-dialog-title"
        aria-describedby="close-exam-dialog-description"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-5 rounded-none border border-neutral-650 bg-card p-6 shadow-hard"
      >
        <div className="flex items-center gap-3">
          <TriangleAlert className="h-5 w-5 shrink-0 text-danger-500" />
          <h2
            id="close-exam-dialog-title"
            className="text-h3 font-bold text-neutral-900"
          >
            ¿Cerrar el examen?
          </h2>
        </div>

        <p
          id="close-exam-dialog-description"
          className="text-body leading-relaxed text-neutral-700"
        >
          Esta acción es irreversible: el examen no se puede reabrir y los
          alumnos no podrán seguir respondiendo ni entregar.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isClosing}
            className="h-10 rounded-none border-neutral-650 px-5 text-sm font-semibold text-neutral-800 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isClosing}
            className="h-10 gap-2 rounded-none bg-action-danger px-5 text-sm font-semibold text-white hover:bg-action-danger-hover active:bg-action-danger-press cursor-pointer"
          >
            {isClosing && <Loader2 className="h-4 w-4 animate-spin" />}
            {isClosing ? "Cerrando…" : "Cerrar examen"}
          </Button>
        </div>
      </div>
    </div>
  );
}
