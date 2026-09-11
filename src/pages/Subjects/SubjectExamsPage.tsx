import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ExamCard } from "@/components/data-display/ExamCard";

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

export default function SubjectExamsPage() {
  return (
    <div className="px-6">
      <PageHeader
        title="Matemática II"
        subtitle="Resumen de evaluaciones y métricas académicas en tiempo real"
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
