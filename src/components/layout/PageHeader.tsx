import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-8 border-b border-neutral-300 px-6 py-12">
      <div>
        <h1 className="text-display font-bold text-neutral-900 tracking-wide">
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
