import { useState, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { MaintenanceLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Sparkles, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UploadPage() {
  const { logs, setLogs, loadSampleData, runAnalysis, isAnalyzing } = useAppStore();
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const parseCSV = (text: string): MaintenanceLog[] => {
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 2) return [];
    return lines.slice(1).map((line, i) => {
      const parts = line.split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      return {
        id: String(i + 1),
        equipmentId: parts[0] || `EQ-${i}`,
        date: parts[1] || new Date().toISOString().split("T")[0],
        logText: parts[2] || "",
        actionTaken: parts[3] || undefined,
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) { toast.error("Could not parse file. Ensure CSV format with headers."); return; }
      setLogs(parsed);
      toast.success(`${parsed.length} logs imported`);
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.trim().split("\n").filter(Boolean);
    const parsed: MaintenanceLog[] = lines.map((line, i) => ({
      id: String(i + 1),
      equipmentId: `EQ-${String(i + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      logText: line.trim(),
    }));
    setLogs(parsed);
    setPasteText("");
    toast.success(`${parsed.length} logs added`);
  };

  const handleAnalyzeAndView = async () => {
    await runAnalysis();
    navigate("/schedule");
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Upload Logs</h1>
        <p className="mt-1 text-muted-foreground">Import maintenance logs via CSV upload, paste text, or load sample data.</p>
      </div>

      <div className="animate-fade-up grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Upload className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Upload CSV</h3>
          <p className="mt-1 text-sm text-muted-foreground">CSV with columns: equipment_id, date, log_text, action_taken</p>
          <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" className="mt-4 w-full" onClick={() => fileRef.current?.click()}>Choose File</Button>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <FileText className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Paste Logs</h3>
          <p className="mt-1 text-sm text-muted-foreground">One log entry per line — we'll auto-assign equipment IDs.</p>
          <Textarea className="mt-3" rows={3} placeholder="Motor overheating detected…" value={pasteText} onChange={e => setPasteText(e.target.value)} />
          <Button variant="outline" className="mt-3 w-full" onClick={handlePaste} disabled={!pasteText.trim()}>Add Logs</Button>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <Sparkles className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Sample Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">Load 12 pre-built maintenance logs covering common failure patterns.</p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => { loadSampleData(); toast.success("Sample data loaded"); }}>Load Sample Data</Button>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="animate-fade-up rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold">{logs.length} Logs Loaded</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setLogs([])}><Trash2 className="mr-1 h-4 w-4" />Clear</Button>
              <Button size="sm" onClick={handleAnalyzeAndView} disabled={isAnalyzing}>
                {isAnalyzing ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Analyzing…</> : "Analyze & View Schedule"}
              </Button>
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Log Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono font-medium">{l.equipmentId}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{l.date}</TableCell>
                    <TableCell className="max-w-md truncate">{l.logText}</TableCell>
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
