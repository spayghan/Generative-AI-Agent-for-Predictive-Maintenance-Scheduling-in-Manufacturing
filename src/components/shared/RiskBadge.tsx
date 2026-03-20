import { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
      level === "High" && "risk-high",
      level === "Medium" && "risk-medium",
      level === "Low" && "risk-low",
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {level}
    </span>
  );
}
