import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import fx from "@/assets/fx.svg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ExamCard() {
  return (
    <Card className="gap-0 rounded-none border border-neutral-650 py-0 shadow-hard ring-0 transition-transform duration-200 hover:-translate-y-1 cursor-pointer">
      <CardHeader className="flex flex-col items-stretch gap-4 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <img src={fx} alt="" className="h-[18px] w-[18px]" />
          <Badge
            variant="outline"
            className="label-micro h-auto rounded-none border-teal-700 bg-teal-50 px-2 py-1 text-teal-700"
          >
            CORREGIDO
          </Badge>
        </div>
        <h3 className="text-h2 font-bold text-neutral-900">Primer Parcial</h3>
        <p className="text-body text-neutral-650">45 Alumnos</p>
      </CardHeader>
      <CardContent className="flex items-end justify-between border-t border-b border-neutral-650 mx-6 px-0 py-6">
        <div className="space-y-0.5">
          <p className="label-micro text-neutral-650">FECHA</p>
          <p className="text-body font-medium text-neutral-900">
            24 Oct, 18:00
          </p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="label-micro text-neutral-650">DURACIÓN</p>
          <p className="text-body font-bold text-teal-700">90 min</p>
        </div>
      </CardContent>
      <CardFooter className="bg-card p-4">
        <Button className="h-13 w-full text-base font-bold">
          Ir Al Examen
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
