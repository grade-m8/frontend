// TEMPORAL: solo para ver el componente. No commitear.
import { CriterionPointsBreakdown } from "@/components/data-display/CriterionPointsBreakdown";
import type { RubricCriterion } from "@/types/exam";

function criterion(
  criterionId: string,
  title: string,
  weight: RubricCriterion["weight"],
  weightPercentage: number,
  order: number,
): RubricCriterion {
  return { criterionId, title, weight, weightPercentage, guidance: "", order };
}

const highMedium = [
  criterion("a", "Rigor técnico", "high", 40, 1),
  criterion("b", "Claridad de la explicación", "medium", 20, 2),
];

const highMediumLow = [
  ...highMedium,
  criterion("c", "Ortografía y redacción", "low", 10, 3),
];

const withEmptyTitle = [
  criterion("a", "Rigor técnico", "high", 40, 2),
  criterion("b", "", "medium", 20, 1),
];

const zeroWeights = [
  criterion("a", "Criterio uno", "low", 0, 1),
  criterion("b", "Criterio dos", "low", 0, 2),
  criterion("c", "Criterio tres", "low", 0, 3),
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}

export default function TempCriterionPreview() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-4 md:p-8 bg-white">
      <Section title="full · Alto + Medio · sin puntos">
        <CriterionPointsBreakdown criteria={highMedium} />
      </Section>
      <Section title="full · Alto + Medio · 10 pts">
        <CriterionPointsBreakdown criteria={highMedium} questionPoints={10} />
      </Section>
      <Section title="full · Alto + Medio + Bajo · 10 pts">
        <CriterionPointsBreakdown
          criteria={highMediumLow}
          questionPoints={10}
        />
      </Section>
      <Section title="full · título vacío (orden por order) · 10 pts">
        <CriterionPointsBreakdown
          criteria={withEmptyTitle}
          questionPoints={10}
        />
      </Section>
      <Section title="full · pesos 0 (reparto igual) · 10 pts">
        <CriterionPointsBreakdown criteria={zeroWeights} questionPoints={10} />
      </Section>
      <Section title="compact · con puntos">
        <CriterionPointsBreakdown
          criteria={highMediumLow}
          questionPoints={10}
          variant="compact"
        />
      </Section>
      <Section title="compact · sin puntos">
        <CriterionPointsBreakdown criteria={highMediumLow} variant="compact" />
      </Section>
      <Section title="lista vacía (no debe renderizar nada)">
        <CriterionPointsBreakdown criteria={[]} />
      </Section>
    </main>
  );
}
