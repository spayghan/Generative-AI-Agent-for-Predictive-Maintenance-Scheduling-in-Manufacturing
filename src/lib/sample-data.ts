import { MaintenanceLog } from "./types";

export const sampleLogs: MaintenanceLog[] = [
  { id: "1", equipmentId: "M-101", date: "2026-03-01", logText: "Motor overheating detected during peak load. Temperature exceeded threshold by 15°C.", actionTaken: "Reduced load temporarily" },
  { id: "2", equipmentId: "M-101", date: "2026-03-05", logText: "Vibration levels increasing on main bearing. Unusual harmonic pattern observed.", actionTaken: "Scheduled inspection" },
  { id: "3", equipmentId: "M-102", date: "2026-03-02", logText: "Oil leakage detected near hydraulic valve assembly. Approximately 200ml lost.", actionTaken: "Tightened fittings" },
  { id: "4", equipmentId: "M-103", date: "2026-03-03", logText: "Normal operation. All parameters within expected range.", actionTaken: "Routine check completed" },
  { id: "5", equipmentId: "M-104", date: "2026-03-04", logText: "Pressure drop observed in pneumatic line. System efficiency reduced by 12%." },
  { id: "6", equipmentId: "M-105", date: "2026-03-06", logText: "Bearing wear detected. Metallic particles found in lubricant sample.", actionTaken: "Ordered replacement parts" },
  { id: "7", equipmentId: "M-101", date: "2026-03-10", logText: "Motor overheating again. Cooling fan appears degraded. Vibration worsening.", actionTaken: "Emergency shutdown initiated" },
  { id: "8", equipmentId: "M-106", date: "2026-03-08", logText: "Electrical insulation resistance dropping. Potential winding degradation.", actionTaken: "Monitoring increased" },
  { id: "9", equipmentId: "M-102", date: "2026-03-12", logText: "Leakage continues despite repair. Seal replacement required.", actionTaken: "Parts on order" },
  { id: "10", equipmentId: "M-107", date: "2026-03-09", logText: "Normal operation. Preventive maintenance completed on schedule." },
  { id: "11", equipmentId: "M-104", date: "2026-03-14", logText: "Pressure drop worsening. Compressor output below minimum threshold.", actionTaken: "Compressor inspection scheduled" },
  { id: "12", equipmentId: "M-108", date: "2026-03-11", logText: "Unusual noise from gearbox. Possible gear tooth damage.", actionTaken: "Vibration analysis ordered" },
];
