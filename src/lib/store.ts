import { create } from "zustand";
import { MaintenanceLog, ScheduleEntry, ChatMessage } from "./types";
import { analyzeLogs, generateSchedule } from "./ai-engine";
import { sampleLogs } from "./sample-data";

interface AppState {
  logs: MaintenanceLog[];
  analyzedLogs: MaintenanceLog[];
  schedule: ScheduleEntry[];
  chatMessages: ChatMessage[];
  isAnalyzing: boolean;
  setLogs: (logs: MaintenanceLog[]) => void;
  loadSampleData: () => void;
  runAnalysis: () => Promise<void>;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  logs: [],
  analyzedLogs: [],
  schedule: [],
  chatMessages: [],
  isAnalyzing: false,

  setLogs: (logs) => set({ logs, analyzedLogs: [], schedule: [] }),

  loadSampleData: () => {
    set({ logs: sampleLogs, analyzedLogs: [], schedule: [] });
  },

  runAnalysis: async () => {
    set({ isAnalyzing: true });
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    const { logs } = get();
    const analyzed = analyzeLogs(logs);
    const schedule = generateSchedule(logs);
    set({ analyzedLogs: analyzed, schedule, isAnalyzing: false });
  },

  addChatMessage: (msg) => set(s => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
}));
