import { MaintenanceLog, RiskLevel, ScheduleEntry } from "./types";

const HIGH_PATTERNS = [
  { keywords: ["overheating", "overheat", "temperature exceeded"], issue: "Overheating", action: "Immediate shutdown and cooling system inspection required", explanation: "Repeated overheating events can cause permanent motor damage, bearing seizure, and fire risk. Thermal stress accelerates insulation degradation exponentially." },
  { keywords: ["vibration increasing", "vibration worsening", "unusual harmonic"], issue: "Critical Vibration", action: "Emergency bearing inspection and dynamic balancing", explanation: "Escalating vibration indicates progressive mechanical degradation — likely bearing failure, shaft misalignment, or rotor imbalance approaching catastrophic threshold." },
  { keywords: ["emergency shutdown", "emergency"], issue: "Emergency Condition", action: "Full system diagnostic before restart", explanation: "Emergency shutdowns indicate operating conditions exceeded safety limits. Root cause must be identified before equipment is returned to service." },
  { keywords: ["winding degradation", "insulation resistance dropping"], issue: "Electrical Degradation", action: "Motor winding inspection and insulation testing", explanation: "Declining insulation resistance precedes winding failure. If unchecked, this leads to short circuits, arcing, and potential equipment destruction." },
];

const MEDIUM_PATTERNS = [
  { keywords: ["leakage", "leak", "oil leak"], issue: "Fluid Leakage", action: "Seal replacement and contamination assessment", explanation: "Persistent leakage indicates seal failure. Continued operation risks hydraulic system pressure loss, environmental contamination, and downstream component damage." },
  { keywords: ["pressure drop", "pressure loss"], issue: "Pressure Loss", action: "Pneumatic/hydraulic line inspection and compressor check", explanation: "Pressure drops reduce system efficiency and indicate seal degradation, line cracks, or compressor wear that will worsen without intervention." },
  { keywords: ["bearing wear", "metallic particles"], issue: "Bearing Wear", action: "Bearing replacement during next planned downtime", explanation: "Metallic particles in lubricant confirm active wear. The bearing has entered its failure progression — replacement window is limited before seizure occurs." },
  { keywords: ["unusual noise", "gear tooth", "gearbox"], issue: "Mechanical Wear", action: "Gearbox inspection and vibration analysis", explanation: "Abnormal acoustics from gearboxes indicate tooth surface damage. Progressive pitting leads to increased backlash and eventual gear failure." },
];

const LOW_KEYWORDS = ["normal operation", "routine", "within expected range", "preventive maintenance completed", "all parameters normal"];

function matchPatterns(text: string, patterns: typeof HIGH_PATTERNS): typeof HIGH_PATTERNS[0] | null {
  const lower = text.toLowerCase();
  return patterns.find(p => p.keywords.some(k => lower.includes(k))) || null;
}

export function analyzeLog(log: MaintenanceLog): MaintenanceLog {
  const text = log.logText.toLowerCase();

  if (LOW_KEYWORDS.some(k => text.includes(k))) {
    return { ...log, riskLevel: "Low", reason: "Equipment operating within normal parameters. No anomalies detected." };
  }

  const highMatch = matchPatterns(text, HIGH_PATTERNS);
  if (highMatch) return { ...log, riskLevel: "High", reason: highMatch.issue + ": " + highMatch.explanation.split(".")[0] + "." };

  const medMatch = matchPatterns(text, MEDIUM_PATTERNS);
  if (medMatch) return { ...log, riskLevel: "Medium", reason: medMatch.issue + ": " + medMatch.explanation.split(".")[0] + "." };

  // Default to medium if unrecognized issue language
  if (text.includes("detected") || text.includes("observed") || text.includes("issue") || text.includes("degraded")) {
    return { ...log, riskLevel: "Medium", reason: "Anomaly detected in log description. Requires further investigation to assess severity." };
  }

  return { ...log, riskLevel: "Low", reason: "No concerning patterns identified in this log entry." };
}

export function analyzeLogs(logs: MaintenanceLog[]): MaintenanceLog[] {
  return logs.map(analyzeLog);
}

