import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default function SubjectExamsPage() {
  return (
    <div className="px-6">
      <PageHeader
        title="Matemática II"
        subtitle="Resumen de evaluaciones y métricas académicas en tiempo real"
      />
      <SectionHeader title="Exámenes Recientes" />
      <div className="border-dashed border-neutral-300 py-16 text-center">
        <p className="text-body font-bold text-neutral-900">
          No hay exámenes registrados
        </p>
      </div>
    </div>
  );
}
