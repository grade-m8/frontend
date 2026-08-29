import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

interface SubjectCardProps {
  category?: string;
  title: string;
  subtitle: string;
  examLabel?: string;
  examValue: string;
  status: string;
  iconSrc?: string;
  onCtaClick?: () => void;
}

export function SubjectCard({
  category = "OBLIGATORIA",
  title,
  subtitle,
  examLabel = "PRÓXIMO EXAMEN",
  examValue,
  status,
  iconSrc,
  onCtaClick,
}: SubjectCardProps) {
  return (
    <Card className="gap-0 rounded-none border border-neutral-650 py-0 shadow-hard ring-0">
      <CardHeader className="flex flex-col items-stretch gap-4 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <Badge
            variant="outline"
            className="label-micro h-auto rounded-none border-neutral-650 bg-neutral-100 px-2 py-1 text-neutral-650"
          >
            {category}
          </Badge>
          {iconSrc && (
            <img src={iconSrc} alt="" className="h-[18px] w-[18px]" />
          )}
        </div>
        <h3 className="text-h2 font-bold text-neutral-900">{title}</h3>
        <p className="text-body text-neutral-650">{subtitle}</p>
      </CardHeader>
      <CardContent className="flex items-end justify-between border-t border-b border-neutral-650 mx-6 px-0 py-6">
        <div className="space-y-0.5">
          <p className="label-micro text-neutral-650">{examLabel}</p>
          <p className="text-body font-medium text-neutral-900">{examValue}</p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="label-micro text-neutral-650">ESTADO</p>
          <p className="text-body font-bold text-teal-700">{status}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-card p-4">
        <Button
          onClick={onCtaClick}
          className="h-13 w-full text-base font-bold"
        >
          Ver Mis Exámenes
        </Button>
      </CardFooter>
    </Card>
  );
}
