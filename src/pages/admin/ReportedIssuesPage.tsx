import { useReportsStore, EmployeeReport } from "@/lib/reports-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Assuming this is your hook path
import { useState } from "react";

// function severityClass(severity: string) {
//   if (severity === "High") return "risk-high";
//   if (severity === "Medium") return "risk-medium";
//   return "risk-low";
// }

// export default function ReportedIssuesPage() {
//   const { reports, updateReportStatus } = useReportsStore();
//   const { toast } = useToast();
//   const [isSending, setIsSending] = useState<string | null>(null);

//   const handleStatusChange = async (report: EmployeeReport, newStatus: EmployeeReport["status"]) => {
//     // 1. Update the local state immediately for UI responsiveness
//     updateReportStatus(report.id, newStatus);

//     // 2. If the status is changed to "Resolved", trigger the email
//     if (newStatus === "Resolved") {
//       setIsSending(report.id);
      
//       try {
//         const response = await fetch("http://localhost:3001/api/resolve-issue", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             // NOTE: Using r.reportedBy as the email. 
//             // In a real app, you'd have a r.reportedByEmail field.
//             employeeEmail: report.reportedBy, 
//             equipmentId: report.equipmentId,
//             issue: report.description
//           })
//         });

//         if (response.ok) {
//           toast({
//             title: "Success",
//             description: `Notification email sent to ${report.reportedBy}`,
//             variant: "default",
//           });
//         } else {
//           throw new Error("Failed to send email");
//         }
//       } catch (error) {
//         console.error("Email Error:", error);
//         toast({
//           title: "Email Failed",
//           description: "Issue resolved locally, but email notification failed to send.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsSending(null);
//       }
//     }
//   };

//   return (
//     <div className="space-y-6 animate-fade-up">
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight font-display">Reported Issues</h1>
//           <p className="text-sm text-muted-foreground mt-1">Employee-reported equipment issues</p>
//         </div>
//         <Badge variant="outline" className="h-fit">Total: {reports.length}</Badge>
//       </div>

//       {reports.length === 0 ? (
//         <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
//           <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
//           <h2 className="mt-4 text-lg font-semibold text-white">No reports yet</h2>
//           <p className="mt-2 text-sm text-muted-foreground">Employee-reported issues will appear here.</p>
//         </div>
//       ) : (
//         <div className="pro-card overflow-hidden border border-border/50 bg-card shadow-xl rounded-xl">
//           <Table>
//             <TableHeader className="bg-secondary/30">
//               <TableRow className="border-border/50">
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Equipment</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Issue Type</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Severity</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Description</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Reported By</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Date</TableHead>
//                 <TableHead className="font-display text-xs uppercase tracking-wider">Action / Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {reports.map((r) => (
//                 <TableRow key={r.id} className="border-border/40 hover:bg-white/5 transition-colors">
//                   <TableCell className="font-bold text-primary">{r.equipmentId}</TableCell>
//                   <TableCell className="text-sm">{r.issueType}</TableCell>
//                   <TableCell>
//                     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${severityClass(r.severity)}`}>
//                       {r.severity}
//                     </span>
//                   </TableCell>
//                   <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground" title={r.description}>
//                     {r.description}
//                   </TableCell>
//                   <TableCell className="text-sm font-medium">{r.reportedBy}</TableCell>
//                   <TableCell className="text-xs text-muted-foreground tabular-nums">
//                     {new Date(r.reportedAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Select 
//                         value={r.status} 
//                         onValueChange={(v) => handleStatusChange(r, v as EmployeeReport["status"])}
//                         disabled={isSending === r.id}
//                       >
//                         <SelectTrigger className={`h-8 w-[120px] text-[11px] font-semibold border-none shadow-sm ${
//                           r.status === "Resolved" ? "bg-success text-white" : 
//                           r.status === "In Review" ? "bg-warning text-white" : "bg-destructive text-white"
//                         }`}>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Open">🔴 Open</SelectItem>
//                           <SelectItem value="In Review">🟠 In Review</SelectItem>
//                           <SelectItem value="Resolved">🟢 Resolved</SelectItem>
//                         </SelectContent>
//                       </Select>
                      
//                       {isSending === r.id && (
//                         <Loader2 className="h-4 w-4 animate-spin text-primary" />
//                       )}
//                       {r.status === "Resolved" && !isSending && (
//                         <CheckCircle2 className="h-4 w-4 text-success" />
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// }
function severityClass(severity: string) {
  if (severity === "High") return "bg-destructive/10 text-destructive border-destructive/20";
  if (severity === "Medium") return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}

export default function ReportedIssuesPage() {
  const { reports, updateReportStatus } = useReportsStore();
  const { toast } = useToast();

  const handleStatusChange = async (id: string, newStatus: EmployeeReport["status"], report: EmployeeReport) => {
    // 1. Update UI locally
    updateReportStatus(id, newStatus);

    // 2. If Resolved, call Backend to send Gmail
    if (newStatus === "Resolved") {
      toast({
        title: "Notifying Employee",
        description: "Sending resolution email via MaintainIQ Backend...",
      });

      try {
        const response = await fetch("http://localhost:3001/api/resolve-issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeEmail: "shashvatpayghan453@gmail.com", // Type your actual email here to test
            machineId: report.equipmentId,
            issueType: report.issueType,
          }),
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Employee has been notified via Gmail.",
          });
        }
      } catch (error) {
        console.error("Backend offline or email error:", error);
        toast({
          title: "System Note",
          description: "Issue resolved locally. (Backend email service unavailable)",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display flex items-center gap-2">
            <AlertCircle className="text-primary h-6 w-6" />
            Reported Issues
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage floor-reported anomalies and notify employees.</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
          {reports.filter(r => r.status !== "Resolved").length} Active Issues
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-16 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500/50" />
          <h2 className="mt-4 text-lg font-semibold">All systems clear</h2>
          <p className="mt-2 text-sm text-muted-foreground">No issues reported by employees.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Equipment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden md:table-cell">Reporter</TableHead>
                <TableHead>Status / Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold">{r.equipmentId}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded border">
                      {r.issueType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${severityClass(r.severity)}`}>
                      {r.severity}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-sm">{r.reportedBy}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(r.reportedAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(v) => handleStatusChange(r.id, v as EmployeeReport["status"], r)}
                    >
                      <SelectTrigger className={`h-8 w-[130px] text-xs font-medium ${r.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">🔴 Open</SelectItem>
                        <SelectItem value="In Review">🟡 In Review</SelectItem>
                        <SelectItem value="Resolved">🟢 Resolved</SelectItem>
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