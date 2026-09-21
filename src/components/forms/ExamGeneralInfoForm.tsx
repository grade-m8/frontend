import { Braces } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export function ExamGeneralInfoForm() {
  return (
    <Card className="rounded-none border border-neutral-200 bg-neutral-100 py-0 ring-0">
      <CardHeader className="mx-6 mt-6 flex items-center gap-2 border-b border-neutral-300 px-0 pb-4">
        <Braces className="h-5 w-5 text-teal-800" />
        <h2 className="text-h2 font-semibold text-neutral-900">
          Información General
        </h2>
      </CardHeader>
    </Card>
  );
}
