import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 border-b border-neutral-300 px-6 py-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <h1 className="text-h2 sm:text-h1 lg:text-display font-bold text-neutral-900 tracking-wide break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-h3 font-normal text-neutral-700 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  );
}
