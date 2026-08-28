import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"

interface SubjectCardProps {
    category?: string
    title: string
    subtitle: string
    iconSrc?: string
}

export function SubjectCard({
    category = "OBLIGATORIA",
    title,
    subtitle,
    iconSrc,
}: SubjectCardProps) {
    return (
        <Card className="gap-0 rounded-none border border-neutral-650 py-0 shadow-hard ring-0">
            <CardHeader className="flex flex-col items-stretch gap-2 px-6 pt-6 pb-4">
                <div className="flex items-start justify-between">
                    <Badge
                        variant="outline"
                        className="label-micro h-auto rounded-none border-neutral-650 bg-neutral-100 px-2 py-1 text-neutral-650"
                    >
                        {category}
                    </Badge>
                    {iconSrc && <img src={iconSrc} alt="" className="h-[18px] w-[18px]" />}
                </div>
                <h3 className="text-h2 font-bold text-neutral-900">{title}</h3>
                <p className="text-body text-neutral-650">{subtitle}</p>
            </CardHeader>
        </Card>
    )
}