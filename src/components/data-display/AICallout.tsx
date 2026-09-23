import { Card } from "@/components/ui/card.tsx";
import { Sparkles } from "lucide-react";

export interface AICalloutProps {
  mode: "view" | "edit";
  value: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function AICallout(props: AICalloutProps) {
  const { mode, value, onChange, error } = props;
  switch (mode) {
    case "edit":
      return (
        <div className="border border-teal-200 bg-teal-50/20 rounded-lg p-5">
          <div className="flex flex-row gap-2 items-center">
            <Sparkles className="h-4 w-4 shrink-0 text-teal-700" />
            <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wide">
              CALIBRACIÓN DE IA: RESPUESTA IDEAL
            </h3>
          </div>
          <p className="text-sm text-neutral-650 mt-1">
            Proporcione los puntos clave, conceptos obligatorios o la estructura
            ideal que la IA debe buscar al evaluar las respuestas de los
            estudiantes.
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Ej: El estudiante debe mencionar X, argumentar Y basándose en Z..."
            className="min-h-[110px] w-full border border-neutral-300 rounded-md p-3 focus:border-teal-600 bg-white mt-3 outline-none"
          />
          {error && <p className="text-danger-500 text-xs mt-1">{error}</p>}
        </div>
      );
    case "view":
      return (
        <Card className="border-l-4 border-teal-600 bg-teal-50/40 p-4 rounded-r-md">
          <div className="flex flex-row gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-teal-700" />
            <h3 className="text-sm font-bold text-teal-800 tracking-wide">
              RESPUESTA IDEAL (CALIBRACIÓN IA)
            </h3>
          </div>
          <p className="mt-2 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
            {value}
          </p>
        </Card>
      );
  }
}
