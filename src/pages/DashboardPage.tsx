import { useAppStore } from "@/lib/store";
import { StatCard } from "@/components/shared/StatCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { HealthRing } from "@/components/shared/HealthRing";
import { equipmentList } from "@/lib/equipment-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Loader2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { logs, analyzedLogs, schedule, isAnalyzing, loadSampleData, runAnalysis } = useAppStore();
  const navigate = useNavigate();

  const high = schedule.filter(s => s.riskLevel === "High").length;
  const med = schedule.filter(s => s.riskLevel === "Medium").length;
  const low = schedule.filter(s => s.riskLevel === "Low").length;
  const hasData = logs.length > 0;
  const hasAnalysis = schedule.length > 0;

  const criticalEquipment = equipmentList.filter(e => e.healthScore < 50);
  const avgHealth = Math.round(equipmentList.reduce((sum, e) => sum + e.healthScore, 0) / equipmentList.length * 10) / 10;

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Dashboard</h1>
      </div>

      {!hasData && (
        <div className="animate-fade-up rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No maintenance logs loaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">Upload your own logs or load sample data to get started.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={() => { loadSampleData(); runAnalysis(); }}>Load Sample Data</Button>
            <Button variant="outline" onClick={() => navigate("/admin/upload")}>Upload Logs</Button>
          </div>
        </div>
      )}

      {hasData && !hasAnalysis && (
        <div className="animate-fade-up rounded-xl border bg-card p-8 text-center">
          <Activity className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">{logs.length} logs loaded</h2>
          <p className="mt-1 text-sm text-muted-foreground">Run AI analysis to detect failure patterns.</p>
          <Button className="mt-4" onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : "Run AI Analysis"}
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Equipment" value={equipmentList.length} icon={<Settings className="h-5 w-5" />} delay={0} />
        <StatCard label="Critical Alerts" value={criticalEquipment.length} icon={<AlertTriangle className="h-5 w-5" />} variant="high" delay={80} />
        <StatCard label="Tasks This Week" value={hasAnalysis ? schedule.length : 0} icon={<Clock className="h-5 w-5" />} delay={160} />
        <StatCard label="Avg Health Score" value={avgHealth} icon={<Activity className="h-5 w-5" />} variant="low" delay={240} />
      </div>

      {/* Equipment Health Grid */}
      <div className="space-y-4 animate-fade-up animate-fade-up-delay-2">
        <h2 className="text-xl font-bold font-display">Equipment Health</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentList.map(eq => (
            <div key={eq.id} className="relative rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-3 right-3">
                <div className={`h-2.5 w-2.5 rounded-full ${eq.healthScore >= 80 ? 'bg-risk-low' : eq.healthScore >= 50 ? 'bg-risk-medium' : 'bg-risk-high'}`} />
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
                <p>Age: {eq.age} years</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Maintenance Queue */}
      {hasAnalysis && (
        <div className="space-y-4 animate-fade-up animate-fade-up-delay-3">
          <h2 className="text-xl font-bold font-display">Priority Maintenance Queue</h2>
          <div className="rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last Serviced</TableHead>
                  <TableHead>Days Ago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalEquipment.map(eq => {
                  const daysSince = Math.floor((Date.now() - new Date(eq.lastServiced).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <TableRow key={eq.id}>
                      <TableCell className="font-semibold">{eq.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{eq.zone}</Badge></TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${eq.healthScore < 50 ? 'risk-high' : 'risk-medium'}`}>
                          {eq.healthScore}%
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{new Date(eq.lastServiced).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</TableCell>
                      <TableCell className="text-muted-foreground">{daysSince} days ago</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Recent AI Insights */}
      {hasAnalysis && (
        <div className="space-y-4 animate-fade-up animate-fade-up-delay-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Recent AI Insights</h2>
            <Button variant="link" size="sm" className="text-primary" onClick={() => navigate("/schedule")}>View All</Button>
          </div>
          <div className="space-y-3">
            {schedule.slice(0, 3).map(s => (
              <div key={s.equipmentId} className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="text-sm">{s.explanation}</p>
                <div className="mt-2 flex items-center gap-3">
                  <RiskBadge level={s.riskLevel} />
                  <span className="text-xs text-muted-foreground">Mar 20, 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
