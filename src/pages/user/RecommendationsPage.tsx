import { useState } from "react";
import { useRecommendationsStore } from "@/lib/recommendations-store";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const categories = ["Safety", "Efficiency", "Equipment", "Process", "Other"] as const;

export default function RecommendationsPage() {
  const addRecommendation = useRecommendationsStore((s) => s.addRecommendation);
  const user = useAuthStore((s) => s.user);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !description.trim()) return;

    addRecommendation({
      employeeName: user?.email?.split("@")[0] || "Employee",
      employeeEmail: user?.email || "",
      category: category as any,
      title: title.trim(),
      description: description.trim(),
    });

    toast.success("Recommendation submitted!");
    setSubmitted(true);
    setTimeout(() => {
      setTitle("");
      setCategory("");
      setDescription("");
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">Company Recommendations</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit suggestions to improve operations</p>
      </div>

      {submitted ? (
        <div className="rounded-xl border bg-card p-12 text-center animate-fade-up">
          <CheckCircle className="mx-auto h-12 w-12 text-[hsl(var(--risk-low))]" />
          <h2 className="mt-4 text-lg font-semibold">Recommendation Submitted</h2>
          <p className="mt-1 text-sm text-muted-foreground">Thank you for your suggestion!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Lightbulb className="h-5 w-5" />
            <span className="font-semibold text-sm">New Recommendation</span>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title for your suggestion" required />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your recommendation in detail…" rows={5} required />
          </div>

          <Button type="submit" className="w-full" disabled={!title.trim() || !category || !description.trim()}>
            Submit Recommendation
          </Button>
        </form>
      )}
    </div>
  );
}
