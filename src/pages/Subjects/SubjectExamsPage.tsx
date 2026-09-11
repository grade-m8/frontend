import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ExamCard } from "@/components/data-display/ExamCard";
import { Button } from "@/components/ui/button";

const MOCK_EXAMS = [
  {
    id: 1,
    title: "Primer Parcial",
    studentCount: "48 Alumnos",
    date: "24 Oct, 18:00",
    durationMinutes: "90 min",
    status: "CORREGIDO",
  },
  {
    id: 2,
    title: "Primer Parcial",
    studentCount: "48 Alumnos",
    date: "24 Oct, 13:00",
    durationMinutes: "90 min",
    status: "PENDIENTE",
  },
  {
    id: 3,
    title: "Primer Parcial",
    studentCount: "45 Alumnos",
    date: "24 Oct, 18:00",
    durationMinutes: "90 min",
    status: "REVISIÓN IA",
  },
];

// ============================================================================
// PLACEHOLDERS PARA INTEGRACIÓN FUTURA CON EL BACKEND
// ============================================================================

// TODO: [Backend Integration] Reemplazar MOCK_EXAMS por el consumo de datos reales:
// const { exams, loading, error } = useExams(subjectId);

// TODO: [Backend Integration] Conectar acción para crear un nuevo examen:
function handleCreateExam() {
  console.log(
    "Placeholder: Abrir modal o navegar al wizard de creación de exámenes",
  );
}

// TODO: [Backend Integration] Conectar navegación al detalle/corrección de cada examen:
function handleGoToExam(examId: number) {
  console.log(
    "Placeholder: Navegar a la pantalla de detalle/corrección del examen:",
    examId,
  );
}

export default function SubjectExamsPage() {
  return (
    <div className="px-6">
      <PageHeader
        title="Matemática II"
        subtitle="Resumen de evaluaciones y métricas académicas en tiempo real"
        actions={
          <Button className="gap-2 h-12 font-bold" onClick={handleCreateExam}>
            Crear nuevo examen
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />
      <SectionHeader title="Exámenes Recientes" />
      {MOCK_EXAMS.length === 0 ? (
        <div className="border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-body font-bold text-neutral-900">
            No hay exámenes registrados
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_EXAMS.map((exam) => (
            <ExamCard
              key={exam.id}
              title={exam.title}
              studentCount={exam.studentCount}
              date={exam.date}
              durationMinutes={exam.durationMinutes}
              status={exam.status}
              onActionClick={() => handleGoToExam(exam.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
