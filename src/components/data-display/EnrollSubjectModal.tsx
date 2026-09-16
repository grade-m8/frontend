import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrollSubjectCard } from "@/components/data-display/EnrollSubjectCard";
import type { Subject } from "@/types/subject.ts";
import { enroll, listAvailable } from "@/services/subjectService.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { useAuth } from "@/hooks/useAuth.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnrollSubjectModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollingSubjectId, setEnrollingSubjectId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const loadAvailableSubjects = async () => {
      setIsLoading(true);
      try {
        const subjects = await listAvailable(user);
        setAvailableSubjects(subjects);
      } catch {
        toast.error("Error al cargar las materias disponibles");
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableSubjects();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch("");
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEnroll = async (subjectId: string) => {
    setEnrollingSubjectId(subjectId);
    try {
      await enroll(user, subjectId);
      toast.success("Inscripción realizada con éxito");
      onSuccess();
      setAvailableSubjects((prev) =>
        prev.filter((subject) => subject.subjectId !== subjectId),
      );
    } catch {
      toast.error("Error al procesar la inscripción");
    } finally {
      setEnrollingSubjectId(null);
    }
  };

  const filteredSubjects = availableSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      (subject.teacherEmail &&
        subject.teacherEmail.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-300 flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-5 bg-white shrink-0">
          <h2 className="text-h2 font-bold text-neutral-900 tracking-tight">
            Inscripción a Materias
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-neutral-650 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b border-neutral-300 px-6 py-4 bg-white shrink-0">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar cátedras o profesores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full pl-10 pr-4 text-body rounded-lg border-neutral-300 focus-visible:border-teal-700 bg-neutral-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-neutral-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
              <p className="text-body font-medium">
                Cargando materias disponibles...
              </p>
            </div>
          ) : availableSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-16 text-center">
              <p className="text-body font-bold text-neutral-900">
                No hay materias disponibles
              </p>
              <p className="text-sm text-neutral-650 mt-1">
                Ya estás inscripto en todas las materias activas o no hay cursos
                abiertos actualmente.
              </p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-16 text-center">
              <p className="text-body font-bold text-neutral-900">
                No se encontraron cátedras
              </p>
              <p className="text-sm text-neutral-650 mt-1">
                No hay materias ni profesores que coincidan con "{search}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((subject) => (
                <EnrollSubjectCard
                  key={subject.subjectId}
                  name={subject.name}
                  teacher={subject.teacherEmail ?? ""}
                  room={subject.room ?? ""}
                  onEnroll={() => handleEnroll(subject.subjectId)}
                  isLoading={enrollingSubjectId === subject.subjectId}
                  disabled={enrollingSubjectId !== null}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-neutral-300 bg-white px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={onClose}
            className="bg-neutral-300 hover:bg-neutral-400 text-neutral-900 font-bold uppercase tracking-wider px-6 h-11 rounded-lg border border-neutral-400 cursor-pointer shadow-sm transition-colors"
          >
            FINALIZAR SELECCION
          </Button>
        </div>
      </div>
    </div>
  );
}
