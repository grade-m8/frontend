import { PageHeader } from "@/components/layout/PageHeader";
import { Plus, LayoutGrid, Search, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Input } from "@/components/ui/input";
import { SubjectCard } from "@/components/data-display/SubjectCard";
import fx from "@/assets/fx.svg";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext.ts";
import { useSubject } from "@/hooks/useSubject.ts";
import EnrollSubjectModal from "@/components/data-display/EnrollSubjectModal.tsx";
import { toast } from "@/components/handler/toastHandler.tsx";

export default function SubjectsPage() {
  const [query, setQuery] = useState("");
  const authContext = useContext(AuthContext);

  const userName = authContext?.profile
    ? `${authContext.profile.firstName} ${authContext.profile.lastName}`
    : "";

  const { subjects, isLoading, reloadSubjects } = useSubject(
    authContext ? authContext.user : null,
    authContext ? authContext.role : undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  if (!authContext || authContext.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando sesión...
      </div>
    );
  }
  const handleLogout = async (): Promise<void> => {
    try {
      await authContext.logout();
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  // 2. Prevenir el renderizado de la grilla mientras se buscan las materias
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Cargando tus materias...</p>
      </div>
    );
  }

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="Mis Cursos"
        subtitle={userName ? `Bienvenido, ${userName}` : "Bienvenido"}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 h-12 font-bold"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
            <Button
              className="gap-2 h-12 font-bold"
              onClick={() => {
                if (authContext.role === "Student") {
                  setIsModalOpen(true);
                }
              }}
            >
              <Plus className="h-4 w-4" />
              {authContext.role === "Student"
                ? "Inscribir nueva materia"
                : "Crear nueva materia"}
            </Button>
          </div>
        }
      />
      <div className="px-6">
        <SectionHeader
          title="Listado de Cátedras"
          icon={LayoutGrid}
          actions={
            <div className="relative">
              <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-neutral-650" />
              <Input
                placeholder="Buscar materia..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-59 pl-8"
              />
            </div>
          }
        />
        {filteredSubjects.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              No se encontraron resultados
            </p>
            <p className="text-sm text-neutral-650">
              No hay materias que coincidan con "{query}".
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((s) => (
              <SubjectCard
                key={s.subjectId}
                title={s.name}
                subtitle={`Prof. ${s.teacherEmail ?? "Titular"}${s.room ? `- ${s.room}` : ""}`}
                examValue="15 Oct - Parcial 1"
                status={s.active ? "Activa" : "Inactiva"}
                iconSrc={fx}
                onCtaClick={() => navigate(`/materias/${s.subjectId}/examenes`)}
              />
            ))}
          </div>
        )}
      </div>
      <EnrollSubjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={reloadSubjects}
      />
    </>
  );
}
