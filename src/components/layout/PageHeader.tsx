interface PageHeaderProps {
    title: string
    subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="border-b border-neutral-300 px-6 py-12">
            <h1 className="text-display font-bold tracking-tight text-neutral-900">
                {title}
            </h1>
            {subtitle && (
                <p className="text-h3 font-normal text-neutral-700">{subtitle}</p>
            )}
        </div>
    )
}