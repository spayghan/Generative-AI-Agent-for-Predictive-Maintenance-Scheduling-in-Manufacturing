import { cn } from "@/lib/utils";

interface HealthRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getColor(score: number): string {
  if (score >= 80) return "hsl(var(--risk-low))";
  if (score >= 50) return "hsl(var(--risk-medium))";
  return "hsl(var(--risk-high))";
}

export function HealthRing({ score, size = 64, strokeWidth = 5, className }: HealthRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}
