import { Braces } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LABEL_CLASS = "label-micro text-neutral-650";
const INPUT_CLASS =
  "h-12.5 rounded-none border-neutral-650 bg-neutral-50 px-3 py-3 text-base text-neutral-900 md:text-base";

export function ExamGeneralInfoForm() {
  return (
    <Card className="gap-6 rounded-none border border-neutral-200 bg-neutral-100 py-0 ring-0">
      <CardHeader className="mx-6 mt-6 flex items-center gap-2 border-b border-neutral-300 px-0 pb-4">
        <Braces className="h-5 w-5 text-teal-800" />
        <h2 className="text-h2 font-semibold text-neutral-900">
          Información General
        </h2>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 px-6 pb-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-title" className={LABEL_CLASS}>
            Título del examen
          </Label>
          <Input
            id="exam-title"
            placeholder="Evaluación de Algoritmos Avanzados"
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-subject" className={LABEL_CLASS}>
            Materia / Módulo
          </Label>
          <Input
            id="exam-subject"
            placeholder="Ciencias de la Computación CS-300"
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-duration" className={LABEL_CLASS}>
            Duración
          </Label>
          <Input
            id="exam-duration"
            placeholder="90 min"
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-passing" className={LABEL_CLASS}>
            Porcentaje de aprobación
          </Label>
          <Input id="exam-passing" placeholder="60%" className={INPUT_CLASS} />
        </div>
      </CardContent>
    </Card>
  );
}
