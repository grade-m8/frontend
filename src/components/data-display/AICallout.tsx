import { Card } from "@/components/ui/card.tsx";
import { Sparkles } from "lucide-react";

export interface AICalloutProps {
  mode: "view" | "edit";
  value: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function AICallout(props: AICalloutProps) {
  const { mode, value } = props;
  switch (mode) {
    case "edit":
      return null;
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
