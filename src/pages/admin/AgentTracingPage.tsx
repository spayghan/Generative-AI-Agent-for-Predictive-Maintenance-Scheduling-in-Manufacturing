import { useAIHistoryStore } from "@/lib/ai-history-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function AgentTracingPage() {
  const interactions = useAIHistoryStore((s) => s.interactions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-display">AI Agent Tracing</h1>
        <p className="text-sm text-muted-foreground mt-1">Track AI decision-making process and reasoning steps</p>
      </div>

      {interactions.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No AI interactions yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use the AI Chat Assistant to generate interaction traces.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...interactions].reverse().map((interaction) => (
            <div key={interaction.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === interaction.id ? null : interaction.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant={interaction.role === "admin" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {interaction.role}
                  </Badge>
                  <span className="font-medium text-sm truncate">{interaction.query}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(interaction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {expandedId === interaction.id ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {expandedId === interaction.id && (
                <div className="px-4 pb-4 space-y-4 animate-fade-up">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">Response:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interaction.response.slice(0, 300)}</p>
                  </div>

                  {interaction.traceSteps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-primary mb-2">Reasoning Steps:</p>
                      <div className="space-y-2">
                        {interaction.traceSteps.map((step, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {step.step}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{step.action}</p>
                              <p className="text-xs text-muted-foreground">{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
