import { useAppStore } from "@/lib/store";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SchedulePage() {
  const { schedule, logs, isAnalyzing, runAnalysis, loadSampleData } = useAppStore();
  const navigate = useNavigate();

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <h1 className="text-2xl font-bold font-display">No data available</h1>
        <p className="mt-2 text-muted-foreground">Upload logs first to generate a maintenance schedule.</p>
        <Button className="mt-4" onClick={() => navigate("/admin/upload")}>Upload Logs</Button>
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <h1 className="text-2xl font-bold font-display">Analysis not run yet</h1>
        <p className="mt-2 text-muted-foreground">{logs.length} logs loaded.</p>
        <Button className="mt-4" onClick={runAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Analyzing…</> : "Run AI Analysis"}
        </Button>
      </div>
    );
  }

  // Group by scheduled date (mock dates based on priority)
  const withDates = schedule.map((s, i) => ({
    ...s,
    scheduledDate: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    team: `Team ${String.fromCharCode(65 + (i % 4))}`,
    estimatedHours: s.riskLevel === "High" ? 6 : s.riskLevel === "Medium" ? 4.5 : 2,
  }));

  const grouped = withDates.reduce<Record<string, typeof withDates>>((acc, item) => {
    (acc[item.scheduledDate] = acc[item.scheduledDate] || []).push(item);
    return acc;
  }, {});

  const handleAutoGenerate = async () => {
    loadSampleData();
    await runAnalysis();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Maintenance Schedule</h1>
        <Button onClick={handleAutoGenerate} disabled={isAnalyzing} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Auto-Generate AI Schedule
        </Button>
      </div>

      <div className="space-y-8 animate-fade-up animate-fade-up-delay-1">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold font-display">{date}</span>
              <span className="text-xs text-muted-foreground">({items.length} tasks)</span>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.equipmentId}
                  className={`rounded-xl border bg-card p-5 shadow-sm relative overflow-hidden ${
                    item.riskLevel === "High" ? "border-l-4 border-l-risk-high" :
                    item.riskLevel === "Medium" ? "border-l-4 border-l-risk-medium" :
                    "border-l-4 border-l-risk-low"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.issue}</h3>
                      <p className="text-sm text-muted-foreground">{item.equipmentId}</p>
                      <p className="text-sm mt-2">{item.suggestedAction}</p>
                      <p className="text-xs italic text-muted-foreground mt-1">Justification: {item.explanation}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <RiskBadge level={item.riskLevel} />
                        <Badge variant="secondary" className="text-[10px]">{item.team}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{item.estimatedHours}h</Badge>
                        <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="default">Start</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
