import { useAppStore } from "@/lib/store";
import { StatCard } from "@/components/shared/StatCard";
import { HealthRing } from "@/components/shared/HealthRing";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { equipmentList } from "@/lib/equipment-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Clock, Settings, Database, Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { logs, schedule, isAnalyzing, loadSampleData, runAnalysis } = useAppStore();
  const hasData = logs.length > 0;
  const hasAnalysis = schedule.length > 0;

  const criticalEquipment = equipmentList.filter((e) => e.healthScore < 50);
  const avgHealth = Math.round(equipmentList.reduce((s, e) => s + e.healthScore, 0) / equipmentList.length * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Employee Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">View machine health and maintenance schedule</p>
      </div>

      {!hasData && (
        <div className="animate-fade-up rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No data available</h2>
          <p className="mt-2 text-sm text-muted-foreground">Load sample data to view equipment status.</p>
          <Button className="mt-6" onClick={() => { loadSampleData(); runAnalysis(); }}>Load Sample Data</Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Equipment" value={equipmentList.length} icon={<Settings className="h-5 w-5" />} delay={0} />
        <StatCard label="Critical Alerts" value={criticalEquipment.length} icon={<AlertTriangle className="h-5 w-5" />} variant="high" delay={80} />
        <StatCard label="Tasks This Week" value={hasAnalysis ? schedule.length : 0} icon={<Clock className="h-5 w-5" />} delay={160} />
        <StatCard label="Avg Health Score" value={avgHealth} icon={<Activity className="h-5 w-5" />} variant="low" delay={240} />
      </div>

      <div className="space-y-4 animate-fade-up animate-fade-up-delay-2">
        <h2 className="text-xl font-bold font-display">Equipment Health</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentList.map((eq) => (
            <div key={eq.id} className="relative rounded-xl border bg-card p-4 shadow-sm">
              <div className="absolute top-3 right-3">
                <div className={`h-2.5 w-2.5 rounded-full ${eq.healthScore >= 80 ? "bg-risk-low" : eq.healthScore >= 50 ? "bg-risk-medium" : "bg-risk-high"}`} />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{eq.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-[10px]">{eq.zone}</Badge>
                </div>
                <HealthRing score={eq.healthScore} size={56} strokeWidth={4} />
              </div>
              <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                <p>Last Serviced: {new Date(eq.lastServiced).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasAnalysis && (
        <div className="space-y-4 animate-fade-up animate-fade-up-delay-3">
          <h2 className="text-xl font-bold font-display">Maintenance Schedule</h2>
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((s) => (
                  <TableRow key={s.equipmentId}>
                    <TableCell className="font-semibold">{s.equipmentId}</TableCell>
                    <TableCell><RiskBadge level={s.riskLevel} /></TableCell>
                    <TableCell className="text-sm">{s.issue}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.suggestedAction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
