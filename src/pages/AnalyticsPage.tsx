import { equipmentList } from "@/lib/equipment-data";
import { useAppStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const COLORS = ["hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

export default function AnalyticsPage() {
  const { schedule, loadSampleData, runAnalysis } = useAppStore();

  // Health by zone
  const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];
  const zoneData = zones.map(zone => {
    const eqs = equipmentList.filter(e => e.zone === zone);
    const avg = eqs.length ? Math.round(eqs.reduce((s, e) => s + e.healthScore, 0) / eqs.length) : 0;
    return { zone, health: avg };
  });

  // Log type distribution (mock based on schedule)
  const logTypes = [
    { name: "Incident Report", value: 45 },
    { name: "Maintenance Log", value: 27 },
    { name: "Operational Note", value: 27 },
  ];

  const handleGenerate = async () => {
    loadSampleData();
    await runAnalysis();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Analytics & Insights</h1>
        <Button onClick={handleGenerate} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate AI Summary
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-fade-up animate-fade-up-delay-1">
        {/* Bar Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold font-display mb-4">Average Health Score by Zone</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
              <XAxis dataKey="zone" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 25%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)" }}
              />
              <Bar dataKey="health" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold font-display mb-4">Maintenance Log Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={logTypes}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
              >
                {logTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(217, 33%, 17%)", border: "1px solid hsl(217, 33%, 25%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
