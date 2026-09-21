import { Braces } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExamGeneralInfo } from "@/types/exam";
import { useState } from "react";

interface ExamGeneralInfoFormProps {
  values: ExamGeneralInfo;
  onChange: (updatedFields: Partial<ExamGeneralInfo>) => void;
  errors?: Record<string, string>;
}

const LABEL_CLASS = "label-micro text-neutral-650";
const ERROR_CLASS =
  "aria-invalid:border-danger-500 aria-invalid:ring-3 aria-invalid:ring-danger-500/20 dark:aria-invalid:border-danger-500 dark:aria-invalid:ring-danger-500/20";

const INPUT_CLASS = `h-12.5 rounded-none border-neutral-650 bg-neutral-50 px-3 py-3 text-base text-neutral-900 md:text-base dark:bg-neutral-50 ${ERROR_CLASS}`;
const SELECT_CLASS = `w-full border outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${INPUT_CLASS}`;

function parseDigits(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-danger-500">
      {message}
    </p>
  );
}

type FieldName =
  "title" | "subjectId" | "durationMinutes" | "passingPercentage";

function validateField(
  field: FieldName,
  values: ExamGeneralInfo,
): string | undefined {
  switch (field) {
    case "title":
      return values.title.trim() === ""
        ? "El título es obligatorio"
        : undefined;
    case "subjectId":
      return values.subjectId === "" ? "Seleccioná una materia" : undefined;
    case "durationMinutes":
      return values.durationMinutes > 0
        ? undefined
        : "La duración debe ser mayor a 0";
    case "passingPercentage":
      return values.passingPercentage >= 1 && values.passingPercentage <= 100
        ? undefined
        : "Debe estar entre 1 y 100";
  }
}

// TODO: Cargar materias reales del docente autenticado vía servicio de subjects al conectar el backend
const MOCK_SUBJECTS = [
  { id: "cs-300", name: "Ciencias de la Computación CS-300" },
  { id: "mat-2", name: "Matemática II" },
  { id: "alg-1", name: "Algoritmos y Estructuras" },
];

export function ExamGeneralInfoForm({
  values,
  onChange,
  errors = {},
}: ExamGeneralInfoFormProps) {
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  const markTouched = (field: FieldName) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const getError = (field: FieldName) =>
    errors[field] ??
    (touched[field] ? validateField(field, values) : undefined);

  const fieldErrors = {
    title: getError("title"),
    subjectId: getError("subjectId"),
    durationMinutes: getError("durationMinutes"),
    passingPercentage: getError("passingPercentage"),
  };
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
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Evaluación de Algoritmos Avanzados"
            aria-invalid={!!fieldErrors.title}
            aria-describedby={
              fieldErrors.title ? "exam-title-error" : undefined
            }
            className={INPUT_CLASS}
            onBlur={() => markTouched("title")}
          />
          <FieldError id="exam-title-error" message={fieldErrors.title} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-subject" className={LABEL_CLASS}>
            Materia / Módulo
          </Label>
          <select
            id="exam-subject"
            value={values.subjectId}
            onChange={(e) => {
              const subject = MOCK_SUBJECTS.find(
                (s) => s.id === e.target.value,
              );
              onChange({
                subjectId: e.target.value,
                subjectName: subject?.name,
              });
            }}
            aria-invalid={!!fieldErrors.subjectId}
            aria-describedby={
              fieldErrors.subjectId ? "exam-subject-error" : undefined
            }
            className={SELECT_CLASS}
            onBlur={() => markTouched("subjectId")}
          >
            <option value="">Seleccionar materia</option>
            {MOCK_SUBJECTS.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <FieldError id="exam-subject-error" message={fieldErrors.subjectId} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-duration" className={LABEL_CLASS}>
            Duración
          </Label>
          <div className="relative">
            <Input
              id="exam-duration"
              inputMode="numeric"
              value={values.durationMinutes === 0 ? "" : values.durationMinutes}
              onChange={(e) =>
                onChange({ durationMinutes: parseDigits(e.target.value) })
              }
              aria-invalid={!!fieldErrors.durationMinutes}
              aria-describedby={
                fieldErrors.durationMinutes ? "exam-duration-error" : undefined
              }
              placeholder="90"
              className={`${INPUT_CLASS} pr-12`}
              onBlur={() => markTouched("durationMinutes")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-base text-neutral-500">
              min
            </span>
          </div>
          <FieldError
            id="exam-duration-error"
            message={fieldErrors.durationMinutes}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exam-passing" className={LABEL_CLASS}>
            Porcentaje de aprobación
          </Label>
          <div className="relative">
            <Input
              id="exam-passing"
              inputMode="numeric"
              value={
                values.passingPercentage === 0 ? "" : values.passingPercentage
              }
              onChange={(e) =>
                onChange({ passingPercentage: parseDigits(e.target.value) })
              }
              aria-invalid={!!fieldErrors.passingPercentage}
              aria-describedby={
                fieldErrors.passingPercentage ? "exam-passing-error" : undefined
              }
              placeholder="60"
              className={`${INPUT_CLASS} pr-12`}
              onBlur={() => markTouched("passingPercentage")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-base text-neutral-500">
              %
            </span>
          </div>
          <FieldError
            id="exam-passing-error"
            message={fieldErrors.passingPercentage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
