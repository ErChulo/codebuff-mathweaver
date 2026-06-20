import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; to: string } | { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 text-center max-w-xl mx-auto">
      <div className="size-14 rounded-2xl bg-primary/15 mx-auto flex items-center justify-center mb-4 glow-text">
        <Icon className="size-7" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
      )}
      {cta && "to" in cta ? (
        <Link
          to={cta.to}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          {cta.label}
        </Link>
      ) : cta ? (
        <button
          onClick={(cta as any).onClick}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          {cta.label}
        </button>
      ) : null}
    </div>
  );
}
