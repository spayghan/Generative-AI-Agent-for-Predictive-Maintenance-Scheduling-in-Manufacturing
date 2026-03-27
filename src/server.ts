import express from 'express';
import cors from 'cors';
import { sendResolutionEmail } from './services/email-service';

const app = express();
app.use(cors());
app.use(express.json());

// This is the endpoint the Admin clicks
app.post('/api/resolve-issue', async (req, res) => {
  const { employeeEmail, machineId, issueType } = req.body;

  if (!employeeEmail) {
    return res.status(400).json({ error: "Employee email is required" });
  }

  // 1. Trigger the Email function
  const result = await sendResolutionEmail(employeeEmail, machineId, issueType);

  if (result.success) {
    res.json({ message: "Employee notified successfully via Gmail" });
  } else {
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(3001, () => console.log("🚀 MaintainIQ Backend live on port 3001"));