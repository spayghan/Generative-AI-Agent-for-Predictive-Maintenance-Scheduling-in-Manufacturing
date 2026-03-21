import { create } from "zustand";

export interface EmployeeReport {
  id: string;
  equipmentId: string;
  issueType: "Overheating" | "Leakage" | "Vibration" | "Pressure Drop" | "Other";
  description: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "In Review" | "Resolved";
  reportedBy: string;
  reportedAt: string;
}

interface ReportsState {
  reports: EmployeeReport[];
  addReport: (report: Omit<EmployeeReport, "id" | "status" | "reportedAt">) => void;
  updateReportStatus: (id: string, status: EmployeeReport["status"]) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  addReport: (report) =>
    set((s) => ({
      reports: [
        ...s.reports,
        {
          ...report,
          id: crypto.randomUUID(),
          status: "Open",
          reportedAt: new Date().toISOString(),
        },
      ],
    })),
  updateReportStatus: (id, status) =>
    set((s) => ({
      reports: s.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
