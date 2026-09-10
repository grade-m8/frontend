import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnrollSubjectCard } from "@/components/data-display/EnrollSubjectCard";
import type { Subject } from "@/types/subject.ts";
import { enroll, listAvailable } from "@/services/subjectService.ts";

interface Props {
  onClose: () => void;
}

export default function EnrollSubjectModal({ onClose }: Props) {
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  const loadAvailable = useCallback(() => {
    return listAvailable();
  }, []);

  const handleEnroll = async (subjectId: string) => {
    await enroll(subjectId);
    await loadAvailable();
  };

  useEffect(() => {
    const loadAvailables = async () => {
      setIsLoading(true);
      setAvailableSubjects(await loadAvailable());
      setIsLoading(false);
    };

    loadAvailables();
  }, [loadAvailable]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Cargando tus materias...</p>
      </div>
    );
  }

  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-300 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-5 bg-white shrink-0">
          <h2 className="text-h2 font-bold text-neutral-900 tracking-tight">
            Inscripción a Materias
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose()}
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
          {filteredSubjects.length === 0 ? (
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
                  onEnroll={() => handleEnroll}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-neutral-300 bg-white px-6 py-4 shrink-0">
          <Button
            type="button"
            onClick={() => onClose()}
            className="bg-neutral-300 hover:bg-neutral-400 text-neutral-900 font-bold uppercase tracking-wider px-6 h-11 rounded-lg border border-neutral-400 cursor-pointer shadow-sm transition-colors"
          >
            FINALIZAR SELECCION
          </Button>
        </div>
      </div>
    </div>
  );
}
