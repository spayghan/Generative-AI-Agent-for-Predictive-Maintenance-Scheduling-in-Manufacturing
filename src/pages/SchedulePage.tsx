import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { RiskBadge } from "@/components/RiskBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RiskLevel } from "@/lib/types";
import { Loader2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function SchedulePage() {
  const { schedule, logs, isAnalyzing, runAnalysis, loadSampleData } = useAppStore();
  const [filter, setFilter] = useState<RiskLevel | "All">("All");
  const navigate = useNavigate();

  const filtered = filter === "All" ? schedule : schedule.filter(s => s.riskLevel === filter);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <h1 className="text-2xl font-bold">No data available</h1>
        <p className="mt-2 text-muted-foreground">Upload logs first to generate a maintenance schedule.</p>
        <Button className="mt-4" onClick={() => navigate("/upload")}>Upload Logs</Button>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <h1 className="text-2xl font-bold">Analysis not run yet</h1>
        <p className="mt-2 text-muted-foreground">{logs.length} logs loaded. Run the AI analysis to generate the schedule.</p>
        <Button className="mt-4" onClick={runAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Analyzing…</> : "Run AI Analysis"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Schedule</h1>
          <p className="mt-1 text-muted-foreground">Prioritized maintenance actions based on AI analysis.</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />{filter === "All" ? "Filter" : filter}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-2" align="end">
            {(["All", "High", "Medium", "Low"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors">
                {f !== "All" && <span className={`h-2 w-2 rounded-full risk-dot-${f.toLowerCase()}`} />}
                {f}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="animate-fade-up animate-fade-up-delay-1 rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead className="hidden md:table-cell">Suggested Action</TableHead>
              <TableHead className="hidden lg:table-cell">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.equipmentId} className="transition-colors hover:bg-muted/50">
                <TableCell className="font-mono font-semibold">{s.equipmentId}</TableCell>
                <TableCell><RiskBadge level={s.riskLevel} /></TableCell>
                <TableCell>{s.issue}</TableCell>
                <TableCell className="hidden max-w-xs md:table-cell">{s.suggestedAction}</TableCell>
                <TableCell className="hidden max-w-sm truncate text-muted-foreground lg:table-cell">{s.explanation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
