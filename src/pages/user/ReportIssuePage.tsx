import { useState } from "react";
import { useReportsStore } from "@/lib/reports-store";
import { useAuthStore } from "@/lib/auth-store";
import { equipmentList } from "@/lib/equipment-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ClipboardList } from "lucide-react";
import { toast } from "sonner";

const issueTypes = ["Overheating", "Leakage", "Vibration", "Pressure Drop", "Other"] as const;
const severities = ["High", "Medium", "Low"] as const;

export default function ReportIssuePage() {
  const addReport = useReportsStore((s) => s.addReport);
  const user = useAuthStore((s) => s.user);
  const [equipmentId, setEquipmentId] = useState("");
  const [issueType, setIssueType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentId || !issueType || !description.trim() || !severity) return;

    addReport({
      equipmentId,
      issueType: issueType as any,
      description: description.trim(),
      severity: severity as any,
      reportedBy: user?.email || "unknown",
    });

    toast.success("Issue reported successfully");
    setSubmitted(true);
    setTimeout(() => {
      setEquipmentId("");
      setIssueType("");
      setDescription("");
      setSeverity("");
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Report Machine Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit equipment issues for admin review</p>
      </div>

      {submitted ? (
        <div className="rounded-xl border bg-card p-12 text-center animate-fade-up">
          <CheckCircle className="mx-auto h-12 w-12 text-[hsl(var(--risk-low))]" />
          <h2 className="mt-4 text-lg font-semibold">Issue Reported</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your report has been submitted to the admin team.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ClipboardList className="h-5 w-5" />
            <span className="font-semibold text-sm">New Issue Report</span>
          </div>

          <div className="space-y-2">
            <Label>Equipment</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
              <SelectContent>
                {equipmentList.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>{eq.id} — {eq.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Issue Type</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger>
              <SelectContent>
                {issueTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail…" rows={4} required />
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
              <SelectContent>
                {severities.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!equipmentId || !issueType || !description.trim() || !severity}>
            Submit Report
          </Button>
        </form>
      )}
    </div>
  );
}
