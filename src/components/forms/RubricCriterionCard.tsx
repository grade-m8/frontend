import { ChevronDown, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LABEL_CLASS = "label-micro text-neutral-650";
const UNDERLINE_CLASS =
  "h-10.5 rounded-none border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-2 text-base text-neutral-900 focus-visible:border-teal-700 focus-visible:ring-0 md:text-base dark:bg-transparent";
const SELECT_CLASS =
  "h-10.5 w-full cursor-pointer appearance-none rounded-none border-0 border-b-2 border-neutral-200 bg-transparent py-2 pr-10 text-base text-neutral-900 outline-none focus-visible:border-teal-700";
const TEXTAREA_CLASS =
  "h-24 w-full resize-y border border-neutral-650 bg-card p-3 text-base text-neutral-900 outline-none placeholder:text-muted-foreground focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50";

export function RubricCriterionCard() {
  return (
    <div className="relative flex flex-col gap-4 border border-neutral-650 bg-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 md:pr-[8%]">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="criterion-title" className={LABEL_CLASS}>
            Criterio de evaluación
          </Label>
          <Input
            id="criterion-title"
            defaultValue="Rigor Técnico y Precisión"
            placeholder="Ej. Rigor Técnico y Precisión"
            className={`${UNDERLINE_CLASS} font-bold`}
          />
        </div>
        <div className="flex flex-col gap-2 md:w-69">
          <Label htmlFor="criterion-weight" className={LABEL_CLASS}>
            Peso relativo
          </Label>
          <div className="relative">
            <select
              id="criterion-weight"
              defaultValue="high"
              className={SELECT_CLASS}
            >
              <option value="high">Alto (40%)</option>
              <option value="medium">Medio (20%)</option>
              <option value="low">Bajo (10%)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-neutral-650" />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Eliminar criterio"
        className="absolute top-3.5 right-3.5 text-neutral-650"
      >
        <Trash2 className="size-4" />
      </Button>

      <div className="flex flex-col gap-2">
        <Label htmlFor="criterion-guidance" className={`${LABEL_CLASS} gap-1`}>
          Descripción detallada para IA
          <Info className="h-3 w-3" />
        </Label>
        <textarea
          id="criterion-guidance"
          defaultValue="El alumno debe utilizar la nomenclatura correcta. Se penalizará severamente el uso de términos ambiguos. La solución propuesta debe compilar mentalmente sin errores lógicos. Busca evidencia de comprensión profunda de la complejidad asintótica."
          placeholder="Ej. El alumno debe utilizar la nomenclatura correcta..."
          className={TEXTAREA_CLASS}
        />
      </div>
    </div>
  );
}
