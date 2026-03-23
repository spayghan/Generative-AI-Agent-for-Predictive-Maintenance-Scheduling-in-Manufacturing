import { create } from "zustand";

export interface Alert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: "critical" | "warning" | "safety";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "acknowledged">) => void;
  acknowledgeAlert: (id: string) => void;
  generateAlertsFromSchedule: (schedule: any[], equipmentList: any[]) => void;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],
  addAlert: (alert) =>
    set((s) => ({
      alerts: [
        { ...alert, id: crypto.randomUUID(), timestamp: new Date().toISOString(), acknowledged: false },
        ...s.alerts,
      ],
    })),
  acknowledgeAlert: (id) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),
  generateAlertsFromSchedule: (schedule, equipmentList) => {
    const newAlerts: Alert[] = [];
    schedule
      .filter((s: any) => s.riskLevel === "High")
      .forEach((s: any) => {
        const eq = equipmentList.find((e: any) => e.id === s.equipmentId);
        if (!get().alerts.some((a) => a.equipmentId === s.equipmentId && !a.acknowledged)) {
          newAlerts.push({
            id: crypto.randomUUID(),
            equipmentId: s.equipmentId,
            equipmentName: eq?.name || s.equipmentId,
            type: "critical",
            message: `${s.issue}: ${s.suggestedAction}`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
      });
    if (newAlerts.length > 0) {
      set((s) => ({ alerts: [...newAlerts, ...s.alerts] }));
    }
  },
}));
