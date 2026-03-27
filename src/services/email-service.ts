import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shashvatpayghan453@gmail.com', // Your actual Gmail
    pass: 'fesvnxrkbhbjhcep',             // Your App Password
  },
});

export async function sendResolutionEmail(employeeEmail: string, equipmentId: string, issueType: string) {
  const mailOptions = {
    // Make sure the "from" uses your actual gmail address
    from: '"MaintainIQ System" <shashvatpayghan453@gmail.com>',
    to: employeeEmail,
    subject: `✅ Issue Resolved: ${equipmentId}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #10b981; margin-top: 0;">Maintenance Task Completed</h2>
          <p style="color: #334155; font-size: 16px;">Hello,</p>
          <p style="color: #334155; line-height: 1.6;">Great news! The engineering team has successfully resolved the issue you reported.</p>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Machine:</strong> ${equipmentId}</p>
            <p style="margin: 5px 0;"><strong>Issue Type:</strong> ${issueType}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Operational</span></p>
          </div>
          
          <p style="color: #334155;">The equipment is now safe to use. Thank you for your proactive reporting.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated message from the <strong>MaintainIQ Generative AI Agent</strong>.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Resolution email sent to ${employeeEmail}. Message ID: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    return { success: false, error };
  }
}