import { useAppStore } from "@/lib/store";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { logs, analyzedLogs, schedule, isAnalyzing, loadSampleData, runAnalysis } = useAppStore();
  const navigate = useNavigate();

  const high = schedule.filter(s => s.riskLevel === "High").length;
  const med = schedule.filter(s => s.riskLevel === "Medium").length;
  const low = schedule.filter(s => s.riskLevel === "Low").length;
  const hasData = logs.length > 0;
  const hasAnalysis = schedule.length > 0;

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Monitor equipment health and maintenance priorities at a glance.</p>
      </div>

      {!hasData && (
        <div className="animate-fade-up rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No maintenance logs loaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">Upload your own logs or load sample data to get started.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={loadSampleData}>Load Sample Data</Button>
            <Button variant="outline" onClick={() => navigate("/upload")}>Upload Logs</Button>
          </div>
        </div>
      )}

      {hasData && !hasAnalysis && (
        <div className="animate-fade-up rounded-xl border bg-card p-8 text-center">
          <Activity className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">{logs.length} logs loaded</h2>
          <p className="mt-1 text-sm text-muted-foreground">Run the AI analysis to detect failure patterns and generate a maintenance schedule.</p>
          <Button className="mt-4" onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : "Run AI Analysis"}
          </Button>
        </div>
      )}

      {hasAnalysis && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Equipment" value={schedule.length} icon={<Database className="h-5 w-5" />} delay={0} />
            <StatCard label="High Risk" value={high} icon={<AlertTriangle className="h-5 w-5" />} variant="high" delay={80} />
            <StatCard label="Medium Risk" value={med} icon={<Clock className="h-5 w-5" />} variant="medium" delay={160} />
            <StatCard label="Low Risk" value={low} icon={<CheckCircle className="h-5 w-5" />} variant="low" delay={240} />
          </div>

          <div className="animate-fade-up animate-fade-up-delay-3 rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold">Maintenance Schedule</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead className="hidden md:table-cell">Suggested Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map(s => (
                  <TableRow key={s.equipmentId} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-mono font-semibold">{s.equipmentId}</TableCell>
                    <TableCell><RiskBadge level={s.riskLevel} /></TableCell>
                    <TableCell>{s.issue}</TableCell>
                    <TableCell className="hidden max-w-xs truncate md:table-cell">{s.suggestedAction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
