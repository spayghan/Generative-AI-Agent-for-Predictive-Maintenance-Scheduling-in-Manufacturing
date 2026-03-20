export type RiskLevel = "High" | "Medium" | "Low";

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  date: string;
  logText: string;
  actionTaken?: string;
  riskLevel?: RiskLevel;
  reason?: string;
  operator?: string;
  logType?: string;
  severity?: string;
}

export interface ScheduleEntry {
  equipmentId: string;
  riskLevel: RiskLevel;
  issue: string;
  suggestedAction: string;
  explanation: string;
  priority: number;
  scheduledDate?: string;
  team?: string;
  estimatedHours?: number;
  status?: "Pending" | "In Progress" | "Completed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  zone: string;
  healthScore: number;
  age: number;
  lastServiced: string;
}