export function generateSchedule(logs: MaintenanceLog[]): ScheduleEntry[] {
  const analyzed = analyzeLogs(logs);
  const equipmentMap = new Map<string, MaintenanceLog[]>();

  analyzed.forEach(log => {
    const existing = equipmentMap.get(log.equipmentId) || [];
    existing.push(log);
    equipmentMap.set(log.equipmentId, existing);
  });

  const schedule: ScheduleEntry[] = [];

  equipmentMap.forEach((eqLogs, equipmentId) => {
    // Use highest risk level found
    const riskOrder: Record<RiskLevel, number> = { High: 3, Medium: 2, Low: 1 };
    const sorted = eqLogs.sort((a, b) => riskOrder[b.riskLevel!] - riskOrder[a.riskLevel!]);
    const worstLog = sorted[0];
    const riskLevel = worstLog.riskLevel!;

    const highMatch = matchPatterns(worstLog.logText, HIGH_PATTERNS);
    const medMatch = matchPatterns(worstLog.logText, MEDIUM_PATTERNS);
    const match = highMatch || medMatch;

    const actionMap: Record<RiskLevel, string> = {
      High: "Immediate action required",
      Medium: "Schedule planned maintenance",
      Low: "Include in routine check cycle",
    };

    schedule.push({
      equipmentId,
      riskLevel,
      issue: match?.issue || worstLog.reason?.split(":")[0] || "General maintenance",
      suggestedAction: match?.action || actionMap[riskLevel],
      explanation: match?.explanation || worstLog.reason || "Standard maintenance protocol applies.",
      priority: riskOrder[riskLevel],
    });
  });

  return schedule.sort((a, b) => b.priority - a.priority);
}

export function chatResponse(query: string, logs: MaintenanceLog[], schedule: ScheduleEntry[]): string {
  const q = query.toLowerCase();

  if (q.includes("high risk") || q.includes("critical") || q.includes("urgent")) {
    const highRisk = schedule.filter(s => s.riskLevel === "High");
    if (highRisk.length === 0) return "Good news — no equipment is currently classified as high risk based on the analyzed logs.";
    return `**${highRisk.length} equipment item(s) at high risk:**\n\n${highRisk.map(s =>
      `- **${s.equipmentId}**: ${s.issue} — ${s.suggestedAction}`
    ).join("\n")}`;
  }

  // Check for specific equipment query
  const eqMatch = q.match(/m-\d+/i);
  if (eqMatch) {
    const eqId = eqMatch[0].toUpperCase();
    const entry = schedule.find(s => s.equipmentId === eqId);
    const eqLogs = logs.filter(l => l.equipmentId === eqId);
    if (!entry) return `No data found for equipment ${eqId}. Please check the equipment ID and try again.`;
    return `**${eqId} — Risk Level: ${entry.riskLevel}**\n\n**Issue:** ${entry.issue}\n**Action:** ${entry.suggestedAction}\n\n**Explanation:** ${entry.explanation}\n\n**Log history:** ${eqLogs.length} entries recorded. Most recent: "${eqLogs[eqLogs.length - 1]?.logText}"`;
  }

  if (q.includes("schedule") || q.includes("maintenance plan")) {
    return `**Current Maintenance Schedule (${schedule.length} items):**\n\n| Equipment | Risk | Action |\n|---|---|---|\n${schedule.map(s =>
      `| ${s.equipmentId} | ${s.riskLevel} | ${s.suggestedAction} |`
    ).join("\n")}`;
  }

  if (q.includes("summary") || q.includes("overview") || q.includes("status")) {
    const high = schedule.filter(s => s.riskLevel === "High").length;
    const med = schedule.filter(s => s.riskLevel === "Medium").length;
    const low = schedule.filter(s => s.riskLevel === "Low").length;
    return `**System Overview:**\n\n- 🔴 **${high}** high-risk equipment\n- 🟡 **${med}** medium-risk equipment\n- 🟢 **${low}** low-risk equipment\n\nTotal logs analyzed: ${logs.length}\nEquipment monitored: ${schedule.length}`;
  }

  if (q.includes("help") || q.includes("what can")) {
    return "I can help you with:\n\n- **\"Which machines are high risk?\"** — View critical equipment\n- **\"Why is M-101 critical?\"** — Get details on specific equipment\n- **\"Show maintenance schedule\"** — View the full schedule\n- **\"Give me a summary\"** — System overview\n- Ask about any equipment by ID (e.g., M-102, M-104)";
  }

  return "I can answer questions about equipment risk levels, maintenance schedules, and specific machine status. Try asking:\n\n- \"Which machines are high risk?\"\n- \"Why is M-101 critical?\"\n- \"Show the maintenance schedule\"\n- \"Give me a system overview\"";
}
