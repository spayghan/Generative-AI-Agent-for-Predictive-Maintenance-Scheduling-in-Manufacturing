import { equipmentList } from "@/lib/equipment-data";
import { useAppStore } from "@/lib/store";
import { HealthRing } from "@/components/shared/HealthRing";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MaintenanceMatrixPage() {
  const { schedule } = useAppStore();

  const matrix = equipmentList.map((eq) => {
    const entry = schedule.find((s) => s.equipmentId === eq.id);
    const daysSinceService = Math.floor((Date.now() - new Date(eq.lastServiced).getTime()) / (1000 * 60 * 60 * 24));
    const nextService = new Date(new Date(eq.lastServiced).getTime() + 30 * 86400000);
    const status = eq.healthScore < 40 ? "Under Maintenance" : eq.healthScore < 60 ? "At Risk" : "Working";

    return { ...eq, entry, daysSinceService, nextService, status };
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Equipment Maintenance Matrix</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete equipment overview with maintenance history and scheduling</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Last Serviced</TableHead>
              <TableHead>Days Since</TableHead>
              <TableHead>Next Scheduled</TableHead>
              <TableHead>Current Issue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.map((eq) => (
              <TableRow key={eq.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-sm">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{eq.type}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{eq.zone}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <HealthRing score={eq.healthScore} size={36} strokeWidth={3} />
                    <span className="text-sm font-medium">{eq.healthScore}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={eq.status === "Working" ? "default" : eq.status === "At Risk" ? "secondary" : "destructive"} className="text-[10px]">
                    {eq.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {eq.entry ? <RiskBadge level={eq.entry.riskLevel} /> : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{eq.age}y</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {new Date(eq.lastServiced).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                </TableCell>
                <TableCell className="text-sm tabular-nums">{eq.daysSinceService}d</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {eq.nextService.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                  {eq.entry?.issue || "No issues"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
