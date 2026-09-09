import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, DoorClosed } from "lucide-react";

export interface EnrollSubjectCardProps {
  name: string;
  teacher: string;
  room: string;
  onEnroll?: () => void;
}

export function EnrollSubjectCard({
  name,
  teacher,
  room,
  onEnroll,
}: EnrollSubjectCardProps) {
  return (
    <Card className="gap-0 rounded-none border border-neutral-650 py-0 shadow-hard ring-0 transition-transform duration-200 hover:-translate-y-0.5 bg-card flex flex-col justify-between">
      <CardHeader className="flex flex-col items-stretch gap-2.5 px-6 pt-5 pb-3">
        <h3 className="text-h3 font-bold text-neutral-900 leading-snug">
          {name}
        </h3>
      </CardHeader>

      <CardContent className="border-t border-b border-neutral-300 mx-6 px-0 py-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-650">
          <User className="h-4 w-4 shrink-0 text-neutral-500" />
          <span className="truncate">
            <span className="font-semibold text-neutral-800">Docente:</span>{" "}
            {teacher}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-650">
          <DoorClosed className="h-4 w-4 shrink-0 text-neutral-500" />
          <span className="truncate">
            <span className="font-semibold text-neutral-800">Aula:</span> {room}
          </span>
        </div>
      </CardContent>

      <CardFooter className="bg-card p-4">
        <Button
          type="button"
          onClick={onEnroll}
          className="h-11 w-full text-sm font-bold uppercase tracking-wider cursor-pointer"
        >
          INSCRIBIRSE
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EnrollSubjectCard;
