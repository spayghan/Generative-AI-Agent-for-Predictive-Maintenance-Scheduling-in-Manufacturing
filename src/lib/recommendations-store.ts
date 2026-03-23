import { create } from "zustand";

export interface Recommendation {
  id: string;
  employeeName: string;
  employeeEmail: string;
  category: "Safety" | "Efficiency" | "Equipment" | "Process" | "Other";
  title: string;
  description: string;
  status: "Pending" | "Reviewed" | "Implemented" | "Dismissed";
  submittedAt: string;
}

interface RecommendationsState {
  recommendations: Recommendation[];
  addRecommendation: (rec: Omit<Recommendation, "id" | "status" | "submittedAt">) => void;
  updateStatus: (id: string, status: Recommendation["status"]) => void;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
  recommendations: [],
  addRecommendation: (rec) =>
    set((s) => ({
      recommendations: [
        ...s.recommendations,
        { ...rec, id: crypto.randomUUID(), status: "Pending", submittedAt: new Date().toISOString() },
      ],
    })),
  updateStatus: (id, status) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
