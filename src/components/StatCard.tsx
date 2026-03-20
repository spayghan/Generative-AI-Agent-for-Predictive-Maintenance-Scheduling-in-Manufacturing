import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "high" | "medium" | "low";
  className?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, variant = "default", className, delay = 0 }: StatCardProps) {
  return (
    <div
      className={cn(
        "animate-fade-up rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          variant === "high" && "bg-risk-high/10 text-risk-high",
          variant === "medium" && "bg-risk-medium/10 text-risk-medium",
          variant === "low" && "bg-risk-low/10 text-risk-low",
          variant === "default" && "bg-primary/10 text-primary",
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
