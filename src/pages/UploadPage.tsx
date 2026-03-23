import { useState, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { MaintenanceLog } from "@/lib/types";
import { equipmentList } from "@/lib/equipment-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UploadPage() {
  const { setLogs, runAnalysis, isAnalyzing } = useAppStore();
  const navigate = useNavigate();

  const [equipmentId, setEquipmentId] = useState("");
  const [operator, setOperator] = useState("");
  const [logType, setLogType] = useState("Maintenance Log");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentId || !description.trim()) {
      toast.error("Please select equipment and enter a description.");
      return;
    }

    const log: MaintenanceLog = {
      id: Date.now().toString(),
      equipmentId,
      date: new Date().toISOString().split("T")[0],
      logText: description.trim(),
      operator,
      logType,
      severity,
    };

    setLogs([log]);
    await runAnalysis();
    toast.success("Log submitted and analyzed");
    navigate("/admin/schedule");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Submit Maintenance Log</h1>
      </div>

      <form onSubmit={handleSubmit} className="animate-fade-up animate-fade-up-delay-1 rounded-xl border bg-card p-6 shadow-sm space-y-6">
        {/* Equipment */}
        <div className="space-y-2">
          <Label className="font-semibold">Equipment</Label>
          <Select value={equipmentId} onValueChange={setEquipmentId}>
            <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
            <SelectContent>
              {equipmentList.map(eq => (
                <SelectItem key={eq.id} value={eq.id}>{eq.name} ({eq.id})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Operator */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-semibold">Log Date & Time</Label>
            <Input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Operator Name</Label>
            <Input placeholder="Enter operator name" value={operator} onChange={e => setOperator(e.target.value)} />
          </div>
        </div>

        {/* Log Type & Severity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-semibold">Log Type</Label>
            <Select value={logType} onValueChange={setLogType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance Log">Maintenance Log</SelectItem>
                <SelectItem value="Incident Report">Incident Report</SelectItem>
                <SelectItem value="Operational Note">Operational Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="font-semibold">Description</Label>
          <Textarea
            rows={6}
            placeholder="Describe the maintenance activity, issue, or observation in detail..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{description.length} characters</p>
        </div>

        <Button type="submit" className="w-full" disabled={isAnalyzing}>
          {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing…</> : "Analyze & Submit Log"}
        </Button>
      </form>
    </div>
  );
}
