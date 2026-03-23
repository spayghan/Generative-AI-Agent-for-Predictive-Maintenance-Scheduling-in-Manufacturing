import { create } from "zustand";

export interface AITraceStep {
  step: number;
  action: string;
  detail: string;
  timestamp: string;
}

export interface AIInteraction {
  id: string;
  query: string;
  response: string;
  user: string;
  role: "admin" | "user";
  timestamp: string;
  traceSteps: AITraceStep[];
}

interface AIHistoryState {
  interactions: AIInteraction[];
  addInteraction: (interaction: Omit<AIInteraction, "id" | "timestamp">) => void;
  getInteractionsForContext: () => string;
}

export const useAIHistoryStore = create<AIHistoryState>((set, get) => ({
  interactions: [],
  addInteraction: (interaction) =>
    set((s) => ({
      interactions: [
        ...s.interactions,
        { ...interaction, id: crypto.randomUUID(), timestamp: new Date().toISOString() },
      ].slice(-100), // Keep last 100
    })),
  getInteractionsForContext: () => {
    const recent = get().interactions.slice(-10);
    return recent.map((i) => `[${i.role}] Q: ${i.query}\nA: ${i.response}`).join("\n---\n");
  },
}));
