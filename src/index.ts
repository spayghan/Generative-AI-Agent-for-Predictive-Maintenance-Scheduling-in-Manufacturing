// import { sendResolutionEmail } from "./services/email-service.js";

// Add this route to your existing index.ts
// backend/src/index.ts

// app.post("/api/resolve-issue", async (req, res) => {
//   // Check these names! They must match the Frontend JSON exactly
//   const { employeeEmail, equipmentId, issueType } = req.body;

//   if (!employeeEmail || !equipmentId) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // Pass them to the email service
//   const result = await sendResolutionEmail(employeeEmail, equipmentId, issueType);

//   if (result.success) {
//     res.json({ success: true });
//   } else {
//     res.status(500).json({ error: "Email failed" });
//   }
// });

// --- 3. ROUTE FOR ANALYSIS (Heuristics) ---
// app.post('/api/analyze', (req, res) => {
//   const { logs } = req.body;
//   const analyzed = logs.map((log: any) => {
//     let risk = "Low";
//     if (log.logText.toLowerCase().includes("vibration")) risk = "High";
//     else if (log.logText.toLowerCase().includes("leak")) risk = "Medium";
//     return { ...log, riskLevel: risk };
//   });
//   res.json(analyzed);
// });

// // --- 4. ROUTE FOR EMAIL RESOLUTION ---
// app.post('/api/resolve-issue', async (req, res) => {
//   const { employeeEmail, machineId, issueType } = req.body;
//   const result = await sendResolutionEmail(employeeEmail, machineId, issueType);
//   res.json({ success: result.success });
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`✅ MaintainIQ Agent Backend running on http://localhost:${PORT}`);
// });

// backend/src/index.ts
import express from "express";
import cors from "cors";
import "dotenv/config"; 
import { analyzeLogs, generateSchedule, chatResponse } from "./ai-engine.js";
import { sampleLogs } from "./sample-data.js";
import { sendResolutionEmail } from "./services/email-service.js"; // Import the service

const app = express();
const port = process.env.PORT || 3001;

// MIDDLEWARE (Critical: These must come BEFORE routes)
app.use(cors());
app.use(express.json()); // This allows the backend to read req.body

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. Get Sample Data
app.get("/api/sample-data", (req, res) => {
  res.json(sampleLogs);
});

// 3. Analyze Logs Logic
app.post("/api/analyze", (req, res) => {
  const { logs } = req.body;
  if (!logs) return res.status(400).json({ error: "Missing logs" });
  
  const analyzed = analyzeLogs(logs);
  const schedule = generateSchedule(logs);
  
  res.json({ analyzed, schedule });
});

// 4. AI Chat Logic
app.post("/api/chat", (req, res) => {
  const { query, logs, schedule } = req.body;
  if (!query || !logs || !schedule) return res.status(400).json({ error: "Missing parameters" });
  
  const response = chatResponse(query, logs, schedule);
  res.json({ response });
});

// 5. EMAIL NOTIFICATION ROUTE (The one you just added)
app.post("/api/resolve-issue", async (req, res) => {
  try {
    const { employeeEmail, equipmentId, issueType } = req.body;

    console.log(`Attempting to send email to: ${employeeEmail} for ${equipmentId}`);

    if (!employeeEmail || !equipmentId) {
      return res.status(400).json({ error: "Missing employeeEmail or equipmentId" });
    }

    // Call the service you created
    const result = await sendResolutionEmail(
      employeeEmail, 
      equipmentId, 
      issueType || "General Maintenance"
    );

    if (result.success) {
      res.json({ success: true, message: "Resolution email sent" });
    } else {
      res.status(500).json({ error: "Nodemailer failed", details: result.error });
    }
  } catch (error) {
    console.error("Server Error in resolve-issue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 MaintainIQ Backend running on http://localhost:${port}`);
});