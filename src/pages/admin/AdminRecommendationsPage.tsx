import { useRecommendationsStore, Recommendation } from "@/lib/recommendations-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb } from "lucide-react";

function statusVariant(status: Recommendation["status"]) {
  if (status === "Pending") return "destructive" as const;
  if (status === "Reviewed") return "secondary" as const;
  if (status === "Implemented") return "default" as const;
  return "outline" as const;
}

export default function AdminRecommendationsPage() {
  const { recommendations, updateStatus } = useRecommendationsStore();

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Employee Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">Suggestions submitted by employees</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No recommendations yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Employee suggestions will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{r.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{r.employeeEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{r.category}</Badge></TableCell>
                  <TableCell className="font-medium text-sm">{r.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{r.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as Recommendation["status"])}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Implemented">Implemented</SelectItem>
                        <SelectItem value="Dismissed">Dismissed</SelectItem>
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
