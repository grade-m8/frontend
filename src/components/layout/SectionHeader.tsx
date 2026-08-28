import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
    title: string
    icon?: LucideIcon
    actions?: ReactNode
}

export function SectionHeader({ title, icon: Icon, actions }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 border-b-2 border-neutral-900 pt-8 pb-4">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-[18px] w-[18px] text-neutral-900" />}
                <h2 className="text-h3 font-bold uppercase tracking-tight text-neutral-900">
                    {title}
                </h2>
            </div>
            {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>
    )
}