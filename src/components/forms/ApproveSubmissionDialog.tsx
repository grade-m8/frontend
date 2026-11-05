import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApproveSubmissionDialogProps {
  open: boolean;
  studentName: string;
  totalScore: number | null;
  totalPossible: number;
  isApproving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApproveSubmissionDialog({
  open,
  studentName,
  totalScore,
  totalPossible,
  isApproving = false,
  onClose,
  onConfirm,
}: ApproveSubmissionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isApproving) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Aprobar la calificación de esta entrega?</DialogTitle>
          <DialogDescription>
            Al confirmar, la calificación final ({totalScore ?? "—"}/
            {totalPossible}) y las devoluciones quedarán visibles de inmediato
            para {studentName} en su panel de resultados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isApproving}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-teal-700 hover:bg-teal-800 text-white"
            disabled={isApproving}
            onClick={onConfirm}
          >
            {isApproving && <Loader2 className="animate-spin" />}
            Confirmar y Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
