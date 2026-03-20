export type RiskLevel = "High" | "Medium" | "Low";

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  date: string;
  logText: string;
  actionTaken?: string;
  riskLevel?: RiskLevel;
  reason?: string;
}

export interface ScheduleEntry {
  equipmentId: string;
  riskLevel: RiskLevel;
  issue: string;
  suggestedAction: string;
  explanation: string;
  priority: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
