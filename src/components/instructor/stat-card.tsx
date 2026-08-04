import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ReactNode;
  tone?: "default" | "accent" | "warning" | "success";
}) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    accent: "bg-accent/25 text-accent-foreground",
    warning: "bg-warning/20 text-warning-foreground",
    success: "bg-success/15 text-success",
  };
  return (
    <Card className="border-border/70 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-3xl leading-none">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-lg", tones[tone])}>{icon}</span>
      </CardContent>
    </Card>
  );
}
