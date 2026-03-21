import { useReportsStore, EmployeeReport } from "@/lib/reports-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

function statusColor(status: EmployeeReport["status"]) {
  if (status === "Open") return "destructive";
  if (status === "In Review") return "secondary";
  return "default";
}

function severityClass(severity: string) {
  if (severity === "High") return "risk-high";
  if (severity === "Medium") return "risk-medium";
  return "risk-low";
}

export default function ReportedIssuesPage() {
  const { reports, updateReportStatus } = useReportsStore();

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Reported Issues</h1>
        <p className="text-sm text-muted-foreground mt-1">Employee-reported equipment issues</p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No reports yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Employee-reported issues will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">{r.equipmentId}</TableCell>
                  <TableCell>{r.issueType}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${severityClass(r.severity)}`}>
                      {r.severity}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{r.description}</TableCell>
                  <TableCell className="text-sm">{r.reportedBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.reportedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => updateReportStatus(r.id, v as EmployeeReport["status"])}>
                      <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
